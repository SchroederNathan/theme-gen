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
                    🎉 Now with Tailwind V4 support!
                  </span>
                  {/* <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600">
                    <span>Just shipped v0.1.0</span>
                  </span> */}
                </a>
              </div>
              <h1 className="mx-auto mt-10 max-w-4xl font-display text-5xl font-medium tracking-tight sm:text-7xl">
                <span className="relative whitespace-nowrap text-primary">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 418 42"
                    className="absolute top-2/3 left-0 h-[0.58em] w-full fill-primary/50 [mask-image:linear-gradient(to_right,transparent,black,transparent)]"
                    preserveAspectRatio="none"
                  >
                    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                  </svg>
                  <span className="relative">Theme Gen</span>
                </span>
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-muted sm:text-xl/8">
                Create and preview themes in real time. Export to CSS, Tailwind,
                and more with just a click.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-background shadow-xs hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Create Theme
                </a>
                <a
                  href="https://github.com/SchroederNathan/theme-gen.git"
                  className="text-sm/6 font-semibold text-text flex items-center gap-2 bg-accent/20 px-3.5 py-2.5 rounded-md"
                >
                  GitHub
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"></path>
                  </svg>
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
