"use client";

import { createContext, useContext, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

type PreviewMode = "web" | "mobile";

const PreviewModeContext = createContext<{
  mode: PreviewMode;
  setMode: (mode: PreviewMode) => void;
}>({ mode: "web", setMode: () => {} });

export function usePreviewMode() {
  return useContext(PreviewModeContext);
}

export function PreviewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PreviewMode>("web");
  return (
    <PreviewModeContext.Provider value={{ mode, setMode }}>
      {children}
    </PreviewModeContext.Provider>
  );
}

export default function PreviewToggle() {
  const { mode, setMode } = usePreviewMode();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="inline-flex items-center gap-1 bg-secondary p-1 rounded-lg shadow-lg border border-border">
        <button
          onClick={() => setMode("web")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "web"
              ? "bg-background text-text shadow-sm"
              : "text-muted hover:text-text"
          }`}
        >
          <Monitor size={16} />
          Web
        </button>
        <button
          onClick={() => setMode("mobile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "mobile"
              ? "bg-background text-text shadow-sm"
              : "text-muted hover:text-text"
          }`}
        >
          <Smartphone size={16} />
          Mobile
        </button>
      </div>
    </div>
  );
}
