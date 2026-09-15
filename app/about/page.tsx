import type { Metadata } from "next";
import Link from "next/link";

import { getAllMovies, getSections } from "@/lib/content";
import { SHORTS_SECTION_ID } from "@/lib/content-types";
import InfoShell, { CONTAINER } from "../_site/InfoShell";

// Catalog figures and footer copy come from the stores, read per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description: "ShowTiva is a streaming home for family stories: every title vetted, nothing to double-check before you press play.",
};

const EYEBROW = "text-[0.7rem] font-semibold tracking-[0.24em] text-[#ff3040] uppercase";

const PRINCIPLES = [
  {
    title: "Vetted, not filtered",
    body: "People choose what goes on ShowTiva. Films stay at or below PG-13 and series at or below TV-14, well reviewed by audiences, with horror and graphic violence left out.",
  },
  {
    title: "No ads, no tracking",
    body: "Nothing interrupts a story and nobody profiles what your family watches. See our [Ad Choices](/ad-choices).",
  },
  {
    title: "Made with creators",
    body: "Our studio works directly with animators, storytellers and filmmakers on original shows. See [Creators](/creators).",
  },
];

function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    return m ? (
      <Link key={i} href={m[2]} className="font-semibold text-ink underline decoration-[rgba(255,48,64,0.7)] decoration-2 underline-offset-4">
        {m[1]}
      </Link>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

export default async function AboutPage() {
  const [movies, sections] = await Promise.all([getAllMovies(), getSections()]);
  const series = movies.filter((m) => (m.seasons?.length ?? 0) > 0);
  const episodes = series.reduce((n, m) => n + (m.seasons ?? []).reduce((k, s) => k + s.episodes.length, 0), 0);
  const rows = sections.filter((s) => s.id !== SHORTS_SECTION_ID);

  // Real counts from the catalog, not marketing numbers.
  const figures = [
    { value: movies.length, label: "titles in the catalog" },
    { value: series.length, label: "series" },
    { value: episodes, label: "episodes" },
    { value: rows.length, label: "curated rows" },
  ];

  return (
    <InfoShell>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[image:radial-gradient(55%_75%_at_80%_0%,rgba(255,48,64,0.16),transparent_70%)]" aria-hidden="true" />
        <div className={`${CONTAINER} relative py-[clamp(3.5rem,9vw,7rem)]`}>
          <p className={EYEBROW}>About ShowTiva</p>
          <h1 className="mt-4 max-w-[16ch] font-heading text-[clamp(2.7rem,6.4vw,5.4rem)] leading-[0.98] font-light tracking-[-0.04em] text-balance">
            Stories the whole family can press play on.
          </h1>
          <p className="mt-7 max-w-[62ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.8] text-[rgba(255,255,225,0.74)]">
            ShowTiva started with a simple frustration: finding something everyone could watch took longer than watching it. So we built a
            streaming home where every film, series, documentary and Short has already been chosen with families in mind.
          </p>

          <dl className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-[rgba(255,255,225,0.08)] bg-[rgba(255,255,225,0.08)] min-[900px]:grid-cols-4">
            {figures.map((f) => (
              <div key={f.label} className="bg-black px-[clamp(1.1rem,2.5vw,2rem)] py-[clamp(1.25rem,3vw,2rem)]">
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-heading text-[clamp(2.2rem,4.5vw,3.4rem)] leading-none font-light tracking-[-0.03em] tabular-nums">{f.value}</span>
                  <span className="mt-2 block text-[0.85rem] text-[rgba(255,255,225,0.6)]">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={`${CONTAINER} grid gap-4 pb-[clamp(3.5rem,7vw,6rem)] min-[900px]:grid-cols-3`}>
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="rounded-3xl border border-[rgba(255,255,225,0.08)] bg-[linear-gradient(160deg,rgba(255,255,225,0.06),rgba(255,255,225,0.015))] p-[clamp(1.4rem,2.5vw,2rem)]">
            <span className="block h-[3px] w-10 rounded-full bg-[#ff3040]" aria-hidden="true" />
            <h2 className="mt-5 font-heading text-[1.35rem] font-medium tracking-[-0.01em]">{p.title}</h2>
            <p className="mt-2.5 text-[0.97rem] leading-[1.75] text-[rgba(255,255,225,0.7)]">
              <Rich text={p.body} />
            </p>
          </div>
        ))}
      </section>

      <section className={`${CONTAINER} pb-[clamp(4rem,8vw,7rem)]`}>
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-[rgba(255,255,255,0.1)] bg-[#0d0d0d] px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2rem,5vw,3.5rem)]">
          <h2 className="max-w-[22ch] font-heading text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.08] font-light tracking-[-0.03em]">Find tonight&rsquo;s show in a minute, not an hour.</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/watch" className="inline-flex h-12 items-center rounded-full bg-[#ff3040] px-7 text-[0.88rem] font-semibold text-white transition-[background-color] duration-200 hover:bg-[#ff4757]">
              Start watching
            </Link>
            <Link href="/contact" className="inline-flex h-12 items-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.06)] px-7 text-[0.88rem] font-semibold text-ink transition-[background-color] duration-200 hover:bg-[rgba(255,255,255,0.14)]">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </InfoShell>
  );
}
