import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "nss-blue": {
          DEFAULT: "#003366",
          light: "#00509d",
          dark: "#001d3d",
        },
        "nss-red": {
          DEFAULT: "#ee2c3c",
          light: "#ff5e6c",
          dark: "#b30010",
        },
        "inspiria-blue": {
          DEFAULT: "#004e92",
          light: "#0066c0",
          dark: "#003666",
        },
        "inspiria-yellow": {
          DEFAULT: "#fdb913",
          light: "#ffcc4d",
          dark: "#c78f00",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
