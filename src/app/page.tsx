"use client";

import Bento from "../components/Bento";
import Hero from "../components/Hero";
import PreviewHero from "@/components/studio/hero";
import Pricing from "@/components/studio/pricing";
import PreviewToggle, { PreviewModeProvider, usePreviewMode } from "@/components/studio/PreviewToggle";
import MobilePreview from "@/components/studio/MobilePreview";
import Script from "next/script";

function PageContent() {
  const { mode } = usePreviewMode();

  return (
    <div className="min-h-screen bg-background text-text pb-24">
      <PreviewToggle />

      {/* Both views stay mounted — hidden via CSS to preserve state */}
      <div style={{ display: mode === "web" ? "contents" : "none" }}>
        <Hero />
        <Bento />
        <main className="relative">
          <PreviewHero />
          <Pricing />
        </main>
      </div>

      <div style={{ display: mode === "mobile" ? "block" : "none" }}>
        <div className="pt-20">
          <div className="overflow-hidden bg-background py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
                <h2 data-color="primary" className="text-base/7 font-semibold text-primary">
                  Mobile Preview
                </h2>
                <p data-color="text" className="mt-2 text-4xl  font-semibold tracking-tight text-pretty text-text sm:text-5xl">
                  Your Theme, Pocket&nbsp;Sized
                </p>
                <p data-color="muted" className="mt-6 text-xl/8 text-muted">
                  Browse through a collection of different mobile UI&apos;s to see how your colors look.
                </p>
              </div>
              <MobilePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <PreviewModeProvider>
      <Script
        id="jsonld-webapp"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Theme Gen",
          url: "https://themegen.dev",
          description:
            "Create beautiful color themes with a free visual editor. Preview in real-time and export to CSS variables, Tailwind config, and more.",
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          featureList: [
            "Visual color theme editor",
            "Real-time preview",
            "CSS variables export",
            "Tailwind config export",
            "WCAG contrast auditing",
            "Dark/Light mode support",
          ],
        })}
      </Script>
      <PageContent />
    </PreviewModeProvider>
  );
}
