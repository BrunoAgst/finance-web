const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDebts = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/debts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar transações: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    throw error;
  }
};

export const getDebtsByMonth = async (token, month) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/debts/month/${month}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar transações do mês: ${response.status}`);
    }

    return await response.json();
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
    const response = await fetch(`${API_BASE_URL}/v1/debts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(debtData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da API:", response.status, errorText);
      throw new Error(
        `Erro ao criar transação: ${response.status} - ${errorText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    throw error;
  }
};

export const deleteDebt = async (token, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/debts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar transação: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    throw error;
  }
};

export const updateDebt = async (token, id, debtData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/debts/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(debtData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da API:", response.status, errorText);
      throw new Error(
        `Erro ao atualizar transação: ${response.status} - ${errorText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    throw error;
  }
};
