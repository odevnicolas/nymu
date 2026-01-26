/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Urbanist_400Regular', 'system-ui', 'sans-serif'],
        urbanist: ['Urbanist_400Regular', 'system-ui', 'sans-serif'],
        'urbanist-medium': ['Urbanist_500Medium', 'system-ui', 'sans-serif'],
        'urbanist-semibold': ['Urbanist_600SemiBold', 'system-ui', 'sans-serif'],
        'urbanist-bold': ['Urbanist_700Bold', 'system-ui', 'sans-serif'],
      },
      colors: {
        nymu: {
          yellow: '#FDB813',
          dark: '#2D3648',
        },
      },
    },
  },
  plugins: [],
}