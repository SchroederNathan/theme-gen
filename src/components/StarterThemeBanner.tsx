"use client";

import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { StarterThemeGallery } from "./StarterThemeGallery";
import {
  starterThemes,
} from "@/lib/starterThemes";

export function StarterThemeBanner() {
  const [showGallery, setShowGallery] = useState(false);

  // Show 4 preview themes
  const preview = starterThemes.slice(0, 4);

  return (
    <>
      <StarterThemeGallery
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
      />
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2
              data-color="primary"
              className="text-base/7 font-semibold text-primary"
            >
              Get started fast
            </h2>
            <p
              data-color="text"
              className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-text sm:text-5xl"
            >
              Pick a Starter Theme
            </p>
            <p
              data-color="muted"
              className="mt-6 text-lg/8 text-muted"
            >
              Browse polished themes built for real projects. Pick one, customize
              it, and export — all in seconds.
            </p>
          </div>

          {/* Preview cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
            {preview.map((starter) => {
              const { background, primary, container, accent, text } =
                starter.theme.colors;
              return (
                <div
                  key={starter.id}
                  className="rounded-xl border border-border/50 overflow-hidden"
                >
                  {/* Mini preview */}
                  <div
                    className="h-20 p-2.5 flex flex-col gap-1.5"
                    style={{ backgroundColor: background }}
                  >
                    <div className="flex gap-1 items-center">
                      <div
                        className="w-10 h-1.5 rounded-full"
                        style={{ backgroundColor: text, opacity: 0.6 }}
                      />
                      <div className="flex-1" />
                      <div
                        className="w-5 h-1.5 rounded-full"
                        style={{ backgroundColor: text, opacity: 0.2 }}
                      />
                    </div>
                    <div className="flex gap-1.5 flex-1">
                      <div className="flex-1 flex flex-col gap-1 justify-center">
                        <div
                          className="w-full h-1.5 rounded-full"
                          style={{ backgroundColor: text, opacity: 0.5 }}
                        />
                        <div
                          className="w-3/4 h-1.5 rounded-full"
                          style={{ backgroundColor: text, opacity: 0.3 }}
                        />
                        <div
                          className="w-10 h-3 rounded mt-0.5"
                          style={{ backgroundColor: primary }}
                        />
                      </div>
                      <div
                        className="w-10 rounded shrink-0"
                        style={{ backgroundColor: container }}
                      >
                        <div className="p-1 flex flex-col gap-0.5">
                          <div
                            className="w-full h-1 rounded-full"
                            style={{ backgroundColor: accent, opacity: 0.5 }}
                          />
                          <div
                            className="w-2/3 h-1 rounded-full"
                            style={{ backgroundColor: text, opacity: 0.15 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-2.5 py-2 bg-container/30">
                    <p
                      data-color="text"
                      className="text-[11px] font-medium text-text truncate"
                    >
                      {starter.name}
                    </p>
                    <p className="text-[10px] text-muted">{starter.category}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowGallery(true)}
              data-color="primary"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-onPrimary shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Sparkles size={16} />
              Browse all {starterThemes.length} starter themes
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
