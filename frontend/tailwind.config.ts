import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fafaf9",
        surface: "#ffffff",
        "surface-muted": "#f5f5f4",
        border: "#e7e5e4",
        foreground: "#1c1917",
        muted: "#78716c",
        accent: "#2563eb",
        "accent-hover": "#1d4ed8",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      maxWidth: {
        portfolio: "720px",
        wide: "960px",
      },
    },
  },
  plugins: [],
};
export default config;
