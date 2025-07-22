// Home.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../config/api";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import TituloAnimado from "../components/TituloAnimado";
import Autocomplete from "../components/Autocomplete";
import Loader from "../components/Loader";
import LeitoList from "../components/LeitoList";
import withTimeout from "../hoc/WhitTimeout";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Home = () => {
  const [leitosData, setLeitosData] = useState([]);
  const [filteredLeitos, setFilteredLeitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeito, setSelectedLeito] = useState(null);
  const [setores, setSetores] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isConnected, setIsConnected] = useState(false); // Estado para o status da conexão

  // Use um ref para manter o valor atualizado de currentPage
  const currentPageRef = useRef(currentPage);

  // Ref para o cliente STOMP
  const stompClientRef = useRef(null);

  // Função para buscar dados dos leitos
  const fetchLeitos = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    console.log(
      `Buscando dados de leitos para página ${page} com tamanho ${size}`
    );
    try {
      const response = await api.get(
        `/api/buscar-leitos?page=${page}&size=${size}`,
        {
          withCredentials: true,
        }
      );

      const { content, totalPages } = response.data;

      const mappedData = content.map((leito) => ({
        ...leito,
        dsStatus: leito.dsStatus === "Previsto" ? "Pendente" : leito.dsStatus,
      }));

      setLeitosData(mappedData);
      setSetores([...new Set(mappedData.map((leito) => leito.setor))]);
      setFilteredLeitos(mappedData);
      setTotalPages(totalPages);
      setLoading(false);
      console.log("Dados de leitos atualizados:", mappedData);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error("Erro ao buscar leitos:", err);
    }
  }, []); // Dependência vazia para memoização

  // Atualiza currentPageRef sempre que currentPage mudar
  useEffect(() => {
    currentPageRef.current = currentPage;
    fetchLeitos(currentPage, 10); // Busque dados da página atual
  }, [currentPage, fetchLeitos]);

  // Estabelece a conexão WebSocket ao montar o componente
  useEffect(() => {
    const socketUrl = "https://higiprohomol.hmbm.org.br/ws";
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      debug: (str) => console.log("STOMP Debug:", str),
      reconnectDelay: 2000, // Tentará reconectar a cada 2 segundos
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket conectado com sucesso");
        setIsConnected(true);
        // Chama fetchLeitos ao conectar-se
        fetchLeitos(currentPageRef.current, 10);
        console.log("Chamada para fetchLeitos após conexão");
        stompClient.subscribe("/topic/changes", (message) => {
          console.log("Mensagem recebida:", message.body);
          // Atualiza a lista de leitos ao receber uma mensagem
          fetchLeitos(currentPageRef.current, 10);
        });
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame.headers["message"], frame.body);
        setIsConnected(false);
      },
      onWebSocketClose: () => {
        console.log("WebSocket desconectado");
        setIsConnected(false);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    // Desconecta o WebSocket ao desmontar o componente
    return () => {
      if (stompClientRef.current && stompClientRef.current.active) {
        stompClientRef.current.deactivate();
      }
    };
  }, [fetchLeitos]);

  // Gerenciamento de visibilidade da página para otimizar conexões móveis
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Página não está visível, desconectar WebSocket
        if (stompClientRef.current && stompClientRef.current.active) {
          console.log("Página não visível. Desconectando WebSocket...");
          stompClientRef.current.deactivate();
        }
      } else {
        // Página ficou visível novamente, reativar WebSocket
        if (stompClientRef.current && !stompClientRef.current.active) {
          console.log("Página visível novamente. Reativando WebSocket...");
          stompClientRef.current.activate();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Log para monitorar o status da conexão
  useEffect(() => {
    console.log(
      `Status da conexão WebSocket: ${
        isConnected ? "Conectado" : "Desconectado"
      }`
    );
  }, [isConnected]);

  const calculateTimeDifference = (dtAtualizacao) => {
    const startTime = new Date(dtAtualizacao);
    const currentTime = new Date();
    const difference = Math.floor((currentTime - startTime) / 1000); // diferença em segundos

    const hours = Math.floor(difference / 3600);
    const minutes = Math.floor((difference % 3600) / 60);
    const seconds = difference % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    } else if (minutes > 0) {
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    } else {
      return `${String(seconds).padStart(2, "0")} sec`;
    }
  };

  const getColorClass = (dtAtualizacao) => {
    const startTime = new Date(dtAtualizacao);
    const currentTime = new Date();
    const differenceInMinutes = Math.floor(
      (currentTime - startTime) / 1000 / 60
    );

    return differenceInMinutes >= 20 ? "text-red-300" : "text-green-400";
  };

  const applyFilters = useCallback(
    (query, status) => {
      let filtered = leitosData;

      if (query.trim()) {
        filtered = filtered.filter(
          (leito) =>
            leito.setor.toLowerCase().includes(query.toLowerCase()) ||
            leito.leito.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (status) {
        filtered = filtered.filter((leito) => leito.dsStatus === status);
      }

      setFilteredLeitos(filtered);
    },
    [leitosData]
  );

  const handleFilterChange = (input) => {
    applyFilters(input, selectedStatus);
  };

  useEffect(() => {
    applyFilters("", selectedStatus);
  }, [selectedStatus, applyFilters]);

  const handleCardClick = (leito) => {
    setSelectedLeito(leito);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLeito(null);
  };

  const iniciarLimpeza = async (nrSequencia, cdLeito) => {
    if (nrSequencia && cdLeito) {
      try {
        await api.put(`/api/iniciar/${nrSequencia}/${cdLeito}`, null, {
          withCredentials: true,
        });
        await fetchLeitos(currentPageRef.current, 10);
        handleCloseModal();
      } catch (err) {
        console.error("Erro ao iniciar limpeza:", err);
      }
    }
  };

  const finalizarLimpeza = async (nrSequencia) => {
    if (nrSequencia) {
      try {
        await api.put(`/api/finalizar/${nrSequencia}`, null, {
          withCredentials: true,
        });
        await fetchLeitos(currentPageRef.current, 10);
        handleCloseModal();
      } catch (err) {
        console.error("Erro ao finalizar limpeza:", err);
      }
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  if (loading) {
    return (
      <div className="flex items-center bg-gray-900 justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;
  if (!Array.isArray(leitosData)) return <p>Dados inválidos recebidos.</p>;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      {/* Indicador de Conexão */}
      <div className="connection-status p-2 bg-gray-800 text-white flex justify-end">
        {isConnected ? (
          <span className="text-green-500">Conectado</span>
        ) : (
          <span className="text-red-500">Desconectado</span>
        )}
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900">
          <TituloAnimado />
          <hr className="w-3/4 border-t-2 border-white mt-3" />
        </div>
        <div className="flex flex-col flex-grow p-3 bg-gray-900 relative">
          <div className="flex flex-col w-full max-w-4xl mx-auto flex-grow">
            <div className="flex flex-row justify-center">
              <strong className="text-white font-medium text-3xl">
                Leitos
              </strong>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <div className="mt-6 flex justify-center gap-6 autocomplete-container">
                <Autocomplete
                  suggestions={setores}
                  onFilter={handleFilterChange}
                  placeholder="Filtrar por setor"
                  className="p-2 border border-gray-500 rounded-md shadow-md bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 transition-all duration-200 w-full"
                />
              </div>
              <div className="flex justify-start gap-4 mt-4">
                <div
                  className={`flex items-center cursor-pointer ${
                    selectedStatus === "Pendente" ? "bg-gray-700" : ""
                  } p-2 rounded-md`}
                  onClick={() => handleStatusFilter("Pendente")}
                >
                  <div className="w-3 h-3 bg-orange-400 mr-2"></div>
                  <span className="text-white">Pendente</span>
                </div>
                <div
                  className={`flex items-center cursor-pointer ${
                    selectedStatus === "Em execução" ? "bg-gray-700" : ""
                  } p-2 rounded-md`}
                  onClick={() => handleStatusFilter("Em execução")}
                >
                  <div className="w-3 h-3 bg-green-400 mr-2"></div>
                  <span className="text-white">Em execução</span>
                </div>
              </div>
            </div>

            <div className="flex-grow mt-4 overflow-y-auto h-64">
              <LeitoList
                leitos={filteredLeitos}
                onCardClick={handleCardClick}
                calculateTimeDifference={calculateTimeDifference}
                getColorClass={getColorClass}
              />
            </div>
          </div>
          <div className="flex justify-center mt-4 mb-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-700 text-white rounded-l-md shadow-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              Anterior
            </button>
            <span className="px-4 py-2 bg-gray-700 text-white shadow-md">
              Página {Math.min(currentPage + 1, totalPages)} de {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-r-md shadow-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
      {selectedLeito && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          leito={selectedLeito}
          onIniciar={iniciarLimpeza}
          onFinalizar={finalizarLimpeza}
        />
      )}
    </div>
  );
};

export default withTimeout(Home);
