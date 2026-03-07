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
        background: "var(--background)",
        foreground: "var(--foreground)",
        teal: {
          DEFAULT: "#0D7377",
          50: "#E6F5F5",
          100: "#CCEBEB",
          200: "#99D7D8",
          300: "#66C3C4",
          400: "#33AFB1",
          500: "#0D7377",
          600: "#0A5C5F",
          700: "#084547",
          800: "#052E2F",
          900: "#031718",
        },
        amber: {
          DEFAULT: "#F5A623",
          50: "#FEF5E6",
          100: "#FDEBCC",
          200: "#FBD799",
          300: "#F9C366",
          400: "#F7AF33",
          500: "#F5A623",
          600: "#C4851C",
          700: "#936415",
          800: "#62420E",
          900: "#312107",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
