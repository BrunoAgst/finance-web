import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AddDebit from "./AddDebit";
import ViewDebit from "./ViewDebit";
import UserHeader from "../components/UserHeader";
import Button from "../components/Button";
import logo from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";
import { getDebts, getDebtsByMonth } from "../services/api";

function Home() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDebts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        throw new Error("Token não disponível. Acesse sua conta novamente.");
      }

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // 1-12

      const [data, monthlyData] = await Promise.all([
        getDebts(token),
        getDebtsByMonth(token, currentMonth, currentDate.getFullYear()),
      ]);

      // Calcular total considerando parcelas
      const monthlyExpenses = monthlyData.reduce((total, debt) => {
        // Para parcelados, considera o valor da parcela
        if (debt.category.includes("INSTALLMENT") && debt.installmentAmount) {
          return total + debt.installmentAmount;
        }
        return total + debt.amount;
      }, 0);

      setDebts(data);
      setMonthlyTotal(monthlyExpenses);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      setError(error.message || "Não foi possível carregar as transações.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  return (
    <div className="w-screen h-screen bg-slate-50 flex flex-col items-center p-6 relative overflow-y-auto">
      <UserHeader />
      <div className="flex flex-col gap-10 items-center py-10 w-full">
        <img src={logo} alt="Duocash" className="w-32 h-32" />
        <h1 className="text-2xl font-bold text-gray-900 -mt-4 mb-2">Duocash</h1>

        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <h2 className="text-gray-600 text-sm font-medium mb-2">
            Gasto no Mês
          </h2>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-500">Carregando...</p>
            </div>
          ) : error ? (
            <div role="alert">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchDebts} className="w-full mt-4">
                Tentar novamente
              </Button>
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900">
                R${" "}
                {monthlyTotal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <Button
                onClick={() => navigate("/monthly")}
                className="w-full mt-4"
              >
                Ver Compras do Mês
              </Button>
            </>
          )}
        </div>

        <AddDebit onDebtCreated={fetchDebts} />
        {!error && (
          <ViewDebit debts={debts} loading={loading} onDebtDeleted={fetchDebts} />
        )}
      </div>
    </div>
  );
}

export default Home;
