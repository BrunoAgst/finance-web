import { useState } from "react";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";

function AddDebit() {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [fixed, setFixed] = useState("");
    const [installment, setInstallment] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = {
        name,
        amount,
        date,
        category,
        fixed,
        installment: category === "INSTALLMENT_CREDIT" ? installment : null,
        };

        console.log("Dados do formulário:", formData);

        setName("");
        setAmount("");
        setDate("");
        setCategory("");
        setFixed("");
        setInstallment("");
    };

    return (
        <div className="w-full max-w-md">
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
            <Select value={fixed} onChange={(e) => setFixed(e.target.value)} required>
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
            <Button type="submit">Registrar</Button>
          </form>
        </div>
    )
}

export default AddDebit