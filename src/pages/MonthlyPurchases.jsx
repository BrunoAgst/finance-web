import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
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

function MonthlyPurchases() {
  const navigate = useNavigate();

  // Dados de exemplo (remover quando implementar API)
  // eslint-disable-next-line no-unused-vars
  const [purchases, setPurchases] = useState([
    {
      id: "1",
      name: "Shoppe",
      amount: 130.0,
      category: "CREDIT",
      date: "2026-02-05",
    },
    {
      id: "2",
      name: "Ali",
      amount: 50.0,
      category: "PIX",
      date: "2026-02-03",
    },
    {
      id: "3",
      name: "Mercado",
      amount: 250.0,
      category: "DEBIT",
      date: "2026-02-01",
    },
  ]);

  // Obter o mês atual
  const now = new Date();
  const currentMonth = now.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    // TODO: Implementar chamada para API
    // Exemplo:
    // fetch('/api/purchases/monthly')
    //   .then(res => res.json())
    //   .then(data => setPurchases(data))
    //   .catch(err => console.error(err));
  }, []);

  const handlePurchaseClick = (purchase) => {
    navigate("/details", { state: { debit: purchase } });
  };

  const totalAmount = purchases.reduce(
    (sum, purchase) => sum + purchase.amount,
    0,
  );

  // Agrupar compras por categoria para o gráfico
  const categoryData = purchases.reduce((acc, purchase) => {
    const existing = acc.find((item) => item.name === purchase.category);
    if (existing) {
      existing.value += purchase.amount;
    } else {
      acc.push({ name: purchase.category, value: purchase.amount });
    }
    return acc;
  }, []);

  // Cores para o gráfico de pizza
  const COLORS = {
    CREDIT: "#3b82f6",
    DEBIT: "#10b981",
    PIX: "#8b5cf6",
    INSTALLMENT_CREDIT: "#f59e0b",
  };

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
          <p className="text-gray-600 capitalize">{currentMonth}</p>
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
              {purchases.map((purchase) => (
                <li
                  key={purchase.id}
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
                    <p className="text-xs text-gray-500">{purchase.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      R$ {purchase.amount.toFixed(2)}
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
