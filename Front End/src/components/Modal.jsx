// Modal.jsx

import React, { useState } from "react";
import QRCodeScanner from "./QRCodeScanner"; // Importando o componente QRCodeScanner

const Modal = ({ isOpen, onClose, leito, onIniciar, onFinalizar }) => {
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrError, setQrError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleScanSuccess = (text) => {
    const scannedData = parseInt(text, 10);
    if (scannedData === leito.cdLeito) {
      setQrError(null);
      setSuccessMessage("Limpeza inicializada com sucesso!");
      setTimeout(() => {
        setShowQrScanner(false);
        onIniciar(leito.nrSequencia, leito.cdLeito);
        setSuccessMessage("");
      }, 1000);
    } else {
      setQrError("QR Code inválido.");
      setShowQrScanner(false);
    }
  };

  const handleIniciar = () => {
    setShowQrScanner(true);
  };

  const handleCancel = () => {
    setShowQrScanner(false);
    setQrError(null);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-gradient-to-tl from-gray-900 to-gray-950 border-r-2 border-t-2 border-gray-900 rounded-lg overflow-hidden relative text-gray-300 transition-all cursor-pointer group ${
          showQrScanner
            ? "w-[clamp(400px,80%,350px)]"
            : "w-[clamp(400px,80%,350px)]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-10">
          {showQrScanner ? (
            <QRCodeScanner
              onScanSuccess={handleScanSuccess}
              onCancel={handleCancel}
            />
          ) : (
            <>
              <div className="uppercase font-bold text-xl mb-4">
                Detalhes do Leito
              </div>
              {leito && (
                <div>
                  <p>
                    <strong>Leito:</strong> {leito.leito}
                  </p>
                  <p>
                    <strong>Setor:</strong> {leito.setor}
                  </p>
                  <p>
                    <strong>Data de Início:</strong>{" "}
                    {leito.dtInicio || "Não iniciado"}
                  </p>
                  <p>
                    <strong>Executor:</strong>{" "}
                    {leito.executor || "Não definido"}
                  </p>
                </div>
              )}
              <div className="mt-4">
                {qrError && (
                  <p className="text-red-500 font-bold mb-5">{qrError}</p>
                )}
                {successMessage && (
                  <p className="text-green-500 font-bold">{successMessage}</p>
                )}
                {leito.dsStatus === "Em execução" ? (
                  <>
                    <p className="text-green-500 mb-4">Limpeza em andamento!</p>
                    <button
                      type="button"
                      onClick={() => onFinalizar(leito.nrSequencia)}
                      className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-all"
                    >
                      Finalizar Limpeza
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleIniciar}
                      className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-all"
                    >
                      Iniciar
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <div className="h-2 w-full bg-gradient-to-l via-yellow-500 group-hover:blur-xl blur-2xl m-auto rounded transition-all absolute bottom-0"></div>
        <div className="h-0.5 group-hover:w-full bg-gradient-to-l via-yellow-950 group-hover:via-yellow-500 w-[80%] m-auto rounded transition-all"></div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-700 text-white font-bold py-1 px-3 rounded-full hover:bg-gray-600 transition-all"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Modal;
