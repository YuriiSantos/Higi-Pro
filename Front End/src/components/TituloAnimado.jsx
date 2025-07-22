import React, { useState, useEffect } from 'react'

const TituloAnimado = () => {
    const words = [
        'Cuidado!',
        'Atenção!',
        'Carinho!',
        'Amor!',
        'Hospitalidade!',
        'Excelência!',
        'Conforto!',
        'Serviço!',
        'Qualidade!',
        'Dedicação!',
        'Tratamento!',
        'Compromisso!',
        'Satisfação!',
        'Empatia!',
        'Aconchego!'
    ]

    const [currentWordIndex, setCurrentWordIndex] = useState(0)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
        }, 3000) // Troca de frase a cada 3 segundos

        return () => clearInterval(intervalId)
    }, [words.length]) // Adicionando words.length como dependência

    return (
        <div className="text-5xl font-bold text-white text-center">
            Hotelaria é<br />
            <span className="font-serif font-normal italic text-green-600 transition-all duration-500 ease-in-out">
                {words[currentWordIndex]}
            </span>
        </div>
    )
}

export default TituloAnimado
