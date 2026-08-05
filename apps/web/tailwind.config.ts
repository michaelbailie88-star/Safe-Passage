import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        storm: {
          950: "#080D16",
          900: "#0B1220",
          800: "#101B2E",
          700: "#182640",
        },
        fog: {
          500: "#7688A0",
          300: "#8DA0B5",
        },
        mist: {
          100: "#E9EEF4",
          50: "#F5F8FB",
        },
        beam: {
          400: "#F2B84B",
          500: "#E5A526",
          600: "#C4841A",
        },
        signal: {
          400: "#5FB8B0",
          500: "#4A9D95",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "storm-gradient":
          "radial-gradient(ellipse 120% 80% at 50% -10%, #182640 0%, #0B1220 55%, #080D16 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
