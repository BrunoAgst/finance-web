import { useState } from "react";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { createDebt } from "../services/api";

function AddDebit({ onDebtCreated }) {
  const { getToken } = useAuth();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [fixed, setFixed] = useState("");
  const [installment, setInstallment] = useState("");
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

      await createDebt(token, debtData);

      setName("");
      setAmount("");
      setDate("");
      setCategory("");
      setFixed("");
      setInstallment("");
      setSuccess(true);

      if (onDebtCreated) {
        onDebtCreated();
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Erro ao registrar transação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Transação registrada com sucesso!
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
          min={0.01}
          step="0.01"
          required
        />
        <Input
          value={date}
          onChange={(event) => setDate(event.target.value)}
          type="date"
          max={new Date().toISOString().split("T")[0]}
          required
        />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          <option value="CREDIT">CRÉDITO</option>
          <option value="INSTALLMENT_CREDIT">PARCELADO</option>
          <option value="DEBIT">DÉBITO</option>
          <option value="PIX">PIX</option>
          <option value="BILLET">BOLETO</option>
        </Select>
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
        <Button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </div>
  );
}

export default AddDebit;
