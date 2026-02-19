// import { ChevronRightIcon } from '@heroicons/react/20/solid'

import Bento from "../components/Bento";
import Hero from "../components/Hero";
import PreviewHero from "@/components/studio/hero";
import Pricing from "@/components/studio/pricing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text pb-24">

      <Hero />
      <Bento />
      <main className="relative">
        <PreviewHero />
        <Pricing />
      </main>
    </div>
  );
}
