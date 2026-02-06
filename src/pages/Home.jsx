import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddDebit from "./AddDebit";
import ViewDebit from "./ViewDebit";
import UserHeader from "../components/UserHeader";
import Button from "../components/Button";
import logo from "../assets/logo.png";

function Home() {
  const navigate = useNavigate();
  const [monthlyTotal, _] = useState(0);

  useEffect(() => {
    // TODO: Implementar chamada para API
    // Exemplo:
    // fetch('/api/monthly-total')
    //   .then(res => res.json())
    //   .then(data => setMonthlyTotal(data.total))
    //   .catch(err => console.error(err));
  }, []);

  return (
    <div className="w-screen h-screen bg-slate-50 flex flex-col gap-10 justify-center items-center p-6 relative">
      <UserHeader />
      <img src={logo} alt="Logo" className="w-32 h-32 mb-2" />

      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-gray-600 text-sm font-medium mb-2">Gasto no Mês</h2>
        <p className="text-3xl font-bold text-gray-900">
          R${" "}
          {monthlyTotal.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <Button onClick={() => navigate("/monthly")} className="w-full">
          Ver Compras do Mês
        </Button>
      </div>

      <AddDebit />
      <ViewDebit />
    </div>
  );
}

export default Home;
