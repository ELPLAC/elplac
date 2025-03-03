/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          default: "var(--primary-default)",
          light: "var(--primary-light)",
          lighter: "var(--primary-lighter)",
          dark: "var(--primary-dark)",
          darker: "var(--primary-darker)",
        },
        secondary: {
          default: "var(--secondary-default)",
          light: "var(--secondary-light)",
          lighter: "var(--secondary-lighter)",
          dark: "var(--secondary-dark)",
          darker: "var(--secondary-darker)",
        },
      },
    },
  },
  plugins: [],
};
