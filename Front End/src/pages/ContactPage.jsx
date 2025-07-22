import React from "react";
import Navbar from "../components/Navbar";

const ContactPage = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        {/* Contêiner principal com fundo cinza claro */}
        <div className="flex flex-col max-w-lg w-full space-y-6 bg-gray-800 p-6 rounded-lg">
          {/* Contêiner responsivo para o título */}
          <div className="flex justify-center items-center h-20 sm:h-24 md:h-32 lg:h-40">
            <h2 className="text-center text-4xl font-extrabold text-white">
              Entre em Contato
            </h2>
          </div>
          <div className="text-white w-full">
            <p className="text-lg mb-4 text-left">
              <span className="font-bold">Coordenação:</span> 2718
            </p>
            <p className="text-lg mb-4 text-left">
              <span className="font-bold">Lavanderia:</span> 2667
            </p>
            <p className="text-lg mb-4 text-left">
              <span className="font-bold">Tecnologia:</span> 2594
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
