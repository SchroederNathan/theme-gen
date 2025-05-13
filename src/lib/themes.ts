export type Theme = {
  name: string;
  colors: {
    // Core colors
    primary: string;
    onPrimary: string;
    secondary: string;
    onSecondary: string;
    
    // Background and surface colors
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    
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
      primary: "#4F46E5",       // Indigo 600
      onPrimary: "#FFFFFF",     // White
      secondary: "#0EA5E9",     // Sky 500
      onSecondary: "#FFFFFF",   // White
      
      // Background and surface colors
      background: "#F9FAFB",    // Gray 50
      onBackground: "#111827",  // Gray 900
      surface: "#FFFFFF",       // White
      onSurface: "#111827",     // Gray 900
      
      // State colors
      success: "#059669",       // Emerald 600
      error: "#DC2626",         // Red 600
      warning: "#D97706",       // Amber 600
      
      // Utility colors
      border: "#E5E7EB",        // Gray 200
      muted: "#6B7280",         // Gray 500
    },
  },
  dark: {
    name: "Dark",
    colors: {
      // Core colors
      primary: "#6366F1",       // Indigo 500
      onPrimary: "#FFFFFF",     // White
      secondary: "#38BDF8",     // Sky 400
      onSecondary: "#FFFFFF",   // White
      
      // Background and surface colors
      background: "#111827",    // Gray 900
      onBackground: "#F9FAFB",  // Gray 50
      surface: "#1F2937",       // Gray 800
      onSurface: "#F9FAFB",     // Gray 50
      
      // State colors
      success: "#10B981",       // Emerald 500
      error: "#EF4444",         // Red 500
      warning: "#F59E0B",       // Amber 500
      
      // Utility colors
      border: "#374151",        // Gray 700
      muted: "#9CA3AF",         // Gray 400
    },
  },
};

export const defaultTheme = "light";
