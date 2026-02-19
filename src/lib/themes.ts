export type Theme = {
  name: string;
  colors: {
    // 5 user-controllable colors
    text: string;
    background: string;
    primary: string;
    secondary: string;
    accent: string;

    // Auto-derived colors
    onPrimary: string;
    onSecondary: string;
    onAccent: string;
    surface: string;
    border: string;
    muted: string;

    // State colors
    success: string;
    error: string;
    warning: string;
  };
};

export const themes: Record<string, Theme> = {
  light: {
    name: "Light",
    colors: {
      // User-controllable
      text: "#111827",
      background: "#F9FAFB",
      primary: "#4F46E5",
      secondary: "#0EA5E9",
      accent: "#F59E0B",

      // Derived
      onPrimary: "#FFFFFF",
      onSecondary: "#FFFFFF",
      onAccent: "#111827",
      surface: "#FFFFFF",
      border: "#E5E7EB",
      muted: "#6B7280",

      // State
      success: "#059669",
      error: "#DC2626",
      warning: "#D97706",
    },
  },
  dark: {
    name: "Dark",
    colors: {
      // User-controllable
      text: "#F9FAFB",
      background: "#111827",
      primary: "#6366F1",
      secondary: "#38BDF8",
      accent: "#FBBF24",

      // Derived
      onPrimary: "#FFFFFF",
      onSecondary: "#111827",
      onAccent: "#111827",
      surface: "#1F2937",
      border: "#374151",
      muted: "#9CA3AF",

      // State
      success: "#10B981",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },
};

export const defaultTheme = "light";
