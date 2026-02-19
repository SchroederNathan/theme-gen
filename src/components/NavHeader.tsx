"use client";

import { classNames } from "@/lib/utils";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  Eye,
  MenuIcon,
  Paintbrush,
  Palette,
  XIcon,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const products: {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  aiBadge?: boolean;
}[] = [
  {
    name: "Studio",
    description: "Where your color indecision goes to die",
    href: "/studio",
    icon: Palette,
  },
  {
    name: "Preview",
    description: "Preview your theme before it&apos;s too late",
    href: "/preview",
    icon: Eye,
  },
  {
    name: "Generate",
    description: "Let AI pick colors so you don&apos;t have to",
    href: "/generate",
    icon: Paintbrush,
    aiBadge: true,
  },
];
// const callsToAction = [
//   { name: "Watch demo", href: "#", icon: PlayCircle },
//   { name: "Contact sales", href: "#", icon: Phone },
// ];
// const company = [
//   { name: "About us", href: "#" },
//   { name: "Careers", href: "#" },
//   { name: "Support", href: "#" },
//   { name: "Press", href: "#" },
//   { name: "Blog", href: "#" },
// ];

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border z-1000">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
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
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-text"
          >
            <span className="sr-only">Open main menu</span>
            <MenuIcon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-text">
              Create
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 flex-none text-text"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-background shadow-lg ring-1 ring-border transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-text/5"
                  >
                    <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-text/5 group-hover:bg-background">
                      <item.icon
                        aria-hidden="true"
                        className="size-6 text-muted group-hover:text-primary"
                      />
                    </div>
                    <div className="flex-auto">
                      <Link
                        href={item.href}
                        className="block font-semibold text-text"
                      >
                        {item.name}
                        {/* {item.aiBadge && (
                          <span className="inline-flex ms-2 items-center rounded-md px-1.5 py-0.5 text-xs font-medium ai-badge">
                            AI
                          </span>
                        )} */}
                        <span className="absolute inset-0" />
                      </Link>
                      <p className="mt-1 text-muted">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="grid grid-cols-2 divide-x divide-onSurface/15 bg-text/5">
                {callsToAction.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-text hover:bg-hover"
                  >
                    <item.icon
                      aria-hidden="true"
                      className="size-5 flex-none text-muted"
                    />
                    {item.name}
                  </Link>
                ))}
              </div> */}
            </PopoverPanel>
          </Popover>

          <Link href="/colors" className="text-sm/6 font-semibold text-text">
            Colors
          </Link>
          <Link href="/gallery" className="text-sm/6 font-semibold text-text">
            Gallery
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/login" className="text-sm/6 font-semibold text-text">
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Theme Gen</span>
              <Image
                src="/logos/logo.svg"
                alt="Theme Gen"
                width={32}
                height={32}
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-text"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold text-text">
                        Create
                        <ChevronDownIcon
                          className={classNames(
                            open ? "rotate-180" : "",
                            "size-5 flex-none"
                          )}
                          aria-hidden="true"
                        />
                      </DisclosureButton>
                      <DisclosurePanel className="mt-2 space-y-2">
                        {[...products].map((item) => (
                          <DisclosureButton
                            key={item.name}
                            as={Link}
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold text-text hover:bg-text/5"
                          >
                            {item.name}
                            {item.aiBadge && (
                              <span className="ml-2 rounded-md px-2 py-1 text-xs font-medium ai-badge">
                                AI
                              </span>
                            )}
                          </DisclosureButton>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
                <Link
                  href="/colors"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-text hover:bg-text/5"
                >
                  Colors
                </Link>
                <Link
                  href="/gallery"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-text hover:bg-text/5"
                >
                  Gallery
                </Link>
              </div>
              <div className="py-6">
                <Link
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-text hover:bg-text/5"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
