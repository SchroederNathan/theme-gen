import Checklist from "./checklist";
import DangerModal from "./danger-modal";
import Login from "./login";
import Testimonial from "./testimonial";

export default function Hero() {
  return (
    <div className="overflow-hidden bg-background py-32">
      <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:min-w-full lg:flex-none lg:gap-y-8">
          <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
            <h2 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl">
              Super Cool Website
            </h2>
            <p className="mt-6 text-xl/8 text-muted">
              Create color themes that won&apos;t make your users run screaming.
              Explore combinations that actually match, preview in real-time,
              and export code that won&apos;t make other developers point and laugh.
            </p>
            <p className="mt-6 text-base/7 text-muted">
              Whether you&apos;re designing a corporate snooze-fest, a &quot;please buy
              our stuff&quot; store, or a portfolio to prove you&apos;re not just a cat
              walking on keyboards, Theme Studio helps you look like you know
              what colors are.
            </p>
            <div className="mt-10 flex">
              <a
                href="#"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-background shadow-xs hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Start Creating <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
            <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
              <div className="aspect-7/5 w-[37rem] max-w-none rounded-2xl outline-1 outline-border">
                <Login />
              </div>
            </div>
            <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
              <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                <div className="aspect-4/3 w-[24rem] max-w-none flex-none rounded-2xl outline-1 outline-border pt-4">
                  <Checklist />
                </div>
              </div>
              <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                <div className="aspect-7/5 w-[37rem] max-w-none flex-none rounded-2xl outline-1 outline-border overflow-hidden">
                  <Testimonial />
                </div>
              </div>
              <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                <div className=" w-[24rem] max-w-none rounded-2xl outline-1 outline-border">
                  <DangerModal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
