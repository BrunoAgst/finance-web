import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import UserHeader from "../components/UserHeader";
import { useAuth } from "../hooks/useAuth";
import { updateDebt, translateCategory } from "../services/api";

function EditDebit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const debit = location.state?.debit;

  const [name, setName] = useState(debit?.name || "");
  const [amount, setAmount] = useState(debit?.amount || "");
  const category = debit?.category || "";
  const [date, setDate] = useState(debit?.date ? debit.date.split("T")[0] : "");
  const [fixed, setFixed] = useState(
    debit?.fixed ? "yes" : debit?.fixed === false ? "no" : "",
  );
  const [installment, setInstallment] = useState(
    debit?.installmentNumber || "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token não disponível");
      }

      const formattedDate = new Date(date + "T00:00:00").toISOString();

      const debtData = {
        name,
        amount: parseFloat(amount),
        date: formattedDate,
        category,
        fixed: fixed === "yes",
        installmentNumber:
          category === "INSTALLMENT_CREDIT" && installment
            ? parseInt(installment)
            : null,
      };

      await updateDebt(token, debit.id, debtData);
      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message || "Erro ao atualizar transação");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("//");
  };

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
        <h2 className="text-2xl font-bold mb-6 text-center">Editar</h2>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Transação atualizada com sucesso!
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
            placeholder="Nome"
            required
          />
          <Input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            type="number"
            placeholder="Valor"
            required
          />
          <Input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            type="date"
            max={new Date().toISOString().split("T")[0]}
            required
          />
          <div className="bg-gray-100 rounded-lg p-3 border border-gray-300">
            <label className="text-sm font-medium text-gray-600">
              Categoria
            </label>
            <p className="text-base text-gray-900 mt-1">
              {translateCategory(category)}
            </p>
          </div>
          {category !== "INSTALLMENT_CREDIT" && category && (
            <Select
              value={fixed}
              onChange={(e) => setFixed(e.target.value)}
              required
            >
              <option value="">Este gasto é fixo?</option>
              <option value="no">Não</option>
              <option value="yes">Sim</option>
            </Select>
          )}
          {category === "INSTALLMENT_CREDIT" && (
            <Input
              value={installment}
              onChange={(e) => setInstallment(e.target.value)}
              type="number"
              placeholder="Quantidade de Parcelas"
              min={2}
              max={12}
              required
            />
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
            <Button type="button" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDebit;
