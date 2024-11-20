/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryPurple: "#9419EE",
        secondaryPurple: "#231459",
        primaryBlue: "#6BE0FF",
        secondaryBlue: "#04043F"
      }
    },
  },
  plugins: [],
};
