"use client";

import dynamic from "next/dynamic";
import Bento from "../components/Bento";
import Hero from "../components/Hero";
import PreviewHero from "@/components/studio/hero";
import Pricing from "@/components/studio/pricing";
import PreviewToggle, { PreviewModeProvider, usePreviewMode } from "@/components/studio/PreviewToggle";

const MobilePreview = dynamic(() => import("@/components/studio/MobilePreview"), { ssr: false });

function PageContent() {
  const { mode } = usePreviewMode();

  return (
    <div className="min-h-screen bg-background text-text pb-24">
      <PreviewToggle />

      {mode === "web" ? (
        <>
          <Hero />
          <Bento />
          <main className="relative">
            <PreviewHero />
            <Pricing />
          </main>
        </>
      ) : (
        <div className="pt-20">
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
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <PreviewModeProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />
      <PageContent />
    </PreviewModeProvider>
  );
}
