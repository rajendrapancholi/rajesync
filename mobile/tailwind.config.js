/** @type {import('tailwindcss').Config} */
export const darkMode = "class"; 
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const presets = [require("nativewind/preset")];
export const theme = {
  extend: {
    colors: {
      background: "var(--color-background)",
      surface: "var(--color-surface)",
      card: "var(--color-card)",
      primary: {
        DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
        foreground: "var(--color-primary-foreground)",
        muted: "var(--color-primary-muted)",
      },
      danger: "rgb(var(--color-danger) / <alpha-value>)",
      main: "var(--color-text-main)",
      muted: "var(--color-text-muted)",
      inverse: "var(--color-text-inverse)",
      success: "var(--color-success)",

      warning: "var(--color-warning)",
      info: "var(--color-info)",
      border: "var(--color-border)",
      input: "var(--color-input)",
    },
  },
};
export const plugins = [];

export const corePlugins = {
  opacity: true,
};
