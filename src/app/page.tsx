// import { ChevronRightIcon } from '@heroicons/react/20/solid'

import Bento from "../components/Bento";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text">
      <Hero />
      <Bento />
    </div>
  );
}
