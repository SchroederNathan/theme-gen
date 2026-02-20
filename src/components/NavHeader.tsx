"use client";

import { Coffee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NavHeader() {
  return (
    <header className="z-1000">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Theme Gen</span>
            <Image
              src="/logos/logo.svg"
              alt="Theme Gen"
              width={40}
              height={40}
            />
          </Link>
        </div>
        <div className="flex flex-1 justify-end">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-onPrimary shadow-sm hover:bg-primary/85 transition-colors"
          >
            <Coffee aria-hidden="true" className="size-4" />
            Buy me a coffee
          </a>
        </div>
      </nav>
    </header>
  );
}
