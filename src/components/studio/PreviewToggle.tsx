"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import PreviewHero from "./hero";

const MobilePreview = dynamic(() => import("./MobilePreview"), { ssr: false });

export default function PreviewToggle() {
  const [view, setView] = useState<"web" | "mobile">("web");

  return (
    <div>
      {/* Toggle bar */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-1 bg-secondary p-1 rounded-lg">
          <button
            onClick={() => setView("web")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === "web"
                ? "bg-background text-text shadow-sm"
                : "text-muted hover:text-text"
            }`}
          >
            <Monitor size={16} />
            Web
          </button>
          <button
            onClick={() => setView("mobile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === "mobile"
                ? "bg-background text-text shadow-sm"
                : "text-muted hover:text-text"
            }`}
          >
            <Smartphone size={16} />
            Mobile
          </button>
        </div>
      </div>

      {/* Preview content */}
      {view === "web" ? (
        <PreviewHero />
      ) : (
        <div data-color="background" className="overflow-hidden bg-background py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 data-color="text" className="text-4xl font-semibold tracking-tight text-text sm:text-5xl">
                Mobile Preview
              </h2>
              <p data-color="muted" className="mt-4 text-lg text-muted">
                See how your theme looks on mobile — because if it looks bad on a phone, it looks bad everywhere.
              </p>
            </div>
            <MobilePreview />
          </div>
        </div>
      )}
    </div>
  );
}
