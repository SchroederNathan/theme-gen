export type Theme = {
  name: string;
  colors: {
    // Core colors
    primary: string;
    onPrimary: string;
    secondary: string;
    onSecondary: string;
    accent: string;
    onAccent: string;

    // Background and container colors
    background: string;
    onBackground: string;
    container: string;
    onContainer: string;

    // State colors
    success: string;
    error: string;
    warning: string;

    // Utility colors
    border: string;
    muted: string;
  };
};

export const themes: Record<string, Theme> = {
  light: {
    name: "Light",
    colors: {
      // Core colors
      primary: "#4F46E5", // Indigo 600
      onPrimary: "#FFFFFF", // White
      secondary: "#7C3AED", // Violet 600
      onSecondary: "#FFFFFF", // White
      accent: "#0EA5E9", // Sky 500
      onAccent: "#FFFFFF", // White

      // Background and container colors
      background: "#F9FAFB", // Gray 50
      onBackground: "#111827", // Gray 900
      container: "#FFFFFF", // White
      onContainer: "#111827", // Gray 900

      // State colors
      success: "#059669", // Emerald 600
      error: "#DC2626", // Red 600
      warning: "#D97706", // Amber 600

      // Utility colors
      border: "#E5E7EB", // Gray 200
      muted: "#6B7280", // Gray 500
    },
  },
  dark: {
    name: "Dark",
    colors: {
      // Core colors
      primary: "#6366F1", // Indigo 500
      onPrimary: "#FFFFFF", // White
      secondary: "#8B5CF6", // Violet 500
      onSecondary: "#FFFFFF", // White
      accent: "#38BDF8", // Sky 400
      onAccent: "#FFFFFF", // White

      // Background and container colors
      background: "#111827", // Gray 900
      onBackground: "#F9FAFB", // Gray 50
      container: "#1F2937", // Gray 800
      onContainer: "#F9FAFB", // Gray 50

      // State colors
      success: "#10B981", // Emerald 500
      error: "#EF4444", // Red 500
      warning: "#F59E0B", // Amber 500

      // Utility colors
      border: "#374151", // Gray 700
      muted: "#9CA3AF", // Gray 400
    },
  },
};

export const defaultTheme = "light";
