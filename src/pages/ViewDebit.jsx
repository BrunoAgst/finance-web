import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrashIcon, PencilIcon } from "lucide-react";
import Button from "../components/Button";

function ViewDebit() {
  const navigate = useNavigate();
  const [debits, _] = useState([
    {
      id: "1",
      name: "Shoppe",
      amount: 130.0,
      category: "CREDIT",
    },
    {
      id: "2",
      name: "Ali",
      amount: 50.0,
      category: "PIX",
    },
  ]);

  function onEditDebitClick(debit) {
    navigate("/edit", { state: { debit } });
  }

  function onDeleteDebitClick(debit) {
    return debit;
  }

  return (
    <div className="w-full max-w-md">
      <ul className="flex flex-col gap-3">
        {debits.map((debit) => (
          <li
            key={debit.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <p className="font-semibold">{debit.name}</p>
              <p className="text-sm text-gray-600">
                R$ {debit.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{debit.category}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => onEditDebitClick(debit)}>
                <PencilIcon size={16} />
              </Button>
              <Button onClick={() => onDeleteDebitClick(debit)}>
                <TrashIcon size={16} />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewDebit;
