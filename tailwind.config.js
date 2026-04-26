module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8f9ff",
        primary: "#004bca",
        secondary: "#712ae2",
        surface: "#ffffff",
        muted: "#eff4ff",
        ink: "#0b1c30",
      },
      boxShadow: {
        soft: "0 10px 35px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
