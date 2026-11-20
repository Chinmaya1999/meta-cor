/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm paper / espresso ink / amber, matched to the reference design
        navy: { DEFAULT: "#29231D", 2: "#342D26", 3: "#443B32" },
        gold: { DEFAULT: "#F8BC4F", light: "#FBD88E", dark: "#A8661E" },
        coral: { DEFAULT: "#A8661E", light: "#C27B2A" },
        ivory: "#F9F7F2", sand: "#EEEBE4", pearl: "#FFFFFF",
        ink: "#29231D", muted: "#6C645A",
      },
      fontFamily: {
        serif: ['"Barlow Condensed"', '"Arial Narrow"', "Impact", "sans-serif"],
        sans: ["Lato", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: { soft: "0 10px 30px -14px rgba(41,35,29,.25)", lift: "0 24px 56px -22px rgba(41,35,29,.5)" },
      keyframes: { pulseRing: { "0%": { transform: "scale(.6)", opacity: ".7" }, "100%": { transform: "scale(2.2)", opacity: "0" } } },
      animation: { pulseRing: "pulseRing 2.8s ease-out infinite" },
    },
  },
  plugins: [],
};
