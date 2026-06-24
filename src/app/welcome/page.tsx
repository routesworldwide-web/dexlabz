import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

// import { BrandLogo } from "@/components/brand-logo";
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
        alt=""
        className="z-0 object-cover object-[center_50%]"
        fill
        preload
        sizes="100vw"
        src="/images/welcome-bg2.png"
      />
{/* 
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-black/10"
      /> */}

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:px-14 lg:py-10">
        {/* <header className="flex items-center justify-between">
          <p
            className="text-2xl font-medium tracking-[-0.07em] text-white sm:text-3xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            DexLabz
          </p>
          <span className="rounded-full border border-white/35 bg-white/15 px-4 py-2 mt-2 md:mt-0 text-xs  backdrop-blur-md">
            Registration complete
          </span>
        </header> */}

        <section className="welcome-content mx-auto flex min-h-screen w-[min(88vw,620px)] flex-col items-center justify-center py-8 text-center text-[#ffffff] sm:py-10 md:py-12">
          {/* <BrandLogo className="welcome-page-logo mb-2" size="mobile" /> */}
            <Image
  src="/images/dexlabz-logo1.png"
  alt="DexLabz Logo"
  width={128}
  height={128}
  className="mb-12 h-auto w-32"
/>

          {/* <div className="inline-flex items-center gap-2 rounded-full border border-[#2948af]/20 bg-white/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
            <CheckIcon />
            Access verified
          </div> */}

          <h1 className="welcome-title mt-2 text-4xl  capitalize leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            Thank You, {user.name}
            <br />
            {/* {user.name} */}
          </h1>

          <p className="welcome-copy mt-5 max-w-lg text-sm leading-6 text-[#ffffff]/85 sm:text-base sm:leading-7">
            Your registration is complete and your invitation has been
            securely verified. We’re delighted to have you joining DexLabz.
          </p>

          <p className="welcome-email mt-3 max-w-md text-xs  text-[#ffffff] sm:text-sm">
            Keep an eye on {user.email} {""}
            for what comes next.
          </p>

          <div className="welcome-actions mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <form action="/api/auth/logout" method="post">
              <button
                className="inline-flex h-11 items-center rounded-full border border-white/35 bg-white/10 px-7 text-sm  text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                type="submit"
              >
                Sign out
              </button>
            </form>

            <a
              className="inline-flex h-11 items-center rounded-full border border-white/35 bg-white/10 px-7 text-sm  text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              href="mailto:amannegi2314@gmail.com"
            >
              Contact
            </a>
          </div>
        </section>

        {/* <footer className="flex items-center justify-between text-xs text-white/65">
          <p>© 2026 DexLabz</p>
         
        </footer> */}
      </div>
    </main>
  );
}
