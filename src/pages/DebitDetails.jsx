import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import UserHeader from "../components/UserHeader";
import { ArrowLeftIcon } from "lucide-react";

function DebitDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const debit = location.state?.debit;

  if (!debit) {
    return (
      <div className="w-screen h-screen bg-slate-50 flex justify-center items-center p-6 relative">
        <UserHeader />
        <div className="text-center">
          <p className="text-gray-600 mb-4">Nenhum débito selecionado</p>
          <Button onClick={() => navigate("/")}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative">
      <UserHeader />
      <div className="w-full max-w-md">
        <Button onClick={() => navigate("/")} className="mb-6">
          <div className="flex items-center gap-2">
            <ArrowLeftIcon size={20} />
            Voltar
          </div>
        </Button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Detalhes</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nome</label>
              <p className="text-lg text-gray-900 mt-1">{debit.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Valor</label>
              <p className="text-lg text-gray-900 mt-1">
                R$ {debit.amount.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Categoria
              </label>
              <p className="text-lg text-gray-900 mt-1">{debit.category}</p>
            </div>

            {debit.date && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Data
                </label>
                <p className="text-lg text-gray-900 mt-1">{debit.date}</p>
              </div>
            )}

            {debit.installment && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Parcelas
                </label>
                <p className="text-lg text-gray-900 mt-1">
                  {debit.installment}
                </p>
              </div>
            )}

            {debit.fixed !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Fixo
                </label>
                <p className="text-lg text-gray-900 mt-1">
                  {debit.fixed ? "Sim" : "Não"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebitDetails;
