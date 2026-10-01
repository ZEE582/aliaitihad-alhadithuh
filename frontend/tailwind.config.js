/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      // iPad portrait starts at 768, but we reserve 768-1023 for large phones / small tablets
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        cairo: [
          "Cairo",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      spacing: {
        "safe-t": "env(safe-area-inset-top, 0px)",
        "safe-b": "env(safe-area-inset-bottom, 0px)",
        "safe-l": "env(safe-area-inset-left, 0px)",
        "safe-r": "env(safe-area-inset-right, 0px)",
      },
      minHeight: {
        screen: "100vh",
        "screen-d": "100dvh",
      },
      height: {
        "screen-d": "100dvh",
      },
      minWidth: {
        "screen-d": "100dvw",
      },
      width: {
        "screen-d": "100dvw",
      },
      maxWidth: {
        "screen-d": "100dvw",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-out",
        fadeInUp: "fadeInUp 0.3s ease-out",
        scaleIn: "scaleIn 0.2s ease-out",
        slideDown: "slideDown 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
