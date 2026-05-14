/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
      extend: {
          "colors": {
              "surface-container-highest": "#e4e1ee",
              "error": "#ba1a1a",
              "on-background": "#1b1b24",
              "surface-tint": "#4d44e3",
              "error-container": "#ffdad6",
              "on-surface-variant": "#464555",
              "background": "#fcf8ff",
              "on-tertiary-fixed-variant": "#7b2f00",
              "primary-fixed": "#e2dfff",
              "inverse-surface": "#302f39",
              "on-error-container": "#93000a",
              "surface": "#fcf8ff",
              "on-tertiary": "#ffffff",
              "surface-bright": "#fcf8ff",
              "primary-container": "#4f46e5",
              "surface-dim": "#dcd8e5",
              "secondary-container": "#b6b4ff",
              "outline": "#777587",
              "primary-fixed-dim": "#c3c0ff",
              "on-surface": "#1b1b24",
              "surface-container-low": "#f5f2ff",
              "on-tertiary-container": "#ffd2be",
              "on-primary-container": "#dad7ff",
              "on-secondary": "#ffffff",
              "secondary": "#58579b",
              "surface-container-high": "#eae6f4",
              "tertiary-fixed-dim": "#ffb695",
              "on-secondary-fixed-variant": "#413f82",
              "secondary-fixed-dim": "#c3c0ff",
              "on-primary-fixed-variant": "#3323cc",
              "inverse-primary": "#c3c0ff",
              "outline-variant": "#c7c4d8",
              "surface-container": "#f0ecf9",
              "tertiary": "#7e3000",
              "on-secondary-fixed": "#140f54",
              "tertiary-container": "#a44100",
              "on-primary-fixed": "#0f0069",
              "secondary-fixed": "#e2dfff",
              "on-primary": "#ffffff",
              "tertiary-fixed": "#ffdbcc",
              "primary": "#3525cd",
              "on-tertiary-fixed": "#351000",
              "surface-container-lowest": "#ffffff",
              "on-error": "#ffffff",
              "surface-variant": "#e4e1ee",
              "on-secondary-container": "#454386",
              "inverse-on-surface": "#f3effc"
          },
          "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
          },
          "spacing": {
              "xl": "64px",
              "lg": "40px",
              "sm": "12px",
              "xs": "4px",
              "margin": "32px",
              "md": "24px",
              "base": "8px",
              "gutter": "24px"
          },
          "fontFamily": {
              "h1": ["Inter", "sans-serif"],
              "body-sm": ["Inter", "sans-serif"],
              "h2": ["Inter", "sans-serif"],
              "label-sm": ["Inter", "sans-serif"],
              "body-lg": ["Inter", "sans-serif"],
              "label-md": ["Inter", "sans-serif"],
              "h3": ["Inter", "sans-serif"]
          },
          "fontSize": {
              "h1": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
              "body-sm": ["14px", {"lineHeight": "1.5", "letterSpacing": "0", "fontWeight": "400"}],
              "h2": ["24px", {"lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "600"}],
              "label-sm": ["12px", {"lineHeight": "1", "letterSpacing": "0.03em", "fontWeight": "500"}],
              "body-lg": ["16px", {"lineHeight": "1.6", "letterSpacing": "0", "fontWeight": "400"}],
              "label-md": ["14px", {"lineHeight": "1", "letterSpacing": "0.02em", "fontWeight": "600"}],
              "h3": ["20px", {"lineHeight": "1.4", "letterSpacing": "-0.01em", "fontWeight": "600"}]
          }
      },
  },
  plugins: [
    forms,
    containerQueries,
  ],
}
