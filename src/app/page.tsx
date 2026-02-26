import Bento from "../components/Bento";
import Hero from "../components/Hero";
import PreviewToggle from "@/components/studio/PreviewToggle";
import Pricing from "@/components/studio/pricing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text pb-24">
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
      <Hero />
      <Bento />
      <main className="relative">
        <PreviewToggle />
        <Pricing />
      </main>
    </div>
  );
}
