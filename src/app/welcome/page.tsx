import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your DexLabz registration is complete.",
};

export default async function WelcomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#416df4] text-white">
      <Image
        alt="Two illustrated hands presenting a large pink heart"
        className="z-0 object-cover object-[center_50%]"
        fill
        priority
        sizes="100vw"
        src="/images/dexlabz-welcome-heart-v2.png"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-slate-950/30"
      />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:px-14 lg:py-10">
        <header className="flex items-center justify-between">
          <p
            className="text-2xl font-medium tracking-[-0.07em] text-white sm:text-3xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            DexLabz
          </p>
          <span className="rounded-full border border-white/35 bg-white/15 px-4 py-2 text-xs font-medium backdrop-blur-md">
            Registration complete
          </span>
        </header>

        <section className="absolute left-1/2 top-[50%] flex w-[min(88vw,620px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center text-[#ffffff]">
          {/* <div className="inline-flex items-center gap-2 rounded-full border border-[#2948af]/20 bg-white/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
            <CheckIcon />
            Access verified
          </div> */}

          <h1 className="mt-5 text-4xl  capitalize leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            Thank You, {user.name}
            <br />
            {/* {user.name} */}
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-6 text-[#ffffff]/85 sm:text-base sm:leading-7">
            Your registration is complete and your invitation has been
            securely verified. We’re delighted to have you joining DexLabz.
          </p>

          <p className="mt-3 max-w-md text-xs  text-[#ffffff] sm:text-sm">
            Keep an eye on {user.email} {""}
            for what comes next.
          </p>

          <form action="/api/auth/logout" className="mt-6" method="post">
            <button
              className="h-11 rounded-full bg-[#ffffff] px-7 text-sm font-semibold text-black shadow-xl shadow-blue-950/15 transition hover:-translate-y-0.5 hover:bg-[#000000] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2948af]"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </section>

        <footer className="flex items-center justify-between text-xs text-white/65">
          <p>© 2026 DexLabz</p>
          {/* <p className="hidden sm:block">One invitation. One verified access.</p> */}
        </footer>
      </div>
    </main>
  );
}
