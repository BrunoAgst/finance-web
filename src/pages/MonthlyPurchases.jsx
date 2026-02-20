import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import Button from "../components/Button";
import UserHeader from "../components/UserHeader";
import { useAuth } from "../hooks/useAuth";
import { getDebtsByMonth, translateCategory } from "../services/api";

function MonthlyPurchases() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // +1 porque getMonth() retorna 0-11
  const [selectedYear] = useState(now.getFullYear());

  const getMonthName = (monthNumber) => {
    const date = new Date(selectedYear, monthNumber - 1, 1);
    return date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchMonthlyPurchases = async () => {
      try {
        setLoading(true);
        const token = getToken();

        if (!token) {
          console.error("Token não disponível");
          setLoading(false);
          return;
        }

        const data = await getDebtsByMonth(token, selectedMonth);
        setPurchases(data);
      } catch (error) {
        console.error("Erro ao buscar compras do mês:", error);
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyPurchases();
  }, [getToken, selectedMonth]);

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => (prev === 1 ? 12 : prev - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => (prev === 12 ? 1 : prev + 1));
  };

  const handlePurchaseClick = (purchase) => {
    navigate("/details", { state: { debit: purchase } });
  };

  // Calcular valor total considerando parcelas
  const totalAmount = purchases.reduce((sum, purchase) => {
    if (
      purchase.category.includes("INSTALLMENT") &&
      purchase.installmentAmount
    ) {
      return sum + purchase.installmentAmount;
    }
    return sum + purchase.amount;
  }, 0);

  // Agrupar compras por categoria para o gráfico
  const categoryData = purchases.reduce((acc, purchase) => {
    const categoryName = translateCategory(purchase.category);
    const value =
      purchase.category.includes("INSTALLMENT") && purchase.installmentAmount
        ? purchase.installmentAmount
        : purchase.amount;

    const existing = acc.find((item) => item.name === categoryName);
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ name: categoryName, value: value });
    }
    return acc;
  }, []);

  // Cores para o gráfico de pizza
  const COLORS = {
    Crédito: "#3b82f6",
    Débito: "#10b981",
    PIX: "#8b5cf6",
    Parcelado: "#f59e0b",
    "Débito Parcelado": "#ef4444",
  };

  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-slate-50 flex flex-col items-center p-6 relative">
      <UserHeader />
      <div className="w-full max-w-2xl mt-20">
        <Button onClick={() => navigate("/")} className="mb-6">
          <div className="flex items-center gap-2">
            <ArrowLeftIcon size={20} />
            Voltar
          </div>
        </Button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gastos do Mês
          </h1>

          {/* Navegação de mês */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeftIcon size={24} className="text-gray-600" />
            </button>

            <p className="text-lg font-medium text-gray-700 capitalize">
              {getMonthName(selectedMonth)}
            </p>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Próximo mês"
            >
              <ChevronRightIcon size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Total:</p>
            <p className="text-2xl font-bold text-gray-900">
              R${" "}
              {totalAmount.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {purchases.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Gastos por Categoria
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name] || "#6b7280"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    `R$ ${value.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {purchases.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">
              Nenhuma compra registrada neste mês.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Lista de Gastos
            </h2>
            <ul className="flex flex-col gap-3">
              {purchases.map((purchase, index) => (
                <li
                  key={`${purchase.name}-${purchase.date}-${index}`}
                  onClick={() => handlePurchaseClick(purchase)}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-gray-900">
                      {purchase.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(purchase.date).toLocaleDateString("pt-BR")}
                    </p>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>{translateCategory(purchase.category)}</span>
                      {purchase.installmentNumber && (
                        <span>{purchase.installmentNumber}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      R${" "}
                      {(purchase.category.includes("INSTALLMENT") &&
                      purchase.installmentAmount
                        ? purchase.installmentAmount
                        : purchase.amount
                      ).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlyPurchases;
