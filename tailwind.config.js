/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FDFBF7',
          100: '#F7F3EA',
          200: '#EDE4D3',
          300: '#DFD1B8',
          400: '#C8B28E',
          500: '#B09467',
          600: '#94774B',
          700: '#735B37',
          800: '#534127',
          900: '#342918',
        },
        espresso: {
          50: '#F5F4F3',
          100: '#E7E4E1',
          200: '#CEC8C3',
          300: '#B1A9A2',
          400: '#8E837A',
          500: '#6E6258',
          600: '#534941',
          700: '#3D352F',
          800: '#2A2420',
          900: '#191512',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
