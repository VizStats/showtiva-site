"use client";

import { useRouter } from "next/navigation";

import { cx } from "@/lib/cx";

/**
 * The one back control used across the site: a bare left angle, no label, no
 * tail. Goes back through history when there is somewhere to go back to, and
 * to the catalog when the page was opened directly.
 */
export default function BackAngle({ label = "Go back", fallbackHref = "/watch", className }: { label?: string; fallbackHref?: string; className?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={label}
      className={cx(
        "group/back -ml-2.5 inline-grid size-11 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[rgba(255,255,225,0.72)] transition-[color] duration-300 ease-[ease] hover:text-ink focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none",
        className,
      )}
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push(fallbackHref);
      }}
    >
      <svg
        className="size-[22px] flex-none transition-[transform] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover/back:[transform:translateX(-3px)] motion-reduce:transition-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
