import React, { useState } from "react";

const Autocomplete = ({ suggestions, onFilter, placeholder }) => {
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const userInput = e.target.value;
    setQuery(userInput);

    // Chama a função onFilter passada por prop para atualizar os resultados filtrados
    onFilter(userInput);

    if (userInput) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onFilter(suggestion); // Atualiza o filtro com o item selecionado
  };

  return (
    <div className="relative w-80">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="p-2 border border-gray-600 rounded-md shadow-md bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 transition-all duration-200 w-full"
      />
      {showSuggestions && (
        <ul className="absolute bg-gray-800 border border-gray-600 mt-1 w-full rounded-md shadow-lg z-10">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleClick(suggestion)}
              className="p-2 cursor-pointer hover:bg-gray-700 text-white"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
