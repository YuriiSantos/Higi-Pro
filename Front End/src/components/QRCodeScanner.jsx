// QRCodeScanner.jsx

import React, { useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const QRCodeScanner = ({ onScanSuccess, onCancel }) => {
  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let active = true; // Variável para controlar se o scanner está ativo

    const videoElement = document.getElementById("video");

    const startScanning = async () => {
      try {
        await codeReader.decodeFromVideoDevice(
          null,
          videoElement,
          (result, error) => {
            if (result && active) {
              active = false; // Desativa a câmera
              codeReader.reset(); // Reseta o leitor após o sucesso
              onScanSuccess(result.text);
            } else if (error && !(error instanceof Error)) {
              console.error("Decode error:", error);
            }
          }
        );
      } catch (error) {
        console.error("Scanning error:", error);
      }
    };

    if (videoElement) {
      startScanning();
    }

    return () => {
      active = false; // Desativa o scanner ao desmontar
      codeReader.reset(); // Reseta o leitor ao desmontar
    };
  }, [onScanSuccess]);

  return (
    <div className="w-full h-full bg-transparent text-white rounded-lg shadow-lg p-6 relative">
      <h2 className="text-2xl font-semibold mb-4">Scan QR Code</h2>
      <div className="relative w-full h-0 pb-[100%]">
        <video id="video" className="absolute top-0 left-0 w-full h-full" />
      </div>
    </div>
  );
};

export default QRCodeScanner;
