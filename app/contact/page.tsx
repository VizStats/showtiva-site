import type { Metadata } from "next";
import Link from "next/link";

import { getChrome } from "@/lib/site";
import InfoShell, { CONTAINER } from "../_site/InfoShell";

// Socials and footer copy come from the site store, read per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Find the right place for your question about ShowTiva: your account, creating with us, press or privacy.",
};

const EYEBROW = "text-[0.7rem] font-semibold tracking-[0.24em] text-[#ff3040] uppercase";

// Each topic points at the page that already answers it. There is no inbox
// behind this site yet, so there is no form to send into nowhere.
const TOPICS = [
  {
    title: "Your account",
    body: "Signing in, creating an account, or your saved list.",
    href: "/signin",
    cta: "Go to sign in",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  },
  {
    title: "Creating with ShowTiva",
    body: "Who we work with, what we look for and how to request an invite.",
    href: "/creators",
    cta: "Visit Creators",
    icon: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />,
  },
  {
    title: "Press & partners",
    body: "Logos, colours and a description of ShowTiva for your story.",
    href: "/press",
    cta: "Open the press kit",
    icon: (
      <>
        <path d="M4 5h13v14H6a2 2 0 0 1-2-2z" />
        <path d="M17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5" />
      </>
    ),
  },
  {
    title: "Privacy & your data",
    body: "What we collect, your rights, and the storage ShowTiva uses.",
    href: "/privacy",
    cta: "Read the policy",
    icon: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
  {
    title: "Content & safety",
    body: "Our family-safe standard and what is and is not allowed on ShowTiva.",
    href: "/terms#content",
    cta: "See the standard",
    icon: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  },
  {
    title: "Something else",
    body: "Say hello or ask us anything on the platforms below.",
    href: "#social",
    cta: "Find us on social",
    icon: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z" />,
  },
];

export default async function ContactPage() {
  const { footer } = await getChrome();

  return (
    <InfoShell>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[image:radial-gradient(50%_70%_at_15%_0%,rgba(255,48,64,0.15),transparent_70%)]" aria-hidden="true" />
        <div className={`${CONTAINER} relative py-[clamp(3.5rem,8vw,6.5rem)]`}>
          <p className={EYEBROW}>Contact</p>
          <h1 className="mt-4 max-w-[16ch] font-heading text-[clamp(2.5rem,6vw,4.8rem)] leading-[1] font-light tracking-[-0.04em] text-balance">
            How can we help?
          </h1>
          <p className="mt-6 max-w-[54ch] text-[1.05rem] leading-[1.75] text-[rgba(255,255,225,0.72)]">Pick the topic closest to your question and we will take you straight to it.</p>
        </div>
      </section>

      <section className={`${CONTAINER} pb-[clamp(3rem,6vw,5rem)]`}>
        <ul className="grid list-none gap-4 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3">
          {TOPICS.map((topic) => (
            <li key={topic.title}>
              <Link
                href={topic.href}
                className="group flex h-full flex-col rounded-3xl border border-[rgba(255,255,225,0.08)] bg-[linear-gradient(160deg,rgba(255,255,225,0.06),rgba(255,255,225,0.015))] p-[clamp(1.4rem,2.5vw,1.9rem)] transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[rgba(255,48,64,0.4)]"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-[rgba(255,48,64,0.12)] text-[#ff3040]">
                  <svg className="size-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {topic.icon}
                  </svg>
                </span>
                <span className="mt-5 font-heading text-[1.25rem] font-medium tracking-[-0.01em]">{topic.title}</span>
                <span className="mt-2 flex-1 text-[0.95rem] leading-[1.65] text-[rgba(255,255,225,0.66)]">{topic.body}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-ink">
                  {topic.cta}
                  <svg className="size-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="social" className={`${CONTAINER} scroll-mt-24 pb-[clamp(4rem,8vw,7rem)]`}>
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-[rgba(255,255,255,0.1)] bg-[#0d0d0d] px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2rem,5vw,3rem)]">
          <div>
            <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] font-light tracking-[-0.03em]">Find ShowTiva on social</h2>
            <p className="mt-2 text-[0.95rem] text-[rgba(255,255,225,0.66)]">News, new titles and behind-the-scenes from the studio.</p>
          </div>
          <ul className="flex list-none flex-wrap gap-2.5">
            {footer.socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] px-5 text-[0.85rem] font-semibold transition-[background-color,border-color] duration-200 hover:border-[#ff3040] hover:bg-[#ff3040]"
                >
                  {social.label.replace(/^ShowTiva on /, "")}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </InfoShell>
  );
}
