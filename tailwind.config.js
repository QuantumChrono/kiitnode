/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // iOS Semantic Palette - Light Mode defaults
        "ios-bg": "#F2F2F7",
        "ios-card": "#FFFFFF",
        "ios-card-pressed": "#E5E5EA",
        "ios-label": "#000000",
        "ios-secondary-label": "rgba(60, 60, 67, 0.60)",
        "ios-tertiary-label": "rgba(60, 60, 67, 0.30)",
        "ios-separator": "rgba(60, 60, 67, 0.18)",
        "ios-glass-border": "rgba(0, 0, 0, 0.08)",
        "ios-green": "#34C759",
        "ios-green-tint": "rgba(52, 199, 89, 0.12)",
        "ios-blue": "#007AFF",
      },
      fontSize: {
        // Apple Typography Scale
        "ios-large-title": [34, { lineHeight: 41, letterSpacing: 0.37, fontWeight: "700" }],
        "ios-title-1": [28, { lineHeight: 34, letterSpacing: 0.36, fontWeight: "700" }],
        "ios-title-2": [22, { lineHeight: 28, letterSpacing: 0.35, fontWeight: "700" }],
        "ios-title-3": [20, { lineHeight: 25, letterSpacing: 0.38, fontWeight: "600" }],
        "ios-headline": [17, { lineHeight: 22, letterSpacing: -0.41, fontWeight: "600" }],
        "ios-body": [17, { lineHeight: 22, letterSpacing: -0.41, fontWeight: "400" }],
        "ios-callout": [16, { lineHeight: 21, letterSpacing: -0.32, fontWeight: "400" }],
        "ios-subheadline": [15, { lineHeight: 20, letterSpacing: -0.24, fontWeight: "400" }],
        "ios-footnote": [13, { lineHeight: 18, letterSpacing: -0.08, fontWeight: "400" }],
        "ios-caption-1": [12, { lineHeight: 16, letterSpacing: 0, fontWeight: "400" }],
        "ios-caption-2": [11, { lineHeight: 13, letterSpacing: 0.07, fontWeight: "600" }],
      },
      borderRadius: {
        "ios-card": 16,
        "ios-floating": 33,
        "ios-button": 14,
        "ios-badge": 8,
      },
    },
  },
  plugins: [],
};