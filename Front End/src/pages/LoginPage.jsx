import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon_logo.png";
import api from "../config/api";

function ContactForm() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/api/login",
        {
          username: login,
          password: senha,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      setError("Falha ao fazer login. Verifique suas credenciais.");
      console.error("Erro durante a tentativa de login:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-gradient-to-r from-gray-900 to-gray-900 relative border-2 border-transparent rounded-xl bg-clip-padding animate-gradient">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1 relative pt-3">
          <input
            required
            name="login"
            id="login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full pt-3 border-b-2 border-gray-500 text-white bg-transparent placeholder-gray-500 placeholder-opacity-75 focus:outline-none focus:border-green-700 peer"
            style={{ fontFamily: "Raleway, sans-serif" }}
            placeholder="Digite seu usuário"
          />
          <label
            htmlFor="login"
            className="absolute left-0 top-0 text-xs sm:text-sm md:text-base font-semibold text-gray-400 transition-all duration-300 peer-focus:text-green-700"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            Login:
          </label>
        </div>
        <div className="flex flex-col gap-1 relative pt-3">
          <input
            required
            name="senha"
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full pt-3 border-b-2 border-gray-500 text-white bg-transparent placeholder-gray-500 placeholder-opacity-75 focus:outline-none focus:border-green-700 peer"
            style={{ fontFamily: "Raleway, sans-serif" }}
            placeholder="Digite sua senha"
          />
          <label
            htmlFor="senha"
            className="absolute left-0 top-0 text-xs sm:text-sm md:text-base font-semibold text-gray-400 transition-all duration-300 peer-focus:text-green-700"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            Senha:
          </label>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-center mt-5">
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white font-semibold border border-gray-700 hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white active:bg-green-700 active:text-white transition-colors"
          >
            Acessar
          </button>
        </div>
      </form>
    </div>
  );
}

const LoginForm = () => {
  return (
    <div className="font-serif w-full h-screen text-white flex flex-col items-center justify-center bg-gray-900 bg-custom-radial-gradient">
      <div className="p-4 mb-10 text-left flex flex-col">
        <div className="flex justify-center items-center ml-4">
          <img src={logo} alt="Logo" className="w-32 h-32 mr-4" />
          <div className="pl-2">
            <h2
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl pb-1 font-extrabold"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Higi Pro
            </h2>
            <p
              className="text-lg sm:text-xl md:text-2xl"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              Transformando Limpeza em Cuidado
            </p>
          </div>
        </div>
      </div>
      <ContactForm />
    </div>
  );
};

export default LoginForm;
