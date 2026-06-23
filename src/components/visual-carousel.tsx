"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/dexlabz-dunes.png",
    alt: "Purple dunes beneath a twilight sky",
    eyebrow: "Invitation only",
    title: (
      <>
        Build what comes next.
        <br />
        Start from here.
      </>
    ),
    description:
      "A private gateway for the people joining the next chapter of DexLabz.",
  },
  {
    image: "/images/dexlabz-coast.png",
    alt: "Dark coastline beneath a violet evening sky",
    eyebrow: "Make an impact",
    title: (
      <>
        Ideas move further
        <br />
        with the right people.
      </>
    ),
    description:
      "Step into a space designed for focused work, bold thinking, and meaningful progress.",
  },
  {
    image: "/images/dexlabz-mountains.png",
    alt: "Misty mountain valley before dawn",
    eyebrow: "Begin the journey",
    title: (
      <>
        Every new horizon
        <br />
        begins with access.
      </>
    ),
    description:
      "Your invitation opens the door to the tools, people, and possibilities ahead.",
  },
];

const SLIDE_DURATION_MS = 6_000;

export function VisualCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      aria-label="DexLabz highlights"
      aria-roledescription="carousel"
      className="relative hidden min-h-[720px] overflow-hidden lg:block"
    >
      {slides.map((slide, index) => (
        <div
          aria-hidden={index !== activeSlide}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
          key={slide.image}
        >
          <Image
            alt={slide.alt}
            className="object-cover"
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 55vw, 0vw"
            src={slide.image}
          />
        </div>
      ))}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-[#100b20]/80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(36,21,76,0.08),transparent_45%)]"
      />

      <div className="absolute inset-0 flex flex-col p-10 xl:p-12">
        <p
          className="text-3xl font-medium tracking-[-0.08em] text-white"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          DexLabz
        </p>

        <div className="mt-auto max-w-xl pb-5">
          <div aria-live="polite" className="min-h-[230px]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
              {slides[activeSlide].eyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-medium leading-[1.08] tracking-[-0.04em] text-white xl:text-5xl">
              {slides[activeSlide].title}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/70">
              {slides[activeSlide].description}
            </p>
          </div>

          <div
            aria-label={`Slide ${activeSlide + 1} of ${slides.length}`}
            className="mt-8 flex items-center gap-2"
            role="group"
          >
            {slides.map((slide, index) => (
              <button
                aria-label={`Show slide ${index + 1}`}
                aria-pressed={index === activeSlide}
                className={`h-1 rounded-full transition-all ${
                  index === activeSlide
                    ? "w-10 bg-white"
                    : "w-7 bg-white/35 hover:bg-white/60"
                }`}
                key={slide.image}
                onClick={() => setActiveSlide(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
