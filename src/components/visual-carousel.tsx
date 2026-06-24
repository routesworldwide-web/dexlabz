"use client";

import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";

const slides = [
  {
    image: "/images/dexlabz-dunes.png",
    gradient:
      "from-[#271052] via-[#5f3f96] to-[#12091f]",
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
    gradient:
      "from-[#102b55] via-[#5950a3] to-[#170d2c]",
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
    gradient:
      "from-[#17223f] via-[#4c5f93] to-[#110a22]",
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
      className="relative hidden min-h-0 overflow-hidden lg:block"
    >
      {slides.map((slide, index) => (
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-opacity duration-1000 ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
          key={`gradient-${slide.image}`}
        />
      ))}
<div
  aria-hidden="true"
  className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(255,255,255,0.5),transparent_36%),radial-gradient(circle_at_72%_24%,rgba(125,211,252,0.14),transparent_24%),radial-gradient(circle_at_50%_82%,rgba(37,99,235,0.12),transparent_40%)]"
/>
      {/* {slides.map((slide, index) => (
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
            preload={index === 0}
            sizes="(min-width: 1024px) 55vw, 100vw"
            src={slide.image}
          />
        </div>
      ))} */}

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-black/5 to-[#100b20]/85"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03)_42%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-[linear-gradient(115deg,rgba(16,11,32,0.22),transparent_45%)]"
      />

      <div className="absolute inset-0 z-10 flex flex-col p-8 xl:p-10">
        <BrandLogo className="carousel-logo absolute left-4 top-10 xl:left-5 xl:top-12" />

        <div className="mt-auto max-w-xl pb-5">
          <div aria-live="polite" className="min-h-[200px]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
              {slides[activeSlide].eyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-medium leading-[1.08] tracking-[-0.04em] text-white xl:text-[2.75rem]">
              {slides[activeSlide].title}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/70">
              {slides[activeSlide].description}
            </p>
          </div>

          <div
            aria-label={`Slide ${activeSlide + 1} of ${slides.length}`}
            className="mt-6 flex items-center gap-2"
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
