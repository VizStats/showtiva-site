import type { Metadata } from "next";
import Link from "next/link";

import InfoShell, { CONTAINER } from "../_site/InfoShell";

// The footer copy comes from the site store, read per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Creators",
  description:
    "ShowTiva Creators: an invite-only studio programme for animators, storytellers, short-form creators and documentary makers making family-safe shows.",
};

/* ------------------------------------------------------------------ copy -- */

const LOOKING_FOR = [
  {
    title: "Animators",
    body: "Hand-drawn and 2D animation above all, plus stop-motion and stylised 3D, with characters kids remember and parents enjoy too.",
    formats: ["Series", "Specials", "Shorts"],
    icon: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />,
  },
  {
    title: "Storytellers & writers",
    body: "Original series and films with heart: adventure, comedy, fantasy and drama told for the whole family.",
    formats: ["Series", "Films", "Mini-series"],
    icon: (
      <>
        <path d="M4 19.5V5a2 2 0 0 1 2-2h12v14H6a2 2 0 0 0-2 2.5z" />
        <path d="M6 17h12v4H6a2 2 0 0 1 0-4z" />
      </>
    ),
  },
  {
    title: "Short-form creators",
    body: "Vertical pieces under a minute or two that stop the scroll for the right reasons: sketches, crafts, science, music.",
    formats: ["Shorts"],
    icon: (
      <>
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
        <path d="M11 9.5v5l4-2.5z" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    title: "Documentary makers",
    body: "Nature and wildlife, history, biography, sport and social issues, made clear and honest for curious young minds.",
    formats: ["Documentaries", "Docuseries"],
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
  },
  {
    title: "Educators & explainers",
    body: "People who make learning feel like play: maths, languages, coding, how things work, for kids and the adults beside them.",
    formats: ["Series", "Shorts"],
    icon: (
      <>
        <path d="M2 9l10-5 10 5-10 5z" />
        <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      </>
    ),
  },
  {
    title: "Music & performance",
    body: "Sing-alongs, dance, puppetry and live performance filmed with care and made to be watched together.",
    formats: ["Specials", "Shorts"],
    icon: (
      <>
        <path d="M9 18V5l11-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
      </>
    ),
  },
];

const STANDARDS = [
  {
    title: "Family-safe, always",
    body: "Everything sits at or below PG-13 / TV-14. No graphic horror, gratuitous violence, crude humour or adult themes played for shock.",
  },
  {
    title: "Original and yours",
    body: "You own the work or hold every right to it, including music, footage and the people on screen.",
  },
  {
    title: "Made with craft",
    body: "Clear sound, considered edits and a story that respects its audience. Budget matters less than care.",
  },
  {
    title: "Kind by default",
    body: "How you treat collaborators and your community matters as much as what you make. We work with people we trust.",
  },
];

const STEPS = [
  {
    title: "Request an invite",
    body: "Tell us who you are, what you make and where we can see it. A reel, a channel or a single finished piece is enough.",
  },
  {
    title: "Vetting",
    body: "Our team reviews your portfolio against the ShowTiva standard and checks identity and rights. Access is exclusive for a reason.",
  },
  {
    title: "Pilot with the studio",
    body: "Accepted creators develop a pilot or first set of Shorts with a ShowTiva producer, with notes on story, safety and delivery.",
  },
  {
    title: "Launch",
    body: "Your work goes live in the catalog or Shorts, with a place in the rows and banner when it is ready to be featured.",
  },
];

const BENEFITS = [
  "A producer from the ShowTiva studio beside you from pilot to launch.",
  "An audience of families who came looking for exactly this kind of show.",
  "Promotion in Shorts, the home banner and curated rows.",
  "Clear agreements, fair pay for your work, and ownership that stays with you.",
  "Feedback on story, pacing and age-suitability from people who do it every day.",
  "A community of creators who share your standards.",
];

const FAQ = [
  {
    q: "Do I need an invitation?",
    a: "Yes. The programme is invite-only, but requesting an invite is open to anyone. We send invitations to creators whose work fits after reviewing their request.",
  },
  {
    q: "Can I apply with work I have already published elsewhere?",
    a: "Yes, published work is the best way to show us what you make. Anything you bring to ShowTiva itself needs to meet our standard and be yours to license.",
  },
  {
    q: "What will not be accepted?",
    a: "Anything above PG-13 / TV-14: graphic violence or horror, sexual content, hateful material, dangerous stunts kids might copy, or work you do not hold the rights to.",
  },
  {
    q: "Do I need a studio or a big budget?",
    a: "No. A solo animator with a laptop is as welcome as a full studio. What we look for is craft, originality and a story worth telling.",
  },
  {
    q: "How long does vetting take?",
    a: "It depends on how many requests we have, and we review each one properly. We will tell you either way.",
  },
];

/* ------------------------------------------------------------------ page -- */

const EYEBROW = "text-[0.7rem] font-semibold tracking-[0.24em] text-[#ff3040] uppercase";
const H2 = "mt-3 font-heading text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.05] font-light tracking-[-0.03em] text-balance";
const PRIMARY =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ff3040] px-7 text-[0.88rem] font-semibold text-white shadow-[0_12px_32px_rgba(255,48,64,0.35)] transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[#ff4757] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const SECONDARY =
  "inline-flex h-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.06)] px-7 text-[0.88rem] font-semibold text-ink backdrop-blur-[14px] transition-[background-color] duration-200 hover:bg-[rgba(255,255,255,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export default function CreatorsPage() {
  return (
    <InfoShell>
      {/* ---- hero ---- */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[image:radial-gradient(50%_70%_at_15%_10%,rgba(255,48,64,0.18),transparent_70%),radial-gradient(40%_60%_at_90%_60%,rgba(255,255,225,0.06),transparent_70%)]"
          aria-hidden="true"
        />
        <div className={`${CONTAINER} relative grid items-center gap-[clamp(2.5rem,6vw,5rem)] py-[clamp(3rem,8vw,6.5rem)] min-[1024px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]`}>
          <div>
            <p className={EYEBROW}>ShowTiva Creators</p>
            <h1 className="mt-4 font-heading text-[clamp(2.7rem,6.4vw,5.4rem)] leading-[0.98] font-light tracking-[-0.04em] text-balance">
              Make the shows families <span className="font-semibold text-[#ff3040]">trust</span>.
            </h1>
            <p className="mt-6 max-w-[54ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.75] text-[rgba(255,255,225,0.74)]">
              ShowTiva Creators is our invite-only studio programme. We partner with animators, storytellers and filmmakers to produce
              original, family-safe shows, and every creator is vetted before they join.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className={PRIMARY}>
                Request an invite
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <a href="#how-it-works" className={SECONDARY}>
                How it works
              </a>
            </div>
          </div>

          {/* Three creator clips, staggered like a contact sheet. */}
          <div className="grid grid-cols-3 items-center gap-[clamp(0.6rem,1.4vw,1rem)]" aria-hidden="true">
            {["/creator_video_1.mp4", "/creator_video_4.mp4", "/creator_video_2.mp4"].map((src, i) => (
              <div
                key={src}
                className={`relative aspect-[9/16] overflow-hidden rounded-[clamp(1rem,2vw,1.5rem)] border border-[rgba(255,255,255,0.1)] bg-[#111] shadow-[0_30px_60px_rgba(0,0,0,0.55)] ${i === 1 ? "min-[1024px]:-translate-y-8" : "min-[1024px]:translate-y-6"}`}
              >
                <video className="absolute inset-0 h-full w-full object-cover" src={src} autoPlay muted loop playsInline preload="metadata" />
                <div className="absolute inset-0 bg-[image:linear-gradient(to_top,rgba(0,0,0,0.45),transparent_45%)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- who we are looking for ---- */}
      <section className={`${CONTAINER} py-[clamp(3.5rem,7vw,6rem)]`} aria-labelledby="looking-for">
        <p className={EYEBROW}>Who we are looking for</p>
        <h2 id="looking-for" className={`${H2} max-w-[20ch]`}>
          Creators who make time together feel well spent.
        </h2>

        <ul className="mt-[clamp(2rem,4vw,3rem)] grid list-none gap-4 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3">
          {LOOKING_FOR.map((item) => (
            <li
              key={item.title}
              className="group flex flex-col rounded-3xl border border-[rgba(255,255,225,0.08)] bg-[linear-gradient(160deg,rgba(255,255,225,0.06),rgba(255,255,225,0.015))] p-[clamp(1.4rem,2.5vw,2rem)] transition-[border-color,background-color] duration-300 hover:border-[rgba(255,48,64,0.35)]"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-[rgba(255,48,64,0.12)] text-[#ff3040]">
                <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {item.icon}
                </svg>
              </span>
              <h3 className="mt-5 font-heading text-[1.3rem] font-medium tracking-[-0.01em]">{item.title}</h3>
              <p className="mt-2 flex-1 text-[0.95rem] leading-[1.7] text-[rgba(255,255,225,0.68)]">{item.body}</p>
              <ul className="mt-5 flex list-none flex-wrap gap-1.5">
                {item.formats.map((format) => (
                  <li key={format} className="rounded-full bg-[rgba(255,255,225,0.07)] px-2.5 py-1 text-[0.7rem] font-semibold text-[rgba(255,255,225,0.75)]">
                    {format}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- standard ---- */}
      <section className="border-y border-[rgba(255,255,225,0.07)] bg-[rgba(255,255,225,0.02)]">
        <div className={`${CONTAINER} grid gap-[clamp(2rem,5vw,5rem)] py-[clamp(3.5rem,7vw,6rem)] min-[1024px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]`}>
          <div>
            <p className={EYEBROW}>The ShowTiva standard</p>
            <h2 className={H2}>What every show on ShowTiva has in common.</h2>
            <p className="mt-5 max-w-[46ch] text-[1rem] leading-[1.75] text-[rgba(255,255,225,0.66)]">
              Parents choose ShowTiva because they do not have to check every title first. Creators keep that promise with us.
            </p>
          </div>
          <dl className="grid gap-x-10 gap-y-8 min-[640px]:grid-cols-2">
            {STANDARDS.map((item) => (
              <div key={item.title} className="border-t border-[rgba(255,255,225,0.12)] pt-5">
                <dt className="flex items-center gap-2.5 font-heading text-[1.15rem] font-medium">
                  <span className="size-2 rounded-full bg-[#ff3040]" aria-hidden="true" />
                  {item.title}
                </dt>
                <dd className="mt-2 text-[0.95rem] leading-[1.7] text-[rgba(255,255,225,0.68)]">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- how it works: a real sequence, so it is numbered ---- */}
      <section id="how-it-works" className={`${CONTAINER} scroll-mt-24 py-[clamp(3.5rem,7vw,6rem)]`} aria-labelledby="how-heading">
        <p className={EYEBROW}>How it works</p>
        <h2 id="how-heading" className={`${H2} max-w-[18ch]`}>
          From first request to your show going live.
        </h2>
        <ol className="mt-[clamp(2rem,4vw,3.25rem)] grid list-none gap-4 min-[768px]:grid-cols-2 min-[1200px]:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative rounded-3xl border border-[rgba(255,255,225,0.08)] bg-[rgba(255,255,225,0.03)] p-[clamp(1.4rem,2.5vw,1.9rem)]">
              <span className="font-heading text-[2.6rem] leading-none font-light text-[rgba(255,255,225,0.22)] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-heading text-[1.2rem] font-medium">{step.title}</h3>
              <p className="mt-2 text-[0.93rem] leading-[1.7] text-[rgba(255,255,225,0.68)]">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---- what you get + faq ---- */}
      <section className={`${CONTAINER} grid gap-[clamp(2.5rem,6vw,6rem)] pb-[clamp(3.5rem,7vw,6rem)] min-[1024px]:grid-cols-2`}>
        <div>
          <p className={EYEBROW}>What you get</p>
          <h2 className={H2}>A studio in your corner.</h2>
          <ul className="mt-8 flex list-none flex-col gap-4">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex gap-3.5 text-[1rem] leading-[1.65] text-[rgba(255,255,225,0.82)]">
                <span className="mt-0.5 grid size-6 flex-none place-items-center rounded-full bg-[rgba(255,48,64,0.14)] text-[#ff3040]">
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={EYEBROW}>Questions</p>
          <h2 className={H2}>Before you apply.</h2>
          <div className="mt-8 flex flex-col gap-2.5">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-[rgba(255,255,225,0.09)] bg-[rgba(255,255,225,0.03)] open:bg-[rgba(255,255,225,0.05)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading text-[1.02rem] font-medium [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="grid size-7 flex-none place-items-center rounded-full bg-[rgba(255,255,225,0.08)] transition-transform duration-200 group-open:rotate-45">
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="px-5 pb-5 text-[0.95rem] leading-[1.7] text-[rgba(255,255,225,0.7)]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---- closing call ---- */}
      <section className={`${CONTAINER} pb-[clamp(4rem,8vw,7rem)]`}>
        <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.1)] bg-[#0d0d0d] px-[clamp(1.5rem,5vw,4.5rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
          <div className="pointer-events-none absolute -top-1/2 -right-1/4 size-[36rem] rounded-full bg-[rgba(255,48,64,0.22)] blur-[120px]" aria-hidden="true" />
          <div className="relative flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-[40ch]">
              <h2 className="font-heading text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.05] font-light tracking-[-0.03em]">Have a story families should see?</h2>
              <p className="mt-4 text-[1rem] leading-[1.7] text-[rgba(255,255,225,0.72)]">
                Request an invite and show us what you make. The creator section of our{" "}
                <Link href="/terms#creators" className="font-semibold text-ink underline decoration-[rgba(255,48,64,0.7)] decoration-2 underline-offset-4">
                  Terms of Use
                </Link>{" "}
                explains how your work is licensed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className={PRIMARY}>
                Request an invite
              </Link>
              <Link href="/?role=creator" className={SECONDARY}>
                Preview the creator studio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </InfoShell>
  );
}
