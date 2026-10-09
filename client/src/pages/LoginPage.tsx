import { SignIn } from "@clerk/react";
import { Link } from "react-router";
import Logo from "../components/Logo";

export default function LoginPage() {
  return (
    <div className="relative min-h-svh overflow-x-clip bg-slate-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-teal-500/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-emerald-400/20 blur-3xl"
      />

      <div className="relative grid min-h-svh lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between p-12 lg:flex">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/login-hero.jpg')" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-slate-950/60 to-slate-950"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40"
          />

          <Link to="/" className="relative text-xl">
            <Logo />
          </Link>

          <div className="relative max-w-md">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              Just Moved?
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Find local utility providers and save useful locations for your
              next move.
            </p>
          </div>
        </aside>

        <main className="flex min-w-0 flex-col px-4 py-8 sm:px-6 sm:py-12">
          <div className="my-auto flex w-full flex-col items-center">
            <Link to="/" className="mb-8 text-xl lg:hidden">
              <Logo />
            </Link>

            <div className="w-full max-w-[25rem]">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full max-w-full",
                    cardBox: "w-full max-w-full",
                    card: "w-full max-w-full",
                  },
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
