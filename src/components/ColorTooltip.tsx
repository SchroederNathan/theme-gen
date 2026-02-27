"use client";

import { useTheme } from "@/context/ThemeContext";
import { useCallback, useEffect, useRef } from "react";

const COLOR_LABELS: Record<string, string> = {
  text: "Text",
  background: "Background",
  primary: "Primary",
  container: "Container",
  accent: "Accent",
  success: "Success",
  error: "Error",
  warning: "Warning",
  onPrimary: "On Primary",
  onContainer: "On Container",
  onAccent: "On Accent",
  onSuccess: "On Success",
  onError: "On Error",
  onWarning: "On Warning",
  border: "Border",
  muted: "Muted",
};

export function ColorTooltipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const swatchRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const hexRef = useRef<HTMLSpanElement>(null);
  const copiedWrapperRef = useRef<HTMLSpanElement>(null);
  const activeColorRef = useRef<string | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const findColorAttr = useCallback(
    (target: EventTarget | null): string | null => {
      let el = target as HTMLElement | null;
      while (el && el !== containerRef.current) {
        const color = el.getAttribute("data-color");
        if (color) return color;
        el = el.parentElement;
      }
      return null;
    },
    []
  );

  const positionTooltip = useCallback((x: number, y: number) => {
    const tt = tooltipRef.current;
    if (!tt) return;
    const offset = 12;
    const rect = tt.getBoundingClientRect();
    const w = rect.width || 160;
    const h = rect.height || 36;

    let tx = x + offset;
    let ty = y + offset;

    if (tx + w > window.innerWidth - 8) tx = x - w - offset;
    if (ty + h > window.innerHeight - 8) ty = y - h - offset;
    if (tx < 8) tx = 8;
    if (ty < 8) ty = 8;

    tt.style.left = `${tx}px`;
    tt.style.top = `${ty}px`;
  }, []);

  const clearCopiedTimers = useCallback(() => {
    if (copiedTimerRef.current) {
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = null;
    }
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  }, []);

  const collapseCopied = useCallback(() => {
    if (copiedWrapperRef.current) {
      copiedWrapperRef.current.classList.remove("color-tooltip-expand");
      copiedWrapperRef.current.classList.add("color-tooltip-collapse");
    }
  }, []);

  const showTooltip = useCallback(
    (colorName: string, x: number, y: number) => {
      const colors = themeRef.current.colors;
      const hex = colors[colorName as keyof typeof colors] ?? null;
      if (!hex) {
        tooltipRef.current!.style.display = "none";
        activeColorRef.current = null;
        return;
      }

      activeColorRef.current = colorName;
      if (swatchRef.current) swatchRef.current.style.backgroundColor = hex;
      if (labelRef.current)
        labelRef.current.textContent = COLOR_LABELS[colorName] ?? colorName;
      if (hexRef.current) hexRef.current.textContent = hex.toUpperCase();

      // Reset copied state when switching colors
      clearCopiedTimers();
      if (copiedWrapperRef.current) {
        copiedWrapperRef.current.classList.remove(
          "color-tooltip-expand",
          "color-tooltip-collapse"
        );
      }

      tooltipRef.current!.style.display = "flex";
      positionTooltip(x, y);
    },
    [positionTooltip, clearCopiedTimers]
  );

  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) tooltipRef.current.style.display = "none";
    activeColorRef.current = null;
    clearCopiedTimers();
    if (copiedWrapperRef.current) {
      copiedWrapperRef.current.classList.remove(
        "color-tooltip-expand",
        "color-tooltip-collapse"
      );
    }
  }, [clearCopiedTimers]);

  // Update tooltip content when theme changes
  useEffect(() => {
    const colorName = activeColorRef.current;
    if (
      !colorName ||
      !tooltipRef.current ||
      tooltipRef.current.style.display === "none"
    )
      return;
    const hex = theme.colors[colorName as keyof typeof theme.colors];
    if (!hex) return;
    if (swatchRef.current) swatchRef.current.style.backgroundColor = hex;
    if (hexRef.current) hexRef.current.textContent = hex.toUpperCase();
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const colorName = findColorAttr(e.target);
      if (!colorName) {
        hideTooltip();
        return;
      }
      if (colorName !== activeColorRef.current) {
        showTooltip(colorName, e.clientX, e.clientY);
      } else {
        positionTooltip(e.clientX, e.clientY);
      }
    };

    const handleMouseLeave = () => {
      hideTooltip();
    };

    const handleClick = (e: MouseEvent) => {
      const colorName = findColorAttr(e.target);
      if (!colorName) return;

      const colors = themeRef.current.colors;
      const hex = colors[colorName as keyof typeof colors];
      if (!hex) return;

      navigator.clipboard.writeText(hex.toUpperCase());

      const wrapper = copiedWrapperRef.current;
      if (!wrapper) return;

      // Reset and re-trigger expand
      clearCopiedTimers();
      wrapper.classList.remove("color-tooltip-expand", "color-tooltip-collapse");
      const _reflow = wrapper.offsetHeight;
      void _reflow;
      wrapper.classList.add("color-tooltip-expand");

      // Collapse after 1.5s
      copiedTimerRef.current = setTimeout(() => {
        collapseCopied();
      }, 1500);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("click", handleClick);
      clearCopiedTimers();
    };
  }, [
    findColorAttr,
    showTooltip,
    hideTooltip,
    positionTooltip,
    clearCopiedTimers,
    collapseCopied,
  ]);

  return (
    <div ref={containerRef}>
      {children}
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed z-[9999] items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm shadow-sm"
        style={{ display: "none", left: 0, top: 0 }}
      >
        <span
          ref={swatchRef}
          className="inline-block size-3 rounded-full border border-neutral-300 shrink-0"
        />
        <span className="text-neutral-800 font-medium whitespace-nowrap">
          <span ref={labelRef} />{" "}
          <span ref={hexRef} className="text-neutral-500 font-normal" />
        </span>
        <span
          ref={copiedWrapperRef}
          className="inline-flex overflow-hidden whitespace-nowrap"
          style={{ maxWidth: 0, opacity: 0 }}
        >
          <span className="text-emerald-600 font-medium ml-1.5 text-xs flex items-center gap-1">
            <svg
              className="size-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            Copied!
          </span>
        </span>
      </div>
    </div>
  );
}
