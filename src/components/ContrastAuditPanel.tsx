"use client";

import {
  ensureContrast,
  getContrastRatio,
  getWCAGContrastResult,
  pickOnColor,
} from "@/lib/colorUtils";
import { Theme } from "@/lib/themes";
import clsx from "clsx";
import { AlertTriangle, CheckCircle2, Sparkles, Wand2 } from "lucide-react";

type ThemeColors = Theme["colors"];
type ColorKey = keyof ThemeColors;

type AuditPair = {
  id: string;
  label: string;
  foreground: ColorKey;
  background: ColorKey;
  intent: "body" | "ui" | "on-color";
  note: string;
};

type Suggestion = {
  id: string;
  label: string;
  property: ColorKey;
  value: string;
  ratio: number;
};

const auditPairs: AuditPair[] = [
  {
    id: "text/background",
    label: "Text → Background",
    foreground: "text",
    background: "background",
    intent: "body",
    note: "Main body copy and UI chrome.",
  },
  {
    id: "text/container",
    label: "Text → Container",
    foreground: "text",
    background: "container",
    intent: "body",
    note: "Cards, panels, and elevated surfaces.",
  },
  {
    id: "muted/background",
    label: "Muted → Background",
    foreground: "muted",
    background: "background",
    intent: "body",
    note: "Helper text and supporting metadata.",
  },
  {
    id: "primary/background",
    label: "Primary → Background",
    foreground: "primary",
    background: "background",
    intent: "ui",
    note: "Links, accents, and non-body emphasis.",
  },
  {
    id: "accent/background",
    label: "Accent → Background",
    foreground: "accent",
    background: "background",
    intent: "ui",
    note: "Secondary accent usage on page background.",
  },
  {
    id: "onPrimary/primary",
    label: "On Primary → Primary",
    foreground: "onPrimary",
    background: "primary",
    intent: "on-color",
    note: "Primary buttons, pills, and filled CTAs.",
  },
  {
    id: "onContainer/container",
    label: "On Container → Container",
    foreground: "onContainer",
    background: "container",
    intent: "body",
    note: "Copy inside cards and preview surfaces.",
  },
  {
    id: "onAccent/accent",
    label: "On Accent → Accent",
    foreground: "onAccent",
    background: "accent",
    intent: "on-color",
    note: "Text/icons placed on accent fills.",
  },
  {
    id: "onSuccess/success",
    label: "On Success → Success",
    foreground: "onSuccess",
    background: "success",
    intent: "on-color",
    note: "Success badges, toasts, and chips.",
  },
  {
    id: "onError/error",
    label: "On Error → Error",
    foreground: "onError",
    background: "error",
    intent: "on-color",
    note: "Error banners and destructive buttons.",
  },
  {
    id: "onWarning/warning",
    label: "On Warning → Warning",
    foreground: "onWarning",
    background: "warning",
    intent: "on-color",
    note: "Warning callouts and caution states.",
  },
];

function getTarget(intent: AuditPair["intent"]) {
  if (intent === "body") return 7;
  if (intent === "on-color") return 4.5;
  return 3;
}

function getSuggestions(colors: ThemeColors, pair: AuditPair): Suggestion[] {
  const target = getTarget(pair.intent);
  const currentRatio = getContrastRatio(
    colors[pair.foreground],
    colors[pair.background],
  );

  if (currentRatio >= target) {
    return [];
  }

  const suggestions: Suggestion[] = [];
  const saferForeground =
    pair.intent === "on-color"
      ? pickOnColor(colors[pair.background])
      : ensureContrast(colors[pair.foreground], colors[pair.background], target);
  const saferBackground = ensureContrast(
    colors[pair.background],
    colors[pair.foreground],
    target,
  );

  const saferForegroundRatio = getContrastRatio(
    saferForeground,
    colors[pair.background],
  );
  if (saferForeground.toLowerCase() !== colors[pair.foreground].toLowerCase()) {
    suggestions.push({
      id: `${pair.id}-foreground`,
      label:
        pair.intent === "on-color"
          ? `Recompute ${pair.foreground} for ${pair.background}`
          : `Shift ${pair.foreground} to a safer contrast stop`,
      property: pair.foreground,
      value: saferForeground,
      ratio: saferForegroundRatio,
    });
  }

  const saferBackgroundRatio = getContrastRatio(
    colors[pair.foreground],
    saferBackground,
  );
  if (saferBackground.toLowerCase() !== colors[pair.background].toLowerCase()) {
    suggestions.push({
      id: `${pair.id}-background`,
      label: `Shift ${pair.background} to support readable ${pair.foreground}`,
      property: pair.background,
      value: saferBackground,
      ratio: saferBackgroundRatio,
    });
  }

  return suggestions.sort((a, b) => b.ratio - a.ratio).slice(0, 2);
}

interface ContrastAuditPanelProps {
  colors: ThemeColors;
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestion: (property: ColorKey, value: string) => void;
}

