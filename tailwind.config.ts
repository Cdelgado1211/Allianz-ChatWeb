import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#004481",
          light: "#2469A6",
          subtle: "#E6EEF6"
        },
        accent: "#00A3E0",
        surface: "#FFFFFF",
        border: "#E5E7EB",
        danger: "#DC2626",
        success: "#16A34A"
      }
    }
  },
  plugins: []
};

export default config;

