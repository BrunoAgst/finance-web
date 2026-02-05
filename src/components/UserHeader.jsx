import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

function UserHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Usuário deslogado");
    navigate("/login");
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          U
        </div>
        <span className="text-sm text-gray-700">usuario@email.com</span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-slate-700 transition-colors"
      >
        <LogOut size={16} />
        <span>Sair</span>
      </button>
    </div>
  );
}

export default UserHeader;
