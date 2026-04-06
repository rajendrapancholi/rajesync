import { useColorScheme } from "nativewind";

export const Palette = {
  light: {
    background: "#f8fafc",
    border: "#e2e8f0",
    surface: "#ececec",
    primary: "#006065",
    muted: "#64748b",
    textMain: "#0f172a",
    textMuted: "#64748b",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
    card: "#ffffff",
    primaryForeground: "#ffffff",
    active: "#004231",
    primaryMuted: "#00523e15",
    textInverse: "#ffffff",
    input: "#f1f5f9",
    ring: "#00523e33",
  },

  dark: {
    background: "#000314",
    border: "#e2e8f0",
    surface: "#1e2336",
    primary: "#00696f",
    textMain: "#f8fafc",
    muted: "#94a3b8",
    textMuted: "#94a3b8",
    success: "#34d399",
    danger: "#f87171",
    warning: "#fbbf24",
    info: "#60a5fa",
    card: "#00093d4d",
    primaryForeground: "#f8fafc",
    active: "#004231",
    primaryMuted: "#00523e30",
    textMnverse: "#000314",
    input: "#00062c",
    ring: "#00523e66",
  },
};

/**
 * Custom hook to get theme-aware hex colors in TSX components
 * Use this for Icon 'color' props or Inline Styles
 */
export const useThemeColors = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const active = isDark ? Palette.dark : Palette.light;

  return {
    isDark,
    colors: active,
    // Helper for Alert configurations
    alertConfig: {
      danger: {
        icon: "alert-circle" as const,
        color: active.danger,
        bgColor: "bg-danger/10",
      },
      success: {
        icon: "checkmark-circle" as const,
        color: active.success,
        bgColor: "bg-success/10",
      },
      warning: {
        icon: "warning" as const,
        color: active.warning,
        bgColor: "bg-warning/10",
      },
      info: {
        icon: "information-circle" as const,
        color: active.info,
        bgColor: "bg-info/10",
      },
    },
  };
};
