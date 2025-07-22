import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { FiGrid, FiUsers, FiClock } from "react-icons/fi";

const AnalyticsCard = ({ title, value1, value2, icon: Icon, color }) => (
  <div className={`p-4 ${color} text-black w-full`}>
    <div className="flex flex-row sm:flex-row justify-between items-center p-2">
      <div className="text-center sm:text-left">
        <p className="text-5xl sm:text-6xl md:text-7xl font-bold">{value1}</p>
        <p className="text-sm sm:text-base md:text-lg mt-1">{value2}</p>
        <p className="text-sm sm:text-base md:text-lg mt-1">{title}</p>
      </div>
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mt-2 sm:mt-0" />
    </div>
  </div>
);

const ApplySection = () => (
  <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 p-4 flex justify-center w-full">
    <Link to="/login" className="w-full flex justify-center">
      <button className="px-6 py-3 bg-yellow-100 text-black font-medium border-b-2 border-black transition-colors duration-300 ease-in-out hover:bg-black hover:text-white cursor-pointer active:scale-95">
        <span className="text-xl sm:text-2xl md:text-3xl flex items-center">
          Descubra
        </span>
      </button>
    </Link>
  </div>
);

const AnalyticsData = () => {
  return (
    <div className="font-serif max-w-full mx-auto bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="p-4 mb-10 text-center">
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mt-4 mb-8">
          Higi Pro
        </h2>
      </div>

      <div className="flex-1 bg-yellow-100 flex flex-col sm:flex-col">
        <AnalyticsCard
          title="..."
          value1="320"
          value2="Leitos administrados"
          icon={FiGrid}
          color="bg-orange-400"
        />

        <AnalyticsCard
          title="..."
          value1="46+"
          value2="Total agentes de limpeza"
          icon={FiUsers}
          color="bg-pink-300"
        />

        <AnalyticsCard
          title="..."
          value2="Tempo Médio de Limpeza"
          value1={
            <>
              <span className="text-5xl sm:text-6xl md:text-7xl font-bold">
                20
              </span>
              <span className="text-sm sm:text-base md:text-lg text-black">
                {" "}
                min
              </span>
            </>
          }
          icon={FiClock}
          color="bg-yellow-100"
        />
      </div>

      <ApplySection />
    </div>
  );
};

export default AnalyticsData;
