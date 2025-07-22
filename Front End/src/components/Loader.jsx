import React from 'react'

const Loader = () => {
    const bars = Array.from({ length: 12 }, (_, i) => i + 1)

    return (
        <div className="relative w-[54px] h-[54px] rounded-[10px]">
            {bars.map((bar) => (
                <div
                    key={bar}
                    className="absolute w-[8%] h-[24%] bg-gray-500 left-1/2 top-[30%] rounded-[50px] shadow-[0_0_3px_rgba(0,0,0,0.2)]"
                    style={{
                        transform: `rotate(${(bar - 1) * 30}deg) translate(0, -130%)`,
                        animation: `fade458 1s linear infinite ${-0.0833 * (bar - 1)}s`
                    }}
                />
            ))}
            <style>
                {`
                    @keyframes fade458 {
                        from {
                            opacity: 1;
                        }
                        to {
                            opacity: 0.25;
                        }
                    }
                `}
            </style>
        </div>
    )
}

export default Loader
