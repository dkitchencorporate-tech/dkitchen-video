import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vino: {
          DEFAULT: "#6E0C2B",
          dark: "#3E0515",
          light: "#A3184A",
        },
        oro: {
          DEFAULT: "#D9B25C",
          light: "#E8CD8C",
          dark: "#B38C34",
        },
        negro: "#0A080C",
        papel: "#F7F5F2",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-bricolage)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;