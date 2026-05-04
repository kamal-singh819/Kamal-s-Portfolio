import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18181b",
        paper: "#fbfaf8",
        line: "#e4e4e7"
      },
      fontFamily: {
        serif: ["var(--font-special-elite)", "serif"],
        soft: ["var(--font-shadows-into-light)", "cursive"]
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
