"use client";

import { useState } from "react";
import { useTheme, SavedTheme } from "@/context/ThemeContext";
import { BookmarkPlus, Trash2, Palette, Clock, X } from "lucide-react";

interface SavedThemesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function ColorSwatch({ color }: { color: string }) {
  return (
    <div
      className="w-4 h-4 rounded-full border border-neutral-200 shadow-sm shrink-0"
      style={{ backgroundColor: color }}
      title={color}
    />
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SavedThemesPanel({ isOpen, onClose }: SavedThemesPanelProps) {
  const { theme, savedThemes, saveCurrentTheme, deleteSavedTheme, loadSavedTheme } = useTheme();
  const [saveName, setSaveName] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    saveCurrentTheme(saveName || "My Theme");
    setSaveName("");
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

  const handleLoad = (saved: SavedTheme) => {
    loadSavedTheme(saved);
    onClose();
  };

  const handleDeleteClick = (id: string) => {
    if (confirmDelete === id) {
      deleteSavedTheme(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 2500);
    }
  };

  const swatchKeys: (keyof typeof theme.colors)[] = [
    "background",
    "primary",
    "container",
    "accent",
    "text",
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-neutral-50 border border-neutral-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-neutral-700" />
            <h2 className="text-sm font-semibold text-neutral-800">Saved Themes</h2>
            {savedThemes.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-600 text-[10px] font-semibold">
                {savedThemes.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Save current theme */}
        <div className="px-5 py-4 border-b border-neutral-200 bg-white">
          <p className="text-xs text-neutral-500 mb-2.5">Save current theme</p>
          <div className="flex gap-2">
            {/* Color preview */}
            <div className="flex items-center gap-1 bg-neutral-100 rounded-md px-2.5 shrink-0">
              {swatchKeys.map((key) => (
                <ColorSwatch key={key} color={theme.colors[key]} />
              ))}
            </div>
            <input
              type="text"
              placeholder="Theme name..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              maxLength={40}
              className="flex-1 px-3 py-2 text-sm bg-neutral-100 rounded-md border border-transparent focus:border-neutral-300 focus:outline-none text-neutral-800 placeholder-neutral-400"
            />
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                justSaved
                  ? "bg-emerald-500 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-white"
              }`}
            >
              <BookmarkPlus size={14} />
              {justSaved ? "Saved!" : "Save"}
            </button>
          </div>
        </div>

        {/* Theme list */}
        <div className="flex-1 overflow-y-auto">
          {savedThemes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <Palette size={20} className="text-neutral-400" />
              </div>
              <p className="text-sm font-medium text-neutral-600">No saved themes yet</p>
              <p className="text-xs text-neutral-400 mt-1">
                Generate a palette you love, then save it above.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {savedThemes.map((saved) => (
                <li
                  key={saved.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-100/60 group transition-colors"
                >
                  {/* Color swatches */}
                  <div className="flex items-center gap-1 shrink-0">
                    {swatchKeys.map((key) => (
                      <ColorSwatch key={key} color={saved.theme.colors[key]} />
                    ))}
                  </div>

                  {/* Name + date */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {saved.name}
                    </p>
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {formatDate(saved.savedAt)}
                      <span className="capitalize">· {saved.themeName}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleLoad(saved)}
                      className="px-2.5 py-1 text-xs font-medium bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteClick(saved.id)}
                      className={`p-1.5 rounded-md transition-colors ${
                        confirmDelete === saved.id
                          ? "bg-red-500 text-white"
                          : "hover:bg-red-100 text-neutral-400 hover:text-red-500"
                      }`}
                      title={confirmDelete === saved.id ? "Click again to confirm delete" : "Delete theme"}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
