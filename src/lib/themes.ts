export type Theme = {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    muted: string;
    border: string;
    ring: string;
    hover: string;
  };
  typography?: {
    fontFamily: string;
    fontSize: {
      base: string;
      sm: string;
      lg: string;
      xl: string;
      "2xl": string;
    };
  };
  spacing?: {
    base: string;
    sm: string;
    md: string;
    lg: string;
  };
  borderRadius?: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
};

export const themes: Record<string, Theme> = {
  light: {
    name: "Light",
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      background: "#ffffff",
      text: "#1e293b",
      accent: "#f59e0b",
      muted: "#f1f5f9",
      border: "#e2e8f0",
      ring: "#94a3b8",
      hover: "#f8fafc",
    },
    // typography: {
    //   fontFamily: 'var(--font-geist-sans)',
    //   fontSize: {
    //     base: '1rem',
    //     sm: '0.875rem',
    //     lg: '1.125rem',
    //     xl: '1.25rem',
    //     '2xl': '1.5rem',
    //   },
    // },
    // spacing: {
    //   base: '1rem',
    //   sm: '0.5rem',
    //   md: '1.5rem',
    //   lg: '2rem',
    // },
    // borderRadius: {
    //   sm: '0.25rem',
    //   md: '0.5rem',
    //   lg: '1rem',
    //   full: '9999px',
    // },
  },
  dark: {
    name: "Dark",
    colors: {
      primary: "#60a5fa",
      secondary: "#94a3b8",
      background: "#0f172a",
      text: "#f1f5f9",
      accent: "#fbbf24",
      muted: "#1e293b",
      border: "#334155",
      ring: "#475569",
      hover: "#1e293b",
    },
    // typography: {
    //   fontFamily: 'var(--font-geist-sans)',
    //   fontSize: {
    //     base: '1rem',
    //     sm: '0.875rem',
    //     lg: '1.125rem',
    //     xl: '1.25rem',
    //     '2xl': '1.5rem',
    //   },
    // },
    // spacing: {
    //   base: '1rem',
    //   sm: '0.5rem',
    //   md: '1.5rem',
    //   lg: '2rem',
    // },
    // borderRadius: {
    //   sm: '0.25rem',
    //   md: '0.5rem',
    //   lg: '1rem',
    //   full: '9999px',
    // },
  },
  // Add more themes as needed
};

export const defaultTheme = "light";
