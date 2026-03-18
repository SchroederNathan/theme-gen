import { Theme } from "./themes";
import { mixOklch, pickOnColor } from "./colorUtils";

export type StarterThemeCategory = "SaaS" | "Portfolio" | "Blog" | "Dashboard";

export interface StarterTheme {
  id: string;
  name: string;
  description: string;
  category: StarterThemeCategory;
  mode: "light" | "dark";
  theme: Theme;
}

function buildTheme(
  name: string,
  mode: "light" | "dark",
  core: {
    text: string;
    background: string;
    primary: string;
    container: string;
    accent: string;
    success?: string;
    error?: string;
    warning?: string;
  }
): Theme {
  const success = core.success || (mode === "dark" ? "#10B981" : "#059669");
  const error = core.error || (mode === "dark" ? "#EF4444" : "#DC2626");
  const warning = core.warning || (mode === "dark" ? "#F59E0B" : "#D97706");

  return {
    name,
    colors: {
      text: core.text,
      background: core.background,
      primary: core.primary,
      container: core.container,
      accent: core.accent,
      success,
      error,
      warning,
      onPrimary: pickOnColor(core.primary),
      onContainer: pickOnColor(core.container),
      onAccent: pickOnColor(core.accent),
      onSuccess: pickOnColor(success),
      onError: pickOnColor(error),
      onWarning: pickOnColor(warning),
      border: mixOklch(core.text, core.background, 0.82),
      muted: mixOklch(core.text, core.background, 0.55),
      ring: core.primary,
    },
  };
}

export const starterThemes: StarterTheme[] = [
  {
    id: "starter-indigo-saas",
    name: "Indigo SaaS",
    description: "Clean indigo palette perfect for modern SaaS products",
    category: "SaaS",
    mode: "light",
    theme: buildTheme("Indigo SaaS", "light", {
      text: "#1e1b4b",
      background: "#fafafe",
      primary: "#4F46E5",
      container: "#eef2ff",
      accent: "#0ea5e9",
    }),
  },
  {
    id: "starter-midnight-dashboard",
    name: "Midnight",
    description: "Dark interface optimized for data-heavy dashboards",
    category: "Dashboard",
    mode: "dark",
    theme: buildTheme("Midnight", "dark", {
      text: "#e2e8f0",
      background: "#0f172a",
      primary: "#6366f1",
      container: "#1e293b",
      accent: "#22d3ee",
    }),
  },
  {
    id: "starter-forest-blog",
    name: "Forest",
    description: "Warm earthy greens for readable, organic blog layouts",
    category: "Blog",
    mode: "light",
    theme: buildTheme("Forest", "light", {
      text: "#1a2e1a",
      background: "#fafdf7",
      primary: "#16a34a",
      container: "#ecfdf5",
      accent: "#ca8a04",
      success: "#15803d",
    }),
  },
  {
    id: "starter-noir-portfolio",
    name: "Noir",
    description: "Bold monochrome with punchy accents for creative portfolios",
    category: "Portfolio",
    mode: "dark",
    theme: buildTheme("Noir", "dark", {
      text: "#fafafa",
      background: "#0a0a0a",
      primary: "#f5f5f5",
      container: "#1c1c1c",
      accent: "#f97316",
    }),
  },
  {
    id: "starter-coral-saas",
    name: "Coral Breeze",
    description: "Vibrant coral and teal, great for consumer-facing SaaS",
    category: "SaaS",
    mode: "light",
    theme: buildTheme("Coral Breeze", "light", {
      text: "#1c1917",
      background: "#fffbfa",
      primary: "#e11d48",
      container: "#fff1f2",
      accent: "#0d9488",
    }),
  },
  {
    id: "starter-aurora-dashboard",
    name: "Aurora",
    description: "Deep violet dashboard theme with electric cyan highlights",
    category: "Dashboard",
    mode: "dark",
    theme: buildTheme("Aurora", "dark", {
      text: "#ede9fe",
      background: "#13061f",
      primary: "#a78bfa",
      container: "#1e1233",
      accent: "#2dd4bf",
    }),
  },
  {
    id: "starter-sand-blog",
    name: "Sand Dune",
    description: "Warm neutral tones for distraction-free long-form reading",
    category: "Blog",
    mode: "light",
    theme: buildTheme("Sand Dune", "light", {
      text: "#292524",
      background: "#faf8f5",
      primary: "#b45309",
      container: "#f5f0eb",
      accent: "#7c3aed",
    }),
  },
  {
    id: "starter-studio-portfolio",
    name: "Studio",
    description: "Minimal light palette with blue accents for design portfolios",
    category: "Portfolio",
    mode: "light",
    theme: buildTheme("Studio", "light", {
      text: "#111827",
      background: "#ffffff",
      primary: "#2563eb",
      container: "#f3f4f6",
      accent: "#ec4899",
    }),
  },
];

export const starterCategories: StarterThemeCategory[] = [
  "SaaS",
  "Portfolio",
  "Blog",
  "Dashboard",
];