export function ContrastAuditPanel({
  colors,
  isOpen,
  onClose,
  onApplySuggestion,
}: ContrastAuditPanelProps) {
  if (!isOpen) return null;

  const results = auditPairs.map((pair) => {
    const wcag = getWCAGContrastResult(colors[pair.foreground], colors[pair.background]);
    return {
      ...pair,
      target: getTarget(pair.intent),
      wcag,
      suggestions: getSuggestions(colors, pair),
    };
  });

  const aaPassCount = results.filter((result) => result.wcag.aaNormal).length;
  const aaaPassCount = results.filter((result) => result.wcag.aaaNormal).length;
  const failingResults = results.filter((result) => result.wcag.ratio < result.target);

  return (
    <div className="fixed inset-x-4 bottom-24 z-[60] md:left-1/2 md:right-auto md:w-[min(960px,calc(100vw-2rem))] md:-translate-x-1/2">
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-neutral-200 px-5 py-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-600">
              <Sparkles className="size-3.5" />
              Contrast heatmap
            </div>
            <h3 className="mt-3 text-xl font-semibold text-neutral-900">
              Audit token pairs before you ship the palette
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-neutral-600">
              Live WCAG checks for core text, surfaces, and filled UI states. Failures include one-click safer token suggestions.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">AA</div>
              <div className="text-lg font-semibold text-neutral-900">{aaPassCount}/{results.length}</div>
            </div>
            <div className="h-10 w-px bg-neutral-200" />
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">AAA</div>
              <div className="text-lg font-semibold text-neutral-900">{aaaPassCount}/{results.length}</div>
            </div>
            <button
              onClick={onClose}
              className="ml-2 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100"
            >
              Close
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((result) => {
              const isTargetPass = result.wcag.ratio >= result.target;
              return (
                <section
                  key={result.id}
                  className={clsx(
                    "rounded-2xl border p-4",
                    isTargetPass
                      ? "border-emerald-200 bg-emerald-50/70"
                      : "border-amber-200 bg-amber-50/70",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-neutral-900">{result.label}</h4>
                      <p className="mt-1 text-xs text-neutral-600">{result.note}</p>
                    </div>
                    <div className="rounded-xl border border-black/5 bg-white px-3 py-2 text-right shadow-sm">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">ratio</div>
                      <div className="text-lg font-semibold text-neutral-900">{result.wcag.ratio.toFixed(2)}:1</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <div
                      className="flex-1 rounded-xl border border-black/5 px-3 py-3 shadow-sm"
                      style={{ backgroundColor: colors[result.background], color: colors[result.foreground] }}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
                        {result.foreground}
                      </div>
                      <div className="mt-2 text-base font-semibold">Readable sample</div>
                      <div className="text-sm opacity-80">Against {result.background}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className={clsx("rounded-full px-2.5 py-1", result.wcag.aaNormal ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700")}>AA text</span>
                    <span className={clsx("rounded-full px-2.5 py-1", result.wcag.aaaNormal ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700")}>AAA text</span>
                    <span className={clsx("rounded-full px-2.5 py-1", result.wcag.aaLarge ? "bg-sky-100 text-sky-800" : "bg-neutral-200 text-neutral-700")}>AA large</span>
                  </div>

                  <div className="mt-3 rounded-xl border border-black/5 bg-white/80 p-3">
                    <div className="flex items-center justify-between gap-2 text-xs text-neutral-600">
                      <span>Target for this pair</span>
                      <span className="font-semibold text-neutral-900">{result.target}:1</span>
                    </div>

                    {result.suggestions.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {result.suggestions.map((suggestion) => (
                          <div key={suggestion.id} className="rounded-xl border border-neutral-200 bg-white p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-neutral-900">{suggestion.label}</div>
                                <div className="mt-1 text-xs text-neutral-600">
                                  Sets <span className="font-semibold text-neutral-800">{suggestion.property}</span> to {suggestion.value} for about {suggestion.ratio.toFixed(2)}:1 contrast.
                                </div>
                              </div>
                              <button
                                onClick={() => onApplySuggestion(suggestion.property, suggestion.value)}
                                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
                              >
                                <Wand2 className="size-3.5" />
                                Apply
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-700">
                        <CheckCircle2 className="size-4" />
                        This pairing clears its current target.
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-neutral-200 bg-white px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
              {failingResults.length > 0 ? (
                <AlertTriangle className="size-4 text-amber-500" />
              ) : (
                <CheckCircle2 className="size-4 text-emerald-500" />
              )}
              Launch readiness summary
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              {failingResults.length > 0
                ? `${failingResults.length} pair${failingResults.length === 1 ? " is" : "s are"} below the intended target. Use the apply buttons above to tighten the palette without losing the overall direction.`
                : "Everything in the core audit is within target. You’ve got a sturdy, launch-ready contrast baseline."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
