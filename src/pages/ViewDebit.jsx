import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrashIcon, PencilIcon } from "lucide-react";
import Button from "../components/Button";
import { formatDate, translateCategory, deleteDebt } from "../services/api";
import { useAuth } from "../hooks/useAuth";

function ViewDebit({ debts = [], loading = false, onDebtDeleted }) {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [deleting, setDeleting] = useState(null);

  const recentDebts = [...debts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  function onEditDebitClick(debit) {
    navigate("/edit", { state: { debit } });
  }

  async function onDeleteDebitClick(debit) {
    if (!window.confirm(`Deseja realmente excluir "${debit.name}"?`)) {
      return;
    }

    try {
      setDeleting(debit.id);
      const token = getToken();

      if (!token) {
        throw new Error("Token não disponível");
      }

      await deleteDebt(token, debit.id);

      if (onDebtDeleted) {
        onDebtDeleted();
      }
    } catch (error) {
      alert("Erro ao excluir transação: " + error.message);
    } finally {
      setDeleting(null);
    }
  }

  function onDebitClick(debit) {
    navigate("/details", { state: { debit } });
  }

  if (loading) {
    return (
      <div className="w-full max-w-md flex justify-center items-center py-8">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Carregando transações...</p>
        </div>
      </div>
    );
  }

  if (recentDebts.length === 0) {
    return (
      <div className="w-full max-w-md flex justify-center items-center py-8">
        <p className="text-gray-500">Nenhuma transação encontrada</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Últimas Transações
      </h3>
      <div className="max-h-96 overflow-y-auto pr-2">
        <ul className="flex flex-col gap-3">
          {recentDebts.map((debit, index) => (
            <li
              key={`${debit.name}-${debit.date}-${index}`}
              onClick={() => onDebitClick(debit)}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{debit.name}</p>
                <p className="text-sm text-gray-600">
                  R$ {debit.amount.toFixed(2)}
                </p>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>{translateCategory(debit.category)}</span>
                  {debit.installmentNumber && (
                    <span>{debit.installmentNumber}x</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {formatDate(debit.date)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditDebitClick(debit);
                  }}
                >
                  <PencilIcon size={16} />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDebitClick(debit);
                  }}
                  disabled={deleting === debit.id}
                >
                  {deleting === debit.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <TrashIcon size={16} />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ViewDebit;
