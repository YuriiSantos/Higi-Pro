import React, { useState } from "react";
import { FiAlignJustify, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { useWebSocket } from "../components/WebSocketContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { disconnectWebSocket } = useWebSocket();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      // Notifica o back-end para encerrar a sessão
      await api.post(
        "/api/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Erro ao fazer logout no servidor:", error);
    }

    // Desconecta o WebSocket
    await disconnectWebSocket();

    // Remove o token do localStorage e redireciona para a página de login
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-gray-900 p-4 text-white flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">HP</div>

        {/* Botão do menu */}
        <button
          onClick={toggleMenu}
          className="text-2xl lg:hidden p-2 rounded-md focus:outline-none"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FiX /> : <FiAlignJustify />}
        </button>

        {/* Links visíveis em telas grandes */}
        <div className="hidden lg:flex space-x-4 items-center">
          <a href="#home" className="hover:text-black px-3 py-2 rounded-md">
            Home
          </a>
          <a href="#about" className="hover:text-black px-3 py-2 rounded-md">
            About
          </a>
          <a href="#services" className="hover:text-black px-3 py-2 rounded-md">
            Services
          </a>
          <a href="#contact" className="hover:text-black px-3 py-2 rounded-md">
            Contact
          </a>
          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="hover:text-black px-3 py-2 rounded-md"
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Menu lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-700 text-white transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } shadow-lg z-40 flex flex-col`}
      >
        <div className="flex justify-between items-center p-4">
          <div className="text-4xl font-semibold">Menu</div>
          <button onClick={toggleMenu} className="p-2 rounded-md">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 flex-grow">
          <a
            href="home"
            className="block py-2 text-[1.375rem] hover:text-black text-white rounded-md"
          >
            Início
          </a>
          <a
            href="/about"
            className="block py-2 text-[1.375rem] hover:text-black text-white rounded-md"
          >
            Sobre
          </a>
          <a
            href="/chat"
            className="block py-2 text-[1.375rem] hover:text-black text-white rounded-md"
          >
            Chat
          </a>
          <a
            href="/contact"
            className="block py-2 text-[1.375rem] hover:text-black text-white rounded-md"
          >
            Contato
          </a>
        </div>
        {/* Botão de Logout no fundo */}
        <button
          onClick={handleLogout}
          className="py-2 px-4 mt-auto bg-red-600 hover:bg-red-700 text-white text-[1.375rem] rounded-md"
        >
          Sair
        </button>
      </div>
    </>
  );
};

export default Navbar;
