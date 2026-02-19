import Image from "next/image";

export default function Testimonial() {
    return (
      <section className="relative isolate overflow-hidden bg-background px-6 lg:px-8 min-h-full flex items-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-primary-100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-secondary shadow-xl ring-1 shadow-primary/10 ring-border sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <Image src="/logos/logo.svg" alt="Testimonial" width={400} height={400} className="mx-auto h-12" />
          <figure className="mt-10">
            <blockquote className="text-center text-xl/8 font-semibold text-text sm:text-2xl/9">
              <p>
                &quot;I used to spend 47 hours picking colors. Now I spend 47 hours picking colors, but at least the site looks good while I do it.&quot;
              </p>
            </blockquote>
            <figcaption className="mt-10">
              <Image
                alt=""
                src="/nate.jpeg"
                width={400}
                height={400}
                className="mx-auto size-10 rounded-full"
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-text">Nathan Schroeder</div>
                <svg width={3} height={3} viewBox="0 0 2 2" aria-hidden="true" className="fill-text">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <div className="text-muted">CEO of ThemeGen</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    )
  }
  