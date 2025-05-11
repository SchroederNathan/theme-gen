// import { ChevronRightIcon } from '@heroicons/react/20/solid'

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import Bento from "../components/Bento";
import Hero from "../components/Hero";
import NavHeader from "../components/NavHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text">
      <NavHeader />
      <Hero />
      <Bento />
      <ThemeCustomizer />
    </div>
  );
}
