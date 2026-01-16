/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          dark: "#4f46e5",
          light: "#818cf8",
        },
        secondary: {
          DEFAULT: "#ec4899",
          dark: "#db2777",
        },
        accent: {
          DEFAULT: "#14b8a6",
          dark: "#0d9488",
        },
        bg: {
          primary: "#0a0a0f",
          secondary: "#13131a",
          tertiary: "#1a1a24",
          card: "rgba(26, 26, 36, 0.8)",
          glass: "rgba(255, 255, 255, 0.05)",
        },
        text: {
          primary: "#ffffff",
          secondary: "#a1a1aa",
          muted: "#71717a",
        },
        border: {
          color: "rgba(255, 255, 255, 0.1)",
          hover: "rgba(255, 255, 255, 0.2)",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)",
      },
    },
  },
  plugins: [],
};
