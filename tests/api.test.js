import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { transformWithEsbuild } from "vite";

const source = await readFile(new URL("../src/services/api.js", import.meta.url), "utf8");
const { code } = await transformWithEsbuild(source, "api.js", {
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify("https://api.example.test"),
  },
});
const { getDebtsByMonth } = await import(`data:text/javascript,${encodeURIComponent(code)}`);

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
