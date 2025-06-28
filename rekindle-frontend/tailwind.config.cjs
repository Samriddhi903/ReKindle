module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-peach': '#FFD1C1',
        'pastel-blue': '#B3E5FC',
        'pastel-lavender': '#E1CFFF',
        'pastel-mint': '#C1FFD7',
        'pastel-yellow': '#FFF9C1',
        'pastel-pink': '#FFC1E3',
      },
      fontFamily: {
        lexend: ['Lexend', 'sans-serif'],
        opendyslexic: ['OpenDyslexic', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 