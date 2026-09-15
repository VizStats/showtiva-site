import Link from "next/link";

import { getChrome } from "@/lib/site";
import SiteFooter from "../watch/SiteFooter";
import BackAngle from "./BackAngle";

/** The site's one content width: the catalog's 1480px with its gutters. */
export const CONTAINER = "mx-auto w-full max-w-[1480px] px-12 max-[768px]:px-5";

/**
 * Frame for the company and legal pages: the same header rhythm as the title
 * page (back angle, centred lockup) on a black frosted bar, the content, and
 * the site footer.
 */
export default async function InfoShell({ children }: { children: React.ReactNode }) {
  const chrome = await getChrome();

  return (
    <div className="flex min-h-dvh flex-col bg-black font-body text-ink antialiased">
      <header className="sticky top-0 z-40 border-b border-[rgba(255,255,225,0.07)] bg-[rgba(0,0,0,0.72)] backdrop-blur-[18px] backdrop-saturate-150">
        <div className={`${CONTAINER} grid h-[66px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4`}>
          <div className="justify-self-start">
            <BackAngle label={chrome.detail.goBack} />
          </div>

          <Link
            href={chrome.brand.homeHref}
            className="inline-flex items-center gap-[0.55rem] transition-[opacity] duration-300 hover:opacity-75 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            {/* Decorative: the wordmark beside it carries the accessible name. */}
            <img src={chrome.brand.mark} alt="" className="block h-[21px] w-auto max-[480px]:h-[18px]" />
            <img src={chrome.brand.wordmark} alt={chrome.brand.wordmarkAlt} className="block h-[14px] w-auto max-[480px]:h-[12px]" />
          </Link>

          <Link
            href="/watch"
            className="inline-flex h-9 items-center justify-self-end rounded-full bg-[rgba(255,255,225,0.08)] px-4 text-[0.78rem] font-semibold text-[rgba(255,255,225,0.85)] transition-[background-color,color] duration-200 hover:bg-ink hover:text-black focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink max-[480px]:px-3 max-[480px]:text-[0.72rem]"
          >
            Watch
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter brand={chrome.brand} footer={chrome.footer} />
    </div>
  );
}
