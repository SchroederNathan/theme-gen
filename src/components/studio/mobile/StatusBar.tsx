"use client";

import { useTheme } from "@/context/ThemeContext";
import { Wifi, Battery, Signal } from "lucide-react";

export function StatusBar() {
  const { theme } = useTheme();
  return (
    <div
      className="flex items-center justify-between px-6 pt-2 pb-1 text-[10px] font-semibold"
      style={{ color: theme.colors.text }}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <Signal size={10} />
        <Wifi size={10} />
        <Battery size={12} />
      </div>
    </div>
  );
}
