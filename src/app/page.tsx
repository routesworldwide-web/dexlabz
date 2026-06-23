import Image from "next/image";

import { RegistrationForm } from "@/components/registration-form";
import { VisualCarousel } from "@/components/visual-carousel";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f1f7] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1440px] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_100px_-40px_rgba(30,20,55,0.35)] sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <VisualCarousel />

        <section
          aria-labelledby="registration-heading"
          className="flex items-center justify-center px-5 py-10 sm:px-10 sm:py-12 lg:px-14 xl:px-20"
        >
          <div className="w-full max-w-[520px]">
            <div className="mb-7 flex items-center sm:mb-8">
              <Image
                alt="DexLabz"
                className="h-20 w-auto object-contain sm:h-24"
                height={96}
                priority
                src="/images/dexlabzlogo.png"
                width={52}
              />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
              Private registration
            </p>
            <h1
              className="mt-4 text-3xl font-medium tracking-[-0.035em] text-slate-950 sm:text-4xl"
              id="registration-heading"
            >
              Claim your access
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              Enter your details and the one-time authentication code.
            </p>

            <RegistrationForm />
          </div>
        </section>
      </div>
    </main>
  );
}
