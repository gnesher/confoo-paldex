/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Pal type colors
        neutral: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        grass: '#78C850',
        electric: '#F8D030',
        ice: '#98D8D8',
        ground: '#E0C068',
        dark: '#705848',
        dragon: '#7038F8',
      },
    },
  },
  plugins: [],
}
