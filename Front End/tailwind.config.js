/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 0.9s infinite",
      },
      backgroundImage: {
        // Custom radial gradient
        "custom-radial-gradient":
          "radial-gradient(circle at top right , rgba(255, 255, 255, 0.2) -50%, rgba(255, 255, 255, 0) 45%)",
      },
    },
  },
  plugins: [],
};
