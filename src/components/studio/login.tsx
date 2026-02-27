import Image from "next/image";

export default function Login() {
  return (
    <>
      {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            src="/logos/logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto h-10 w-auto"
          />
          <h2 data-color="text" className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-text">
            Super real login form
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                data-color="text"
                className="block text-sm/6 font-medium text-text"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  data-color="container"
                  className="block w-full rounded-md bg-container px-3 py-1.5 text-base text-text outline-1 -outline-offset-1 outline-border placeholder:text-muted focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  data-color="text"
                className="block text-sm/6 font-medium text-text"
                >
                  Password
                </label>
                <div className="text-sm">
                  <button
                    type="button"
                    data-color="primary"
                    className="font-semibold text-primary hover:text-primary/90"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  data-color="container"
                  className="block w-full rounded-md bg-container px-3 py-1.5 text-base text-text outline-1 -outline-offset-1 outline-border placeholder:text-muted focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                data-color="primary"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-onPrimary shadow-xs hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Sign in
              </button>
            </div>
          </form>

          <p data-color="muted" className="mt-10 text-center text-sm/6 text-muted">
            Not a member?{" "}
            <button
              type="button"
              data-color="primary"
              className="font-semibold text-primary hover:text-primary/90"
            >
              Start a 14 day free trial
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
