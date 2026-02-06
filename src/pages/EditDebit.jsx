import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import UserHeader from "../components/UserHeader";

function EditDebit() {
  const location = useLocation();
  const navigate = useNavigate();
  const debit = location.state?.debit;

  const [name, setName] = useState(debit?.name || "");
  const [amount, setAmount] = useState(debit?.amount || "");
  const [category, setCategory] = useState(debit?.category || "");
  const [date, setDate] = useState(debit?.date || "");
  const [fixed, setFixed] = useState(debit?.fixed || "");
  const [installment, setInstallment] = useState(debit?.installment || "");

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedData = {
      id: debit.id,
      name,
      amount,
      date,
      category,
      fixed,
      installment: category === "INSTALLMENT_CREDIT" ? installment : null,
    };

    console.log("Dados atualizados:", updatedData);

    // Aqui você pode adicionar a lógica para atualizar o debit
    navigate("/");
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
            <option value="TICKET">BOLETO</option>
          </Select>
          <Select
            value={fixed}
            onChange={(e) => setFixed(e.target.value)}
            required
          >
            <option value="">Este gasto é fixo?</option>
            <option value="no">Não</option>
            <option value="yes">Sim</option>
          </Select>
          {category === "INSTALLMENT_CREDIT" && (
            <Input
              value={installment}
              onChange={(e) => setInstallment(e.target.value)}
              type="number"
              placeholder="Quantidade de Parcelas"
              min={2}
              max={12}
            />
          )}
          <div className="flex gap-2">
            <Button type="submit">Salvar</Button>
            <Button type="button" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDebit;
