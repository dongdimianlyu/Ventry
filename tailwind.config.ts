import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        card: {
          DEFAULT: "var(--card-bg)",
          foreground: "var(--foreground)"
        },
        navy: {
          50: "#f1f2f6",
          100: "#d9e0f2",
          200: "#b7c7e8",
          300: "#8da5dc",
          400: "#6985cd",
          500: "#4e67bc",
          600: "#3f4d99",
          700: "#343b7c",
          800: "#2c3367",
          900: "#222342",
          950: "#0f1122",
        },
        silver: {
          50: "#f8f9fa",
          100: "#f1f3f4",
          200: "#e2e6e9",
          300: "#d0d4d9",
          400: "#a6acb4",
          500: "#6c737f",
          600: "#4e5561",
          700: "#3b424e",
          800: "#252b37",
          900: "#181d28",
          950: "#0f131d",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "grid-slate-900": "url('/grid.svg')",
        "grid-slate-400": "url('/grid.svg')",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-slow": "bounce 3s infinite",
        "blink": "blink 1s step-end infinite",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        blink: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'highlight': 'inset 0 1px 0 0 rgb(255 255 255 / 0.05)',
        'lowlight': 'inset 0 -1px 0 0 rgb(0 0 0 / 0.1)',
        'button': '0 0 0 1px rgb(255 255 255 / 0.08), 0 1px 2px 0 rgb(0 0 0 / 0.2)',
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
} as Config;

export default config;
