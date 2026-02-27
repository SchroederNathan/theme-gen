"use client";
import { useTheme } from "@/context/ThemeContext";
import { Dithering, GodRays, GrainGradient } from "@paper-design/shaders-react";

export default function Bento() {
  const { theme } = useTheme();

  return (
    <div className=" py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 data-color="primary" className="text-base/7 font-semibold text-primary">
          Design with ease
        </h2>
        <p data-color="text" className="mt-2 max-w-lg text-4xl font-semibold tracking-tight text-pretty text-text sm:text-5xl">
          Everything you need to create themes that won&apos;t make designers
          cry
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <div className="relative lg:col-span-3">
            <div data-color="secondary" className="absolute inset-px rounded-lg bg-container max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
              <GrainGradient
                width={800}
                height={320}
                colors={[
                  theme.colors.accent,
                  theme.colors.primary,
                  theme.colors.container,
                ]}
                colorBack={theme.colors.background}
                softness={0.5}
                intensity={0.49}
                noise={0.25}
                shape="blob"
                speed={0.5}
                scale={2.6}
              />
              <div className="p-10 pt-4">
                <h3 data-color="primary" className="text-sm/4 font-semibold text-primary">
                  Color Studio
                </h3>
                <p data-color="text" className="mt-2 text-lg font-medium tracking-tight text-text">
                  Intuitive Color Editing
                </p>
                <p data-color="muted" className="mt-2 max-w-lg text-sm/6 text-muted text-pretty">
                  Easily customize every color in your theme with our visual
                  editor. Pick colors with precision—or just guess and hope for
                  the best.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
          </div>
          <div className="relative lg:col-span-3">
            <div data-color="secondary" className="absolute inset-px rounded-lg bg-container lg:rounded-tr-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
              <Dithering
                width={800}
                height={320}
                colorBack={theme.colors.background}
                colorFront={theme.colors.primary}
                shape="simplex"
                type="4x4"
                size={2}
                speed={1}
                scale={0.6}
              />
              <div className="p-10 pt-4">
                <h3 data-color="primary" className="text-sm/4 font-semibold text-primary">
                  Live Preview
                </h3>
                <p data-color="text" className="mt-2 text-lg font-medium tracking-tight text-text">
                  See Changes Instantly
                </p>
                <p data-color="muted" className="mt-2 max-w-lg text-sm/6 text-muted text-pretty">
                  Watch your theme updates in real-time. See your mistakes
                  instantly, before anyone else does.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 lg:rounded-tr-[2rem]" />
          </div>
          <div className="relative lg:col-span-2">
            <div data-color="secondary" className="absolute inset-px rounded-lg bg-container lg:rounded-bl-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
              <GrainGradient
                width={800}
                height={320}
                colors={[
                  theme.colors.container,
                  theme.colors.primary,
                  theme.colors.accent,
                ]}
                colorBack={theme.colors.background}
                softness={0.5}
                intensity={0.5}
                noise={0.5}
                shape="ripple"
                speed={0}
                scale={0.5}
              />
              <div className="p-10 pt-4">
                <h3 data-color="primary" className="text-sm/4 font-semibold text-primary">
                  Dark Mode
                </h3>
                <p data-color="text" className="mt-2 text-lg font-medium tracking-tight text-text">
                  Toggle Light & Dark
                </p>
                <p data-color="muted" className="mt-2 max-w-lg text-sm/6 text-muted text-pretty">
                  Seamlessly switch between light and dark modes. Perfect for
                  night owls and those who work in poorly lit caves.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 lg:rounded-bl-[2rem]" />
          </div>
          <div className="relative lg:col-span-2">
            <div data-color="secondary" className="absolute inset-px rounded-lg bg-container" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <GodRays
                width={800}
                height={320}
                colors={[
                  theme.colors.primary,
                  theme.colors.accent,
                  theme.colors.container,
                ]}
                colorBack={theme.colors.background}
                colorBloom={theme.colors.primary}
                bloom={0.4}
                intensity={0.8}
                density={0.3}
                spotty={0.3}
                midSize={0.2}
                midIntensity={0.4}
                speed={0}
                offsetY={-0.55}
              />
              <div className="p-10 pt-4">
                <h3 data-color="primary" className="text-sm/4 font-semibold text-primary">
                  Export Options
                </h3>
                <p data-color="text" className="mt-2 text-lg font-medium tracking-tight text-text">
                  Multiple Format Support
                </p>
                <p data-color="muted" className="mt-2 max-w-lg text-sm/6 text-muted text-pretty">
                  Export your theme to CSS variables, Tailwind config, or other
                  formats. One click. Copy-paste. Done.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5" />
          </div>
          <div className="relative lg:col-span-2">
            <div data-color="secondary" className="absolute inset-px rounded-lg bg-container max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
              <GrainGradient
                width={800}
                height={320}
                colors={[
                  theme.colors.container,
                  theme.colors.primary,
                  theme.colors.accent,
                ]}
                colorBack={theme.colors.background}
                softness={0}
                intensity={0.23}
                noise={1}
                shape="truchet"
                speed={0}
                scale={0.44}
                rotation={80}
              />
              <div className="p-10 pt-4">
                <h3 data-color="primary" className="text-sm/4 font-semibold text-primary">
                  Theme Gallery *Coming Soon*
                </h3>
                <p data-color="text" className="mt-2 text-lg font-medium tracking-tight text-text">
                  Share & Discover
                </p>
                <p data-color="muted" className="mt-2 max-w-lg text-sm/6 text-muted text-pretty">
                  Browse themes made by others. Steal their ideas.
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
