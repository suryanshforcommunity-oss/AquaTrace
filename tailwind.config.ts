import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#071B49",
          900: "#040E26",
          800: "#071B49",
          700: "#0C2869",
          600: "#13378A",
        },
        primary: {
          DEFAULT: "#073BCE",
          hover: "#1769E0",
          light: "#EBF1FD",
          dim: "#C4D6FC",
          50: "#F0F5FF",
          100: "#EBF1FD",
          500: "#1769E0",
          600: "#073BCE",
          700: "#052CA0",
        },
        secondary: {
          DEFAULT: "#1769E0",
          dark: "#0F4BB0",
          light: "#E3EFFF",
        },
        aqua: {
          DEFAULT: "#20B8C4",
          dark: "#148E98",
          light: "#E8FAF9",
          50: "#F0FCFC",
          500: "#20B8C4",
        },
        orange: {
          DEFAULT: "#FF6900",
          dark: "#D65400",
          light: "#FFF1E5",
          50: "#FFF7F0",
        },
        canvas: {
          DEFAULT: "#F4F8FF",
          subtle: "#EDF3FD",
        },
        content: {
          primary: "#101B3D",
          secondary: "#667085",
          muted: "#98A2B3",
        },
        status: {
          success: "#159B68",
          "success-bg": "#E8F8F1",
          warning: "#E8A317",
          "warning-bg": "#FEF7E6",
          danger: "#DC4545",
          "danger-bg": "#FDEDED",
          info: "#073BCE",
          "info-bg": "#EBF1FD",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 2px 12px -2px rgba(7, 27, 73, 0.05), 0 1px 3px 0 rgba(7, 27, 73, 0.03)",
        "card-hover": "0 8px 24px -4px rgba(7, 27, 73, 0.08), 0 2px 6px -1px rgba(7, 27, 73, 0.04)",
        elevated: "0 16px 36px -6px rgba(7, 27, 73, 0.12)",
      },
      borderRadius: {
        card: "0.75rem",
        button: "0.5rem",
      },
    },
  },
  plugins: [],
};
export default config;

