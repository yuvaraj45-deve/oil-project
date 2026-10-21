/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F5EFE6',
          300: '#EDE4D3',
          400: '#DFD2BC',
          500: '#C9B69B',
        },
        forest: {
          50: '#F0F7F4',
          100: '#DBEFE7',
          200: '#B8DFD1',
          300: '#84C4AF',
          600: '#26795E',
          700: '#1D624C',
          800: '#144E3C',
          900: '#0E3B2E',
          950: '#08251D',
        },
        gold: {
          100: '#FBF4DB',
          200: '#F5E4A8',
          300: '#ECCC6A',
          400: '#DCB338',
          500: '#C59B27',
          600: '#A47D1C',
          700: '#825E17',
          800: '#674816',
        },
        terracotta: {
          500: '#D96B43',
          600: '#BF522C',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'card': '0 12px 35px -5px rgba(14, 59, 46, 0.08)',
        'card-hover': '0 20px 40px -10px rgba(14, 59, 46, 0.16)',
        'gold-glow': '0 0 25px rgba(197, 155, 39, 0.25)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}
