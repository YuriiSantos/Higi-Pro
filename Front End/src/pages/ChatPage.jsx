import React from "react";
import chatGif from "../assets/chat.gif"; // Caminho ajustado com '../'
import Navbar from "../components/Navbar";

const ChatPage = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Navbar />
      <div className="flex flex-grow items-center justify-between">
        <div className="flex flex-col items-center">
          <img src={chatGif} alt="Loading..." className="w-[500px] h-[400px]" />
          <p className="text-white text-2xl">Chat em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
