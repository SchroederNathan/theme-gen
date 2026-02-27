export type Theme = {
  name: string;
  colors: {
    // Core colors
    text: string;
    background: string;
    primary: string;
    container: string;
    accent: string;

    // State colors
    success: string;
    error: string;
    warning: string;

    // On-surface colors (auto-derived)
    onPrimary: string;
    onContainer: string;
    onAccent: string;
    onSuccess: string;
    onError: string;
    onWarning: string;

    // Utility colors (auto-derived)
    border: string;
    muted: string;
    ring: string;
  };
};

export const themes: Record<string, Theme> = {
  light: {
    name: "Light",
    colors: {
      text: "#1a1625",
      background: "#faf9fc",
      primary: "#4F46E5",
      container: "#eeedf2",
      accent: "#0284C7",

      success: "#059669",
      error: "#DC2626",
      warning: "#D97706",

      onPrimary: "#ffffff",
      onContainer: "#1a1625",
      onAccent: "#ffffff",
      onSuccess: "#ffffff",
      onError: "#ffffff",
      onWarning: "#ffffff",

      border: "#d4d2da",
      muted: "#8a8694",
      ring: "#4F46E5",
    },
  },
  dark: {
    name: "Dark",
    colors: {
      text: "#ede9f5",
      background: "#1a1625",
      primary: "#818CF8",
      container: "#2a2735",
      accent: "#22D3EE",

      success: "#10B981",
      error: "#EF4444",
      warning: "#F59E0B",

      onPrimary: "#1a1625",
      onContainer: "#ede9f5",
      onAccent: "#1a1625",
      onSuccess: "#1a1625",
      onError: "#ffffff",
      onWarning: "#1a1625",

      border: "#3d3a48",
      muted: "#9490a0",
      ring: "#818CF8",
    },
  },
};

export const defaultTheme = "light";
