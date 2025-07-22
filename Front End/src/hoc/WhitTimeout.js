import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

const withTimeout = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
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

        // Remove o token do localStorage e redireciona para a página de login
        localStorage.removeItem("token");
        navigate("/login");
      };

      const timeoutDuration = 270 * 60 * 1000; // 4 horas e 30 minutos em milissegundos
      let timeout = setTimeout(handleLogout, timeoutDuration);

      const resetTimeout = () => {
        clearTimeout(timeout);
        timeout = setTimeout(handleLogout, timeoutDuration);
      };

      window.addEventListener("mousemove", resetTimeout);
      window.addEventListener("keypress", resetTimeout);

      return () => {
        clearTimeout(timeout);
        window.removeEventListener("mousemove", resetTimeout);
        window.removeEventListener("keypress", resetTimeout);
      };
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withTimeout;
