import Image from "next/image";

export default function Bento() {
  return (
    <div className=" py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base/7 font-semibold text-primary">
          Design with ease
        </h2>
        <p className="mt-2 max-w-lg text-4xl font-semibold text-text tracking-tight text-pretty text-text sm:text-5xl">
          Everything you need to create themes that won&apos;t make designers cry
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <div className="relative lg:col-span-3">
            <div className="absolute inset-px rounded-lg bg-secondary max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
              <Image
                alt="Color palette customization"
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-performance.png"
                width={800}
                height={320}
                className="h-80 object-cover object-left"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Color Studio
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-text">
                  Intuitive Color Editing
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-text/80">
                  Easily customize every color in your theme with our visual
                  editor. Pick colors with precision—or just guess and hope for the best.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
          </div>
          <div className="relative lg:col-span-3">
            <div className="absolute inset-px rounded-lg bg-secondary lg:rounded-tr-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
              <Image
                alt="Real-time theme preview"
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-releases.png"
                width={800}
                height={320}
                className="h-80 object-cover object-left lg:object-right"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Live Preview
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-text">
                  See Changes Instantly
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-text/80 opacity-70">
                  Watch your theme updates in real-time. See your mistakes
                  instantly, before anyone else does.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 lg:rounded-tr-[2rem]" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-secondary lg:rounded-bl-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
              <Image
                alt="Dark and light mode support"
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-speed.png"
                width={800}
                height={320}
                className="h-80 object-cover object-left"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Dark Mode
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-text">
                  Toggle Light & Dark
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-text/80 opacity-70">
                  Seamlessly switch between light and dark modes. Perfect for
                  night owls and those who work in poorly lit caves.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 lg:rounded-bl-[2rem]" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-secondary" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <Image
                alt="Code export options"
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-integrations.png"
                width={800}
                height={320}
                className="h-80 object-cover"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Export Options
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-text">
                  Multiple Format Support
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-text/80 opacity-70">
                  Export your theme to CSS variables, Tailwind config, or other
                  formats. One click. Copy-paste. Done. (No more manual conversion.)
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-secondary max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
              <Image
                alt="Theme gallery and sharing"
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-network.png"
                width={800}
                height={320}
                className="h-80 object-cover"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Theme Gallery
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-text">
                  Share & Discover
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-text/80 opacity-70">
                  Browse themes made by others. Steal their ideas. (We call it &quot;inspiration.&quot;)
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
