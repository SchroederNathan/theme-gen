export default function Bento() {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base/7 font-semibold text-primary">
          Deploy faster
        </h2>
        <p className="mt-2 max-w-lg text-4xl font-semibold tracking-tight text-pretty text-text sm:text-5xl">
          Everything you need to deploy your app
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <div className="relative lg:col-span-3">
            <div className="absolute inset-px rounded-lg bg-background max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-performance.png"
                className="h-80 object-cover object-left"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Performance
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-text">
                  Lightning-fast builds
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                  gravida justo et nulla efficitur, maximus egestas sem
                  pellentesque.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
          </div>
          <div className="relative lg:col-span-3">
            <div className="absolute inset-px rounded-lg bg-background lg:rounded-tr-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-releases.png"
                className="h-80 object-cover object-left lg:object-right"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Releases
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-text">
                  Push to deploy
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-secondary">
                  Curabitur auctor, ex quis auctor venenatis, eros arcu rhoncus
                  massa, laoreet dapibus ex elit vitae odio.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 lg:rounded-tr-[2rem]" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-background lg:rounded-bl-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-speed.png"
                className="h-80 object-cover object-left"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Speed
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-text">
                  Built for power users
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-secondary">
                  Sed congue eros non finibus molestie. Vestibulum euismod
                  augue.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5 lg:rounded-bl-[2rem]" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-background" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-integrations.png"
                className="h-80 object-cover"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Integrations
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-text">
                  Connect your favorite tools
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-secondary">
                  Maecenas at augue sed elit dictum vulputate, in nisi aliquam
                  maximus arcu.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border/5" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-background max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-network.png"
                className="h-80 object-cover"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Network
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-text">
                  Globally distributed CDN
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-secondary">
                  Aenean vulputate justo commodo auctor vehicula in malesuada
                  semper.
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
