import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function UserHeader() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Pega as iniciais do nome do usuário
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || user?.email || "Usuário";

  return (
    <div className="absolute top-4 right-4 flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {getInitials(displayName)}
        </div>
        <span className="text-sm text-gray-700">{displayName}</span>
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
