import Image from "next/image";

export default function Bento() {
  return (
    <div className=" py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base/7 font-semibold text-primary">
          Design with ease
        </h2>
        <p className="mt-2 max-w-lg text-4xl font-semibold text-onBackground tracking-tight text-pretty text-text sm:text-5xl">
          Everything you need to create beautiful themes
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <div className="relative lg:col-span-3">
            <div className="absolute inset-px rounded-lg bg-container max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
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
                <p className="mt-2 text-lg font-medium tracking-tight text-onContainer">
                  Intuitive Color Editing
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-onContainer/80">
                  Easily customize every color in your theme with our visual
                  editor. Pick colors with precision using hex codes or our
                  interactive color picker.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
          </div>
          <div className="relative lg:col-span-3">
            <div className="absolute inset-px rounded-lg bg-container lg:rounded-tr-[2rem]" />
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
                <p className="mt-2 text-lg font-medium tracking-tight text-onContainer">
                  See Changes Instantly
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-onContainer/80 opacity-70">
                  Watch your theme updates in real-time with our interactive
                  preview. Test your design across different UI components with
                  zero delay.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 lg:rounded-tr-[2rem]" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-container lg:rounded-bl-[2rem]" />
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
                <p className="mt-2 text-lg font-medium tracking-tight text-onContainer">
                  Toggle Light & Dark
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-onContainer/80 opacity-70">
                  Seamlessly switch between light and dark modes to ensure your
                  theme looks perfect in any environment.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 lg:rounded-bl-[2rem]" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-container" />
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
                <p className="mt-2 text-lg font-medium tracking-tight text-onContainer">
                  Multiple Format Support
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-onContainer/80 opacity-70">
                  Export your theme to CSS variables, Tailwind config, or other
                  formats with a single click for seamless integration.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-container max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
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
                <p className="mt-2 text-lg font-medium tracking-tight text-onContainer">
                  Share & Discover
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-onContainer/80 opacity-70">
                  Browse a collection of pre-made themes or share your creations
                  with the community to inspire others.
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
