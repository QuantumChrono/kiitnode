/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        campus: {
          primary: "#059669",
          "primary-light": "#34D399",
          "dark-bg": "#0F172A",
          "dark-surface": "#1E293B",
        },
        badge: {
          market: "#F59E0B",
          collab: "#6366F1",
          anonymous: "#64748B",
          notes: "#8B5CF6",
        },
      },
    },
  },
  plugins: [],
};
