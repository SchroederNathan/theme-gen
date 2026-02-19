export type Theme = {
  name: string;
  colors: {
    // Core colors
    text: string;
    background: string;
    primary: string;
    secondary: string;
    accent: string;

    // State colors
    success: string;
    error: string;
    warning: string;

    // Utility colors (auto-derived)
    border: string;
    muted: string;
  };
};

export const themes: Record<string, Theme> = {
  light: {
    name: "Light",
    colors: {
      text: "#1a1625",
      background: "#faf9fc",
      primary: "#4F46E5",
      secondary: "#eeedf2",
      accent: "#0284C7",

      success: "#059669",
      error: "#DC2626",
      warning: "#D97706",

      border: "#d4d2da",
      muted: "#8a8694",
    },
  },
  dark: {
    name: "Dark",
    colors: {
      text: "#ede9f5",
      background: "#1a1625",
      primary: "#818CF8",
      secondary: "#2a2735",
      accent: "#22D3EE",

      success: "#10B981",
      error: "#EF4444",
      warning: "#F59E0B",

      border: "#3d3a48",
      muted: "#9490a0",
    },
  },
};

export const defaultTheme = "light";
