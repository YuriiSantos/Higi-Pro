import React from "react";
import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-gradient-to-r from-gray-900 to-gray-900 relative border-2 border-transparent rounded-xl bg-clip-padding animate-gradient">
      <div className="text-center text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Sobre nós
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light">
          Este aplicativo foi desenvolvido para atender a uma necessidade
          específica do setor de hotelaria. O projeto foi realizado por meio de
          uma colaboração entre o setor de tecnologia e o setor de hotelaria,
          combinando conhecimento técnico e experiência prática para criar uma
          solução eficiente.
        </p>
        <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-light">
          Esperamos que você encontre valor em nosso trabalho conjunto e que ele
          contribua positivamente para suas necessidades.
        </p>
      </div>
      <hr className="my-6" />
      <div className="text-center text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          About Us
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light">
          This application was developed to meet a specific need in the
          hospitality sector. The project was carried out through a
          collaboration between the technology team and the hospitality team,
          combining technical knowledge and practical experience to create an
          effective solution.
        </p>
        <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-light">
          We hope you find value in our joint effort and that it positively
          contributes to your needs.
        </p>
      </div>
    </div>
  );
}

const AboutPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className=" font-serif flex-1 font-bold flex items-center justify-center">
        <About />
      </div>
    </div>
  );
};

export default AboutPage;
