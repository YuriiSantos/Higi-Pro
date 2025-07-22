import React, { useState, useEffect } from "react";

const LeitoList = ({
  leitos,
  onCardClick,
  calculateTimeDifference,
  getColorClass,
}) => {
  const [times, setTimes] = useState({});
  const [sortedLeitos, setSortedLeitos] = useState([]);

  // Atualiza o tempo de cada leito imediatamente e em intervalos regulares
  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {};
      leitos.forEach((leito) => {
        newTimes[leito.nrSequencia] = calculateTimeDifference(
          leito.dtAtualizacao
        );
      });
      setTimes(newTimes);
    };

    updateTimes(); // Atualiza os tempos imediatamente
    const interval = setInterval(updateTimes, 1000); // Atualiza a cada segundo

    return () => clearInterval(interval);
  }, [leitos, calculateTimeDifference]);

  // Ordena os leitos, colocando aqueles com prioridade "S" no topo
  useEffect(() => {
    const sorted = [...leitos].sort((a, b) => {
      if (a.prioridade === "S" && b.prioridade !== "S") {
        return -1;
      }
      if (a.prioridade !== "S" && b.prioridade === "S") {
        return 1;
      }
      return 0;
    });
    setSortedLeitos(sorted);
  }, [leitos]);

  return (
    <div className="flex flex-col gap-4">
      {sortedLeitos.map((leito) => (
        <div
          key={leito.nrSequencia}
          onClick={() => onCardClick(leito)}
          className={`p-4 rounded-lg shadow-md cursor-pointer ${
            leito.prioridade === "S" && leito.dsStatus !== "Em execução"
              ? "animate-blink bg-red-500 hover:bg-red-500"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-white font-semibold text-lg flex items-center gap-2">
              {leito.leito}
              <span>-</span>
              <span className={`${getColorClass(leito.dtAtualizacao)} text-sm`}>
                {times[leito.nrSequencia]}
              </span>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-sm font-medium ${
                leito.dsStatus === "Em execução"
                  ? "bg-green-400 text-green-900"
                  : leito.dsStatus === "Pendente"
                  ? "bg-orange-400 text-orange-900"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              {leito.dsStatus}
            </div>
          </div>

          <div
            className={`mt-2 ${
              leito.prioridade === "S" ? "text-white" : "text-gray-400"
            }`}
          >
            {leito.setor}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeitoList;
