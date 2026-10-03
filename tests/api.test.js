import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { transformWithEsbuild } from "vite";

const source = await readFile(new URL("../src/services/api.js", import.meta.url), "utf8");
const loadApi = async (baseUrl = "https://api.example.test") => {
  const { code } = await transformWithEsbuild(source, "api.js", {
    define: {
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(baseUrl),
    },
  });
  return import(`data:text/javascript,${encodeURIComponent(code)}`);
};
const { getDebts, getDebtsByMonth, createDebt, updateDebt, deleteDebt } = await loadApi();

test("monthly request sends the selected year and preserves installment data", async (t) => {
  const data = [{ installmentDueDate: "2027-01-01", installmentAmount: 100 }];
  const fetchMock = t.mock.method(globalThis, "fetch", async () => ({
    ok: true,
    json: async () => data,
  }));

  assert.deepEqual(await getDebtsByMonth("test-token", 1, 2027), data);
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, "https://api.example.test/v1/debts/month/1?year=2027");
  assert.equal(options.method, "GET");
  assert.equal(options.headers.Authorization, "Bearer test-token");
});

test("monthly request defaults to the current year for existing callers", async (t) => {
  const year = new Date().getFullYear();
  const fetchMock = t.mock.method(globalThis, "fetch", async () => ({
    ok: true,
    json: async () => [],
  }));

  await getDebtsByMonth("test-token", 10);
  assert.equal(
    fetchMock.mock.calls[0].arguments[0],
    `https://api.example.test/v1/debts/month/10?year=${year}`,
  );
});

test("monthly request propagates API errors instead of returning an empty list", async (t) => {
  t.mock.method(globalThis, "fetch", async () => ({ ok: false, status: 500 }));
  const logMock = t.mock.method(console, "error", () => {});

  await assert.rejects(getDebtsByMonth("test-token", 1, 2027), /500/);
  assert.equal(logMock.mock.callCount(), 1);
});

test("initial dashboard requests preserve endpoints and authentication", async (t) => {
  const data = [{ amount: 120, category: "DEBIT" }];
  const fetchMock = t.mock.method(globalThis, "fetch", async () => ({
    ok: true,
    json: async () => data,
  }));

  assert.deepEqual(await getDebts("test-token"), data);
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, "https://api.example.test/v1/debts");
  assert.equal(options.method, "GET");
  assert.equal(options.headers.Authorization, "Bearer test-token");
  assert.equal(options.signal.aborted, false);
});

test("a stalled request is aborted at exactly 15 seconds and rejects visibly", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  t.mock.method(console, "error", () => {});
  let signal;
  t.mock.method(globalThis, "fetch", (_url, options) => {
    signal = options.signal;
    return new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    });
  });

  const rejection = assert.rejects(getDebts("test-token"), /15 segundos/);
  t.mock.timers.tick(14999);
  assert.equal(signal.aborted, false);
  t.mock.timers.tick(1);
  assert.equal(signal.aborted, true);
  await rejection;
});

test("the timeout also covers a stalled response body", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  t.mock.method(console, "error", () => {});
  let signal;
  let readingBody;
  const bodyStarted = new Promise((resolve) => { readingBody = resolve; });
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    signal = options.signal;
    return {
      ok: true,
      json: () => new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        readingBody();
      }),
    };
  });

  const rejection = assert.rejects(getDebtsByMonth("test-token", 10, 2026), /15 segundos/);
  await bodyStarted;
  t.mock.timers.tick(15000);
  await rejection;
  assert.equal(signal.aborted, true);
});

test("a write timeout warns that the operation may have reached the backend", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  t.mock.method(console, "error", () => {});
  t.mock.method(globalThis, "fetch", (_url, { signal }) => (
    new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    })
  ));

  const rejection = assert.rejects(
    createDebt("test-token", { amount: 50 }),
    /Não foi possível confirmar a operação. Atualize a página/,
  );
  t.mock.timers.tick(15000);
  await rejection;
});

test("successful requests clear the timeout and can be retried after a failure", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  t.mock.method(console, "error", () => {});
  let fail = true;
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    if (fail) throw new TypeError("Failed to fetch");
    return { ok: true, json: async () => [] };
  });

  await assert.rejects(getDebts("test-token"), /Failed to fetch/);
  fail = false;
  assert.deepEqual(await getDebts("test-token"), []);
  t.mock.timers.tick(15000);
  for (const call of fetchMock.mock.calls) {
    assert.equal(call.arguments[1].signal.aborted, false);
  }
});

test("missing API configuration fails before sending a request", async (t) => {
  const api = await loadApi("");
  t.mock.method(console, "error", () => {});
  const fetchMock = t.mock.method(globalThis, "fetch", () => {});

  await assert.rejects(api.getDebts("test-token"), /VITE_API_BASE_URL/);
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("a trailing slash in the API base URL does not duplicate path separators", async (t) => {
  const api = await loadApi("https://api.example.test/");
  const fetchMock = t.mock.method(globalThis, "fetch", async () => ({
    ok: true,
    json: async () => [],
  }));

  await api.getDebts("test-token");
  assert.equal(fetchMock.mock.calls[0].arguments[0], "https://api.example.test/v1/debts");
});

test("write and delete requests preserve their methods, payloads and responses", async (t) => {
  const data = { id: "123", name: "Compra", amount: 50 };
  const fetchMock = t.mock.method(globalThis, "fetch", async () => ({
    ok: true,
    json: async () => data,
  }));

  assert.deepEqual(await createDebt("test-token", data), data);
  assert.deepEqual(await updateDebt("test-token", "123", data), data);
  assert.equal(await deleteDebt("test-token", "123"), true);
  const calls = fetchMock.mock.calls.map(({ arguments: [url, options] }) => ({
    url,
    method: options.method,
    body: options.body,
  }));
  assert.deepEqual(calls, [
    { url: "https://api.example.test/v1/debts", method: "POST", body: JSON.stringify(data) },
    { url: "https://api.example.test/v1/debts/123", method: "PATCH", body: JSON.stringify(data) },
    { url: "https://api.example.test/v1/debts/123", method: "DELETE", body: undefined },
  ]);
});

test("write errors preserve the backend status and details", async (t) => {
  t.mock.method(console, "error", () => {});
  t.mock.method(globalThis, "fetch", async () => ({
    ok: false,
    status: 400,
    text: async () => "Dados inválidos",
  }));

  await assert.rejects(createDebt("test-token", {}), /HTTP 400 - Dados inválidos/);
});
