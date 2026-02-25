import {
  Download,
  Moon,
  Redo2,
  Shuffle,
  Sparkles,
  Sun,
  Undo2,
} from "lucide-react";
import { useReducer } from "react";
import { tooltipReducer, initialTooltipState } from "./theme-customizer-reducers";

interface ContrastAuditItem {
  id: string;
  label: string;
  ratio: number;
  pass: boolean;
  required: boolean;
}

interface ToolbarButtonsProps {
  isCompact: boolean;
  canUndo: boolean;
  canRedo: boolean;
  themeName: string;
  currentContrastAudit: ContrastAuditItem[];
  requiredContrastPassCount: number;
  requiredContrastAuditLength: number;
  onUndo: () => void;
  onRedo: () => void;
  onSmartShuffle: () => void;
  onToggleTheme: () => void;
  onExportClick: () => void;
}

export function ToolbarButtons({
  isCompact,
  canUndo,
  canRedo,
  themeName,
  currentContrastAudit,
  requiredContrastPassCount,
  requiredContrastAuditLength,
  onUndo,
  onRedo,
  onSmartShuffle,
  onToggleTheme,
  onExportClick,
}: ToolbarButtonsProps) {
  const [tooltipState, dispatchTooltip] = useReducer(tooltipReducer, initialTooltipState);

  return (
    <div
      className={`flex flex-row gap-1 items-center justify-center ${
        isCompact ? "h-12" : "h-full"
      }`}
    >
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center ${!canUndo ? "opacity-30 pointer-events-none" : ""}`}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={16} className="text-neutral-800" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center ${!canRedo ? "opacity-30 pointer-events-none" : ""}`}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 size={16} className="text-neutral-800" />
      </button>
      <div className="relative flex items-center h-full">
        <button
          onClick={onSmartShuffle}
          className="p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center"
          onMouseEnter={() => dispatchTooltip({ type: 'SHOW_RANDOMIZE_TOOLTIP', payload: true })}
          onMouseLeave={() => dispatchTooltip({ type: 'SHOW_RANDOMIZE_TOOLTIP', payload: false })}
        >
          <Shuffle size={16} className="text-neutral-800" />
        </button>
        {tooltipState.showRandomizeTooltip && (
          <div
            role="tooltip"
            className="absolute bottom-4 z-100 inline-block px-3 py-2 text-sm font-medium text-neutral-800 border border-neutral-200 transition-opacity duration-300 bg-neutral-50 shadow-sm rounded-lg tooltip min-w-[144px] text-center"
            style={{
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: "8px",
            }}
          >
            <div className="flex items-center justify-center gap-2 font-semibold">
              Smart Shuffle
              <Sparkles size={16} className="text-neutral-800" />
            </div>
            <p className="mt-1 text-[11px] text-neutral-600">
              Accessibility checks: {requiredContrastPassCount}/
              {requiredContrastAuditLength} passing
            </p>
            <ul className="mt-2 space-y-1 text-left text-[11px] max-h-44 overflow-auto pr-1">
              {currentContrastAudit.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-2"
                >
                  <span
                    className={
                      item.pass ? "text-emerald-700" : "text-red-700"
                    }
                  >
                    {item.label}
                  </span>
                  <span className="font-semibold text-neutral-800">
                    {item.ratio.toFixed(1)}:1
                  </span>
                </li>
              ))}
            </ul>
            <div className="absolute -bottom-1 -z-10 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-neutral-50"></div>
          </div>
        )}
      </div>
      <div className="relative h-full">
        <button
          onClick={onToggleTheme}
          className="p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center"
          onMouseEnter={() => dispatchTooltip({ type: 'SHOW_THEME_TOOLTIP', payload: true })}
          onMouseLeave={() => dispatchTooltip({ type: 'SHOW_THEME_TOOLTIP', payload: false })}
        >
          {themeName === "light" ? (
            <Moon size={16} className="text-neutral-800" />
          ) : (
            <Sun size={16} className="text-neutral-800" />
          )}
        </button>
        {tooltipState.showThemeTooltip && (
          <div
            role="tooltip"
            className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-neutral-800 transition-opacity duration-300 bg-neutral-50 shadow-sm rounded-lg border border-neutral-200 tooltip min-w-[120px] text-center"
            style={{
              bottom: "99%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: "8px",
            }}
          >
            Toggle Theme
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-neutral-50"></div>
          </div>
        )}
      </div>
      <div className="relative h-full">
        <button
          onClick={onExportClick}
          className="p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center"
          onMouseEnter={() => dispatchTooltip({ type: 'SHOW_DOWNLOAD_TOOLTIP', payload: true })}
          onMouseLeave={() => dispatchTooltip({ type: 'SHOW_DOWNLOAD_TOOLTIP', payload: false })}
        >
          <Download size={16} className="text-neutral-800" />
        </button>
        {tooltipState.showDownloadTooltip && (
          <div
            role="tooltip"
            className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-neutral-800 transition-opacity duration-300 bg-neutral-50 shadow-sm rounded-lg border border-neutral-200 tooltip min-w-[120px] text-center"
            style={{
              bottom: "99%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: "8px",
            }}
          >
            Export Theme
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-neutral-50"></div>
          </div>
        )}
      </div>
    </div>
  );
}