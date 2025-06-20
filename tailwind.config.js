/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./index.tsx", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#7EE4EC",
        secondary: "#FFD4CA",
        textPrimary: "#114B5F",
        textSecondary: "#456990",
        light: {
          100: "#D6C6FF",
          200: "#A8B5DB",
          300: "#9CA4AB",
        },
        dark: {
          100: "#221f3d",
          200: "#0f0d23",
        },
        accent: "AB8BFF",
      },
      fontFamily: {
        sans: ["Montserrat_400Regular", "sans-serif"], // remplace la font "sans" par défaut
      },
    },
  },
  plugins: [],
};
