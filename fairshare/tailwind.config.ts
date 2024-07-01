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
        primary: "#1da1f2",
        secondary: "#14171a",
        accent: "#f5f8fa",
        danger: "#e0245e",
        success: "#17bf63",
        warning: "#ffad1f",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        xl: "1.5rem",
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Arial", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      boxShadow: {
        "outline-blue": "0 0 0 3px rgba(66, 153, 225, 0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-pattern": "url('/path-to-your-image')",
      },
      animation: {
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};

export default config;
