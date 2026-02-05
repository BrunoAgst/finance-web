import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import logo from "../assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const loginData = {
      email,
      password,
    };

    console.log("Dados de login:", loginData);

    // Aqui você pode adicionar a lógica de autenticação
  };

  return (
    <div className="w-screen h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <img src={logo} alt="Logo" className="w-32 h-32" />

        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <Input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Email"
            required
          />
          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Senha"
            required
          />
          <Button type="submit">Entrar</Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
