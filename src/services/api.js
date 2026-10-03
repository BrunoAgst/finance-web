const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REQUEST_TIMEOUT_MS = 15000;

const requestApi = async (path, token, method = "GET", body) => {
  if (!API_BASE_URL?.trim()) {
    throw new Error("URL da API não configurada (VITE_API_BASE_URL).");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${API_BASE_URL.trim().replace(/\/+$/, "")}${path}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      },
    );

    if (!response.ok) {
      const details = body === undefined ? "" : await response.text();
      throw new Error(`HTTP ${response.status}${details ? ` - ${details}` : ""}`);
    }

    return method === "DELETE" ? true : await response.json();
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        method === "GET"
          ? "A API não respondeu em 15 segundos. Verifique sua conexão e tente novamente."
          : "A API não respondeu em 15 segundos. Não foi possível confirmar a operação. Atualize a página antes de tentar novamente.",
        { cause: error },
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const getDebts = async (token) => {
  try {
    return await requestApi("/v1/debts", token);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    throw error;
  }
};

export const getDebtsByMonth = async (
  token,
  month,
  year = new Date().getFullYear(),
) => {
  try {
    return await requestApi(`/v1/debts/month/${month}?year=${year}`, token);
  } catch (error) {
    console.error("Erro ao buscar transações do mês:", error);
    throw error;
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  // Extrair apenas a parte da data (YYYY-MM-DD) para evitar problemas de timezone
  const dateOnly = dateString.split("T")[0];
  const [year, month, day] = dateOnly.split("-");
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
};

export const translateCategory = (category) => {
  const translations = {
    CREDIT: "Crédito",
    DEBIT: "Débito",
    PIX: "PIX",
    INSTALLMENT_CREDIT: "Parcelado",
    BILLET: "Boleto",
  };
  return translations[category] || category;
};

export const createDebt = async (token, debtData) => {
  try {
    return await requestApi("/v1/debts", token, "POST", debtData);
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    throw error;
  }
};

export const deleteDebt = async (token, id) => {
  try {
    return await requestApi(`/v1/debts/${id}`, token, "DELETE");
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    throw error;
  }
};

export const updateDebt = async (token, id, debtData) => {
  try {
    return await requestApi(`/v1/debts/${id}`, token, "PATCH", debtData);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    throw error;
  }
};
