import type { Metadata } from "next";
import Link from "next/link";

import InfoShell, { CONTAINER } from "../_site/InfoShell";

// The footer copy comes from the site store, read per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Press Kit",
  description: "ShowTiva logos, colours and a short description for press and partners.",
};

const EYEBROW = "text-[0.7rem] font-semibold tracking-[0.24em] text-[#ff3040] uppercase";

const COLOURS = [
  { name: "ShowTiva Red", hex: "#FF3040", swatch: "bg-[#ff3040]", ink: "text-white" },
  { name: "Cream", hex: "#FFFFE1", swatch: "bg-[#ffffe1]", ink: "text-black" },
  { name: "Night", hex: "#000000", swatch: "bg-black border border-[rgba(255,255,225,0.14)]", ink: "text-ink" },
];

const ASSETS = [
  { label: "Logo mark", file: "/logo-mark.png", name: "showtiva-logo-mark.png", height: "h-16" },
  { label: "Wordmark", file: "/logo-wordmark.png", name: "showtiva-wordmark.png", height: "h-9" },
];

const BOILERPLATE =
  "ShowTiva is a family streaming service where every title is chosen to be safe to watch together. Its catalog spans films, series, animation, documentaries and Shorts, and its creator studio partners with animators and storytellers on original family shows.";

export default function PressPage() {
  return (
    <InfoShell>
      <section className={`${CONTAINER} py-[clamp(3.5rem,8vw,6.5rem)]`}>
        <p className={EYEBROW}>Press kit</p>
        <h1 className="mt-4 max-w-[18ch] font-heading text-[clamp(2.5rem,6vw,4.8rem)] leading-[1] font-light tracking-[-0.04em] text-balance">
          Everything you need to write about ShowTiva.
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.05rem] leading-[1.75] text-[rgba(255,255,225,0.72)]">
          Logos, colours and a short description. Please keep the logo on a dark background with room around it, and do not stretch,
          recolour or add effects to it.
        </p>
      </section>

      <section className={`${CONTAINER} grid gap-4 pb-[clamp(2.5rem,5vw,4rem)] min-[768px]:grid-cols-2`} aria-labelledby="logos">
        <h2 id="logos" className="sr-only">Logos</h2>
        {ASSETS.map((asset) => (
          <figure key={asset.file} className="overflow-hidden rounded-3xl border border-[rgba(255,255,225,0.08)]">
            <div className="grid h-[clamp(11rem,22vw,15rem)] place-items-center bg-[image:radial-gradient(circle_at_center,#1a1a1a,#050505)]">
              <img src={asset.file} alt={`ShowTiva ${asset.label.toLowerCase()}`} className={`${asset.height} w-auto`} />
            </div>
            <figcaption className="flex items-center justify-between gap-4 border-t border-[rgba(255,255,225,0.08)] px-5 py-4">
              <span>
                <span className="block font-heading text-[1.05rem] font-medium">{asset.label}</span>
                <span className="text-[0.8rem] text-[rgba(255,255,225,0.55)]">PNG, transparent background</span>
              </span>
              <a
                href={asset.file}
                download={asset.name}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[rgba(255,255,225,0.08)] px-4 text-[0.8rem] font-semibold transition-[background-color,color] duration-200 hover:bg-ink hover:text-black"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                </svg>
                Download
              </a>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className={`${CONTAINER} grid gap-[clamp(2rem,5vw,4rem)] pb-[clamp(4rem,8vw,7rem)] min-[1024px]:grid-cols-2`}>
        <div>
          <h2 className="font-heading text-[1.6rem] font-light tracking-[-0.02em]">Colours</h2>
          <ul className="mt-5 grid list-none grid-cols-3 gap-3">
            {COLOURS.map((c) => (
              <li key={c.hex} className="overflow-hidden rounded-2xl border border-[rgba(255,255,225,0.08)]">
                <div className={`grid h-24 items-end p-3 ${c.swatch} ${c.ink}`}>
                  <span className="font-mono text-[0.75rem] font-semibold">{c.hex}</span>
                </div>
                <p className="px-3 py-2.5 text-[0.82rem] text-[rgba(255,255,225,0.75)]">{c.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-[1.6rem] font-light tracking-[-0.02em]">About ShowTiva, in one paragraph</h2>
          <blockquote className="mt-5 rounded-2xl border-l-2 border-[#ff3040] bg-[rgba(255,255,225,0.04)] px-5 py-4 text-[1rem] leading-[1.75] text-[rgba(255,255,225,0.82)]">
            {BOILERPLATE}
          </blockquote>
          <p className="mt-6 text-[0.95rem] leading-[1.7] text-[rgba(255,255,225,0.66)]">
            Writing a story or need something else? Reach the team through the{" "}
            <Link href="/contact" className="font-semibold text-ink underline decoration-[rgba(255,48,64,0.7)] decoration-2 underline-offset-4">
              Contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </InfoShell>
  );
}
