import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import logo from "../assets/logo.png";

function Login() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    login();
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <img src={logo} alt="Duocash" className="w-32 h-32" />
        <h1 className="text-2xl font-bold text-gray-900">Duocash</h1>

        <div className="flex flex-col gap-4 w-full">
          <p className="text-center text-gray-500 mb-2">
            Finanças a dois, simplificadas
          </p>
          <Button onClick={handleLogin}>Acessar minha conta</Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
