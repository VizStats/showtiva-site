"use client";

// Layout for the legal pages: a switcher between the four documents, the
// title with its date, a plain-language summary, then the document with a
// sticky index that follows your place in it.

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

import { cx } from "@/lib/cx";
import { LEGAL_NAV, type LegalBlock, type LegalDoc } from "@/lib/legal";

const CONTAINER = "mx-auto w-full max-w-[1480px] px-12 max-[768px]:px-5";

/** `[label](/href)` inside copy becomes a link; everything else is text. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (!match) return <Fragment key={i}>{part}</Fragment>;
        return (
          <Link
            key={i}
            href={match[2]}
            className="font-semibold text-ink underline decoration-[rgba(255,48,64,0.7)] decoration-2 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-[#ff3040]"
          >
            {match[1]}
          </Link>
        );
      })}
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="max-w-[68ch] text-[1rem] leading-[1.85] text-[#c9c9bf]">
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="flex max-w-[68ch] list-none flex-col gap-2.5">
          {block.items.map((item) => (
            <li key={item} className="relative pl-6 text-[1rem] leading-[1.75] text-[#c9c9bf] before:absolute before:top-[0.8em] before:left-0 before:h-[2px] before:w-3 before:rounded-full before:bg-[#ff3040] before:content-['']">
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <p className="max-w-[68ch] rounded-2xl border border-[rgba(255,255,225,0.1)] bg-[rgba(255,255,225,0.04)] px-5 py-4 text-[0.95rem] leading-[1.75] text-[rgba(255,255,225,0.8)]">
          <RichText text={block.text} />
        </p>
      );
    case "table":
      return (
        <div className="max-w-[78ch] overflow-x-auto rounded-2xl border border-[rgba(255,255,225,0.1)]">
          <table className="w-full min-w-[520px] border-collapse text-left text-[0.9rem]">
            <thead>
              <tr className="bg-[rgba(255,255,225,0.05)]">
                {block.head.map((h) => (
                  <th key={h} className="px-4 py-3 text-[0.68rem] font-semibold tracking-[0.14em] text-[rgba(255,255,225,0.6)] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-[rgba(255,255,225,0.08)] align-top">
                  {row.map((cell, i) => (
                    <td key={i} className={cx("px-4 py-3 leading-[1.6] text-[#c9c9bf]", i === 0 && "font-mono text-[0.82rem] whitespace-nowrap text-ink")}>
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function LegalDocument({ doc }: { doc: LegalDoc }) {
  const [activeId, setActiveId] = useState(doc.sections[0]?.id ?? "");

  // The index lights the section nearest the top of the reading area.
  useEffect(() => {
    const headings = doc.sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [doc.sections]);

  const words = doc.sections.flatMap((s) => s.blocks).reduce((n, b) => {
    const text = b.type === "list" ? b.items.join(" ") : b.type === "table" ? b.rows.flat().join(" ") : b.text;
    return n + text.split(/\s+/).length;
  }, 0);
  const minutes = Math.max(1, Math.round(words / 230));

  return (
    <div className="relative">
      {/* A faint red glow behind the title, the brand's one colour. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[image:radial-gradient(60%_80%_at_20%_0%,rgba(255,48,64,0.13),transparent_70%)]"
        aria-hidden="true"
      />

      <section className={cx(CONTAINER, "relative pt-[clamp(2rem,5vw,3.5rem)]")}>
        <nav aria-label="Legal documents" className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="inline-flex gap-0.5 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] p-1 backdrop-blur-[18px]">
            {LEGAL_NAV.map((item) => {
              const current = item.slug === doc.slug;
              return (
                <li key={item.slug}>
                  <Link
                    href={`/${item.slug}`}
                    aria-current={current ? "page" : undefined}
                    className={cx(
                      "inline-flex h-9 items-center rounded-full px-4 text-[0.78rem] font-semibold whitespace-nowrap transition-[background-color,color] duration-200 max-[480px]:h-8 max-[480px]:px-3 max-[480px]:text-[0.72rem]",
                      current ? "bg-[rgba(255,255,255,0.92)] text-black" : "text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mt-[clamp(2.25rem,5vw,3.5rem)] text-[0.7rem] font-semibold tracking-[0.24em] text-[#ff3040] uppercase">{doc.eyebrow}</p>
        <h1 className="mt-3 max-w-[18ch] font-heading text-[clamp(2.4rem,5.5vw,4.4rem)] leading-[1] font-light tracking-[-0.035em] text-balance">{doc.title}</h1>
        <p className="mt-5 max-w-[60ch] text-[1.05rem] leading-[1.7] text-[rgba(255,255,225,0.7)]">{doc.description}</p>
        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-[rgba(255,255,225,0.5)] tabular-nums">
          <span>Last updated {doc.updated}</span>
          <span className="size-1 rounded-full bg-[rgba(255,255,225,0.3)]" aria-hidden="true" />
          <span>{minutes} min read</span>
        </p>

        {doc.summary.length > 0 && (
          <div className="mt-[clamp(2rem,4vw,3rem)] rounded-3xl border border-[rgba(255,255,225,0.1)] bg-[linear-gradient(135deg,rgba(255,255,225,0.07),rgba(255,255,225,0.02))] p-[clamp(1.25rem,3vw,2.25rem)]">
            <h2 className="font-heading text-[1.25rem] font-medium tracking-[-0.01em]">The short version</h2>
            <ul className="mt-5 grid list-none gap-x-10 gap-y-4 min-[900px]:grid-cols-2">
              {doc.summary.map((point) => (
                <li key={point} className="flex gap-3 text-[0.95rem] leading-[1.65] text-[rgba(255,255,225,0.82)]">
                  <svg className="mt-[3px] size-[18px] flex-none text-[#ff3040]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  <span>
                    <RichText text={point} />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.78rem] text-[rgba(255,255,225,0.5)]">The summary helps you find your way; the full text below is what applies.</p>
          </div>
        )}
      </section>

      <section className={cx(CONTAINER, "relative grid gap-x-[clamp(3rem,6vw,6rem)] pt-[clamp(2.5rem,5vw,4rem)] pb-[clamp(5rem,9vw,8rem)] min-[1024px]:grid-cols-[16rem_minmax(0,1fr)]")}>
        {/* Index: sticky beside the text on a wide screen, folded above it on a narrow one. */}
        <aside className="max-[1023px]:mb-10">
          <details className="group rounded-2xl border border-[rgba(255,255,225,0.1)] bg-[rgba(255,255,225,0.03)] min-[1024px]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-[0.85rem] font-semibold [&::-webkit-details-marker]:hidden">
              On this page
              <svg className="size-4 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <ol className="list-none border-t border-[rgba(255,255,225,0.08)] px-2 py-2">
              {doc.sections.map((section, i) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="flex gap-3 rounded-lg px-2 py-2 text-[0.85rem] text-[rgba(255,255,225,0.75)] hover:bg-[rgba(255,255,225,0.06)] hover:text-ink">
                    <span className="w-5 flex-none text-[rgba(255,255,225,0.4)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          <nav aria-label="On this page" className="sticky top-[96px] hidden min-[1024px]:block">
            <p className="mb-4 text-[0.68rem] font-semibold tracking-[0.2em] text-[rgba(255,255,225,0.45)] uppercase">On this page</p>
            <ol className="list-none border-l border-[rgba(255,255,225,0.1)]">
              {doc.sections.map((section, i) => {
                const active = section.id === activeId;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={active ? "location" : undefined}
                      className={cx(
                        "-ml-px flex gap-3 border-l-2 py-[7px] pl-4 text-[0.84rem] leading-snug transition-[color,border-color] duration-200",
                        active ? "border-[#ff3040] text-ink" : "border-transparent text-[rgba(255,255,225,0.55)] hover:text-ink",
                      )}
                    >
                      <span className={cx("w-5 flex-none tabular-nums", active ? "text-[#ff3040]" : "text-[rgba(255,255,225,0.35)]")}>{String(i + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0">
          {doc.sections.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-[96px] border-t border-[rgba(255,255,225,0.08)] py-[clamp(2rem,4vw,2.75rem)] first:border-t-0 first:pt-0"
            >
              <h2 className="flex items-baseline gap-4 font-heading text-[clamp(1.35rem,2.2vw,1.7rem)] leading-tight font-normal tracking-[-0.015em]">
                <span className="text-[0.95rem] font-medium text-[#ff3040] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>
              <div className="mt-5 flex flex-col gap-5">
                {section.blocks.map((block, j) => (
                  <Block key={j} block={block} />
                ))}
              </div>
            </section>
          ))}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-[rgba(255,255,225,0.1)] bg-[rgba(255,255,225,0.04)] p-[clamp(1.25rem,3vw,2rem)]">
            <div>
              <p className="font-heading text-[1.2rem] font-medium">Still have a question?</p>
              <p className="mt-1 text-[0.9rem] text-[rgba(255,255,225,0.65)]">Tell us what you need and we will point you the right way.</p>
            </div>
            <Link href="/contact" className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-[0.85rem] font-semibold text-black transition-[background-color] duration-200 hover:bg-[#ececcf]">
              Contact us
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
