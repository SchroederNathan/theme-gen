import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
        <div className="px-6 lg:px-0 lg:pt-4">
          <div className="mx-auto max-w-2xl">
            <div className="max-w-lg">
              {/* <Image
                src="/logos/logo.svg"
                alt="Your Company"
                width={70}
                height={70}
              /> */}
              <div className="mt-24 sm:mt-32 lg:mt-16">
                <a href="#" className="inline-flex space-x-6">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm/6 font-semibold text-primary ring-1 ring-primary/10 ring-inset">
                    🎉 Just shipped v1.0!
                  </span>
                  {/* <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600">
                    <span>Just shipped v0.1.0</span>
                  </span> */}
                </a>
              </div>
              <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-text sm:text-7xl">
                Theme Gen
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-onSurface/60 sm:text-xl/8">
                Create and preview themes in real time. Export to CSS, Tailwind,
                and more with just a click.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Create Theme
                </a>
                <a href="https://github.com/SchroederNathan/theme-gen.git" className="text-sm/6 font-semibold text-text">
                  View on GitHub <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
          <div
            className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-background shadow-xl ring-1 shadow-primary/10 ring-primary/5 md:-mr-20 lg:-mr-36"
            aria-hidden="true"
          />
          <div className="shadow-lg md:rounded-3xl">
            <div className="bg-primary [clip-path:inset(0)] md:[clip-path:inset(0_round_var(--radius-3xl))]">
              <div
                className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-primary/20 opacity-20 ring-1 ring-background ring-inset md:ml-20 lg:ml-36"
                aria-hidden="true"
              />
              <div className="relative px-6 pt-8 sm:pt-16 md:pr-0 md:pl-16">
                <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                  <div className="w-screen overflow-hidden rounded-tl-xl">
                    <Image
                      src="/preview.png"
                      alt="Hero"
                      className="rounded-t-lg"
                      width={700}
                      height={700}
                    />
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute inset-0 ring-1 ring-border/10 ring-inset md:rounded-3xl"
                  aria-hidden="true"
                />
                
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-background to-transparent sm:h-32" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent sm:h-40" />
    </div>
    
  );
};

export default Hero;
