/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#172554',
          50: '#eff4ff',
          100: '#dbe6fe',
          600: '#253b80',
          700: '#1e326e',
          800: '#172554',
          900: '#0f172a',
        },
        accent: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FFF7ED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
