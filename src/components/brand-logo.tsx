import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  size?: "mobile" | "desktop";
};

const bubbles = [
  "dexlabz-brand-logo__bubble--one",
  "dexlabz-brand-logo__bubble--two",
  "dexlabz-brand-logo__bubble--three",
  "dexlabz-brand-logo__bubble--four",
];

export function BrandLogo({
  className = "",
  size = "desktop",
}: BrandLogoProps) {
  return (
    <div
      aria-label="DexLabz"
      className={`dexlabz-brand-logo dexlabz-brand-logo--${size} ${className}`}
    >
      <div aria-hidden="true" className="dexlabz-brand-logo__bubbles">
        {bubbles.map((bubble) => (
          <span className={`dexlabz-brand-logo__bubble ${bubble}`} key={bubble} />
        ))}
      </div>

      <div className="dexlabz-brand-logo__crop">
        <Image
          alt=""
          className="dexlabz-brand-logo__image"
          height={807}
          src="/images/dexlabz-logo-clean.png"
          width={430}
        />
      </div>
    </div>
  );
}
