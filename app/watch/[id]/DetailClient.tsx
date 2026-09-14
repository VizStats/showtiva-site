"use client";

// "Premium Minimal" detail page.
//
// Confident restraint: near-black, near-white, one mid-grey, and a single
// accent that appears exactly once (the rating). No pills, no badges, no card
// borders — metadata is quiet inline text on hairline dividers. Type carries
// the hierarchy; the artwork appears once, full-bleed and unadorned.
//
// Spacing runs on a single rhythm unit (--step) and its halves, so every
// section lands on the same vertical grid at every breakpoint.
import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { cx } from "@/lib/cx";
import { getSignupHref, isDemoSignedIn } from "../../_auth/demo-auth";
import ProfileMenu from "../../_auth/ProfileMenu";
import type { Episode, Movie } from "@/lib/content-types";
import type { Brand, DetailLabels, FooterContent, PopoverLabels } from "@/lib/site-types";
import PosterCard from "../PosterCard";
import MoviePlayer, { episodeCode, type PlayerMedia, type PlayerPick, type Rendition } from "./MoviePlayer";
import SearchOverlay from "../SearchOverlay";
import SiteFooter from "../SiteFooter";
import TitlePopover, { useTitlePopover } from "../TitlePopover";

interface DetailClientProps {
  movie: Movie;
  related: Movie[];
  /** Whole catalog, for the global search overlay. */
  allMovies: Movie[];
  brand: Brand;
  footer: FooterContent;
  labels: DetailLabels;
  popoverLabels: PopoverLabels;
}

/* ------------------------------------------------------------- styling -- */

/* Page-wide tokens: the shell width, the gutter, and the rhythm unit. */
const PAGE =
  "relative flex w-full min-h-dvh flex-1 flex-col bg-black font-body text-ink antialiased [--gutter:clamp(1.25rem,5vw,4rem)] [--shell-max:1240px] [--step:clamp(3.5rem,7.5vw,6.5rem)]";
const SHELL = "mx-auto w-full max-w-(--shell-max) px-(--gutter)";
const FOCUS_RING = "focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink";

/* How far a finger has to travel, in one unbroken drag, before the page is
   handed back while the theatre is open. Short enough that a real attempt to
   leave always works first time; long enough that the small movements a hand
   makes while holding a phone never do. */
const DRAG_RELEASE_PX = 80;

/* Stand-in footage. No title in the store has a playable file yet (a TMDB
   trailer is a YouTube page, which a <video> cannot play), so the player runs
   Big Buck Bunny — an open-licence (CC BY 3.0, Blender Foundation), all-ages
   short in landscape — from Wikimedia Commons, which serves it at every size
   from 240p to 4K, so the quality menu switches real files. After those, a
   10-second H.264 cut for browsers without WebM (older iPhones), and the
   site's own clip last, which is portrait, so it is only there if both hosts
   are unreachable. (The W3C's copy fails to decode in current Chrome.) A real
   file on a title replaces all of it. */
const STAND_IN_RENDITIONS: Rendition[] = [240, 360, 480, 720, 1080, 1440, 2160].map((height) => ({
  height,
  url: `https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.${height}p.vp9.webm`,
}));
const STAND_IN_FALLBACKS = [
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
  "/bg_video_5.mp4",
];
const PLAYABLE = /\.(mp4|webm|m4v)(\?|#|$)/i;

/**
 * What to play for a file URL that may be missing. `startAt` opens the
 * stand-in part way through, so each episode opens on a different scene
 * instead of every one looking like the same video restarted. Only the long
 * renditions take it; the ten-second fallback would run off its own end.
 */
function mediaFor(url: string | null, startAt = 0): PlayerMedia {
  if (url && PLAYABLE.test(url)) return { renditions: [], fallbacks: [url] };
  return { renditions: STAND_IN_RENDITIONS, fallbacks: STAND_IN_FALLBACKS, startAt };
}

function standInOffset(season: number, episode: number) {
  return (season * 97 + episode * 53) % 560;
}

/* The action pair: see the slant utilities in globals.css.

   The pair only reads as one unit split by a single diagonal while the two
   buttons sit side by side — stacked, the lead's right-hand cut and the
   trail's left-hand cut face nothing and each button is just a lone
   parallelogram. So rather than going full-width on a narrow screen, the pair
   shrinks enough to stay on one line: at these metrics it measures ~248px,
   which clears the 280px a 320px viewport leaves inside the gutter. */
const ACTION =
  "[--btn-h:3.25rem] [--slant:calc(var(--btn-h)/3)] inline-flex h-(--btn-h) cursor-pointer items-center justify-center gap-[0.7rem] rounded-none border-0 text-[0.78rem] font-semibold tracking-[0.16em] uppercase transition-[background-color,border-color,color] duration-300 ease-[ease] max-[480px]:[--btn-h:2.75rem] max-[480px]:gap-2 max-[480px]:text-[0.7rem] max-[480px]:tracking-[0.12em] motion-reduce:transition-none " +
  FOCUS_RING;

/* ----------------------------------------------------------- component -- */

export default function DetailClient({
  movie,
  related,
  allMovies,
  brand,
  footer,
  labels,
  popoverLabels,
}: DetailClientProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Play expands the still into a full-height theatre and brings it to the top
  // of the viewport, so the screen is what you are looking at rather than
  // something below the fold.
  const [playing, setPlaying] = useState(false);
  const plateRef = useRef<HTMLDivElement | null>(null);

  // A series plays episodes; Play starts wherever the pick is, S1:E1 until
  // something else is chosen. A film only ever plays its trailer.
  const seasons = movie.seasons ?? [];
  const isSeries = seasons.length > 0 && seasons[0].episodes.length > 0;
  const [pick, setPick] = useState<PlayerPick>(() =>
    isSeries ? { season: seasons[0].number, episode: seasons[0].episodes[0].number } : "trailer",
  );
  // The season the page's list shows. Follows the player when it moves on,
  // but browsing another season on the page does not change what is playing.
  const [listSeasonNumber, setListSeasonNumber] = useState(seasons[0]?.number ?? 1);

  // A title opens at its title, not part way down it.
  //
  // next/link keeps the scroll position when the incoming page is already
  // visible in the viewport — documented behaviour, not a bug — and this
  // page's root spans the whole document, so it always counts as visible and
  // the scroll is never reset. Arriving from a scrolled catalog therefore
  // dropped you into the middle of a title you had not seen the top of.
  // Keyed on the id so stepping between related titles resets too.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movie.id]);

  // Scrolling belongs in an effect, not the click handler: at click time the
  // frame is still at its poster height, so it would scroll to the wrong place.
  useEffect(() => {
    if (!playing) return;
    plateRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [playing]);

  // On a touch screen the page holds still while the theatre is open, so a
  // stray finger cannot slide the video off the top mid-scene. It is a soft
  // hold rather than a trap: a deliberate drag past DRAG_RELEASE_PX reads as
  // "I do want to leave", and the page is handed back for the rest of the
  // session. Closing the player arms it again.
  //
  // The lock is overflow, not preventDefault on touchmove: a prevented first
  // touchmove cancels panning for that whole gesture in Chrome, so there
  // would be no way to let go part-way through one. Touch events still fire
  // against a non-scrolling body, which is what measures the drag.
  useEffect(() => {
    if (!playing) return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    const previousOverflow = document.body.style.overflow;
    let locked = false;
    let released = false;
    let startY = 0;

    const unlock = () => {
      if (!locked) return;
      document.body.style.overflow = previousOverflow;
      locked = false;
    };

    // startPlayer scrolls the theatre to the top of the viewport; locking
    // before that lands would leave it half way up the screen.
    const lockTimer = setTimeout(() => {
      document.body.style.overflow = "hidden";
      locked = true;
    }, 600);

    const onTouchStart = (event: TouchEvent) => {
      startY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (released) return;
      const y = event.touches[0]?.clientY ?? 0;
      if (Math.abs(y - startY) < DRAG_RELEASE_PX) return;
      released = true;
      unlock();
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      clearTimeout(lockTimer);
      unlock();
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [playing]);

  // --- related grid state ---
  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});
  const popover = useTitlePopover();

  const toggleBookmark = (movieId: string) => {
    if (!isDemoSignedIn()) {
      router.push(getSignupHref());
      return;
    }

    setBookmarked((prev) => ({ ...prev, [movieId]: !prev[movieId] }));
  };

  const requireAuth = (action: () => void, returnTo?: string) => {
    if (isDemoSignedIn()) {
      action();
      return;
    }

    router.push(getSignupHref(returnTo));
  };

  const startPlayer = () => {
    setPlaying(true);
  };

  // Every episode in watching order, for "next".
  const episodeOrder: { season: number; episode: number }[] = seasons.flatMap((season) =>
    season.episodes.map((episode) => ({ season: season.number, episode: episode.number })),
  );
  const pickedEpisode: Episode | null =
    pick === "trailer"
      ? null
      : (seasons.find((season) => season.number === pick.season)?.episodes.find((episode) => episode.number === pick.episode) ?? null);
  const pickIndex = pick === "trailer" ? -1 : episodeOrder.findIndex((e) => e.season === pick.season && e.episode === pick.episode);
  const nextPick = pickIndex >= 0 ? episodeOrder[pickIndex + 1] : undefined;

  const choose = (next: PlayerPick) => {
    setPick(next);
    if (next !== "trailer") setListSeasonNumber(next.season);
  };

  // From the list on the page: the player may be out of sight, so bring it
  // back up as well as starting the episode.
  const playFromList = (next: PlayerPick) => {
    choose(next);
    if (playing) plateRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    else setPlaying(true);
  };

  const toggleCurrentSaved = () => {
    requireAuth(() => setSaved((value) => !value));
  };

  // The player exits fullscreen and picture-in-picture as it unmounts.
  const closePlayer = () => {
    setPlaying(false);
  };

  // `||`, not `??`, throughout: the store's validator accepts "" as well as
  // null for the nullable fields, and an empty string would slip past `??` —
  // printing a blank meta cell, or a broken image for an empty src.
  const kind = movie.type || labels.typeFallback;

  // Built as a list so a blank field drops out entirely rather than leaving a
  // hairline divider with nothing beside it.
  const meta: { key: string; text: string; accent?: boolean }[] = [
    { key: "year", text: movie.year },
    // The one place the accent is allowed to appear.
    { key: "rating", text: movie.rating, accent: true },
    { key: "duration", text: movie.duration },
    { key: "type", text: kind },
    { key: "quality", text: labels.qualityBadge },
  ].filter((item) => item.text.trim().length > 0);
  return (
    // Relative on purpose: the hover popover is positioned in document
    // coordinates and resolves against this element, which starts at 0,0 and
    // carries no padding.
    <div className={PAGE}>
      <header
        className={cx(
          SHELL,
          "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 pt-[clamp(1.25rem,2vw,1.75rem)] pb-[clamp(1.25rem,2.4vw,2rem)] max-[760px]:pb-[clamp(2rem,8vw,3rem)]",
        )}
      >
        {/* A <button> rather than a link, because it calls router.back(). Two
            tracked-out words; wrapping them would read as a mistake. */}
        <button
          type="button"
          className={cx(
            "group/back inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-[0.7rem] font-medium tracking-[0.22em] whitespace-nowrap text-[#8a8a8a] uppercase transition-[color] duration-300 ease-[ease] hover:text-ink pointer-coarse:min-h-11 pointer-coarse:min-w-11 motion-reduce:transition-none",
            FOCUS_RING,
          )}
          // The label is hidden below 768px, and display:none takes it out
          // of the accessibility tree with it — so the name lives here.
          aria-label={labels.goBack}
          onClick={() => router.back()}
        >
          {/* The tailed arrow reads as a pair with the label beside it. With
              the label gone below 768px it is just the angle. */}
          <svg
            className="h-3 w-[18px] flex-none transition-[transform] duration-[0.35s] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover/back:[transform:translateX(-4px)] max-[768px]:hidden motion-reduce:transition-none"
            viewBox="0 0 18 12"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M6.2 1 1 6l5.2 5M1 6h17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            className="hidden size-[19px] flex-none max-[768px]:block"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {/* Arrow only on a phone: the words cost width the lockup and the
              two icons need in the same row. */}
          <span className="max-[768px]:hidden">{labels.goBack}</span>
        </button>

        {/* On entry the lockup glides in from the left. Animated on the two
            images rather than the link, because an animation's final opacity
            outranks a normal declaration and would kill the hover fade on the
            parent. The wordmark trails the mark by a beat. */}
        <Link
          href={brand.homeHref}
          className={cx(
            "inline-flex flex-none items-center gap-[0.55rem] justify-self-center transition-[opacity] duration-300 ease-[ease] hover:opacity-70 pointer-coarse:min-h-11 motion-reduce:transition-none",
            FOCUS_RING,
          )}
        >
          <img className="block h-[clamp(17px,2.1vw,21px)] w-auto animate-lockup-glide-in motion-reduce:animate-none" src={brand.mark} alt="" />
          <img
            className="block h-[clamp(11px,1.5vw,14px)] w-auto animate-lockup-glide-in [animation-delay:0.09s] motion-reduce:animate-none"
            src={brand.wordmark}
            alt={brand.wordmarkAlt}
          />
        </Link>

        {/* Plain icon buttons, borderless — matches the Premium Minimal chrome. */}
        <div className="inline-flex items-center gap-[0.85rem] justify-self-end">
          <button
            type="button"
            className="inline-flex size-[2.35rem] flex-none cursor-pointer items-center justify-center rounded-[999px] border-0 bg-transparent p-0 text-[#8a8a8a] no-underline transition-[color] duration-300 ease-[ease] hover:text-ink"
            aria-label={labels.search}
            onClick={() => setSearchOpen(true)}
          >
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <ProfileMenu ariaLabel={labels.profile} variant="minimal" />
        </div>
      </header>

      <main className="flex-1 pb-[clamp(6rem,10vw,10rem)]">
        {/* Compact info block above a full-bleed still: roughly 30/70 of the
            opening screen, so the artwork stays the dominant element. */}
        <section className={cx(SHELL, "pb-[clamp(0.9rem,1.6vw,1.35rem)]")}>
          {/* `balance` still will not break a single long word; on a 320px
              screen the display size is 34px, wide enough to run off the edge. */}
          <h1 className="mt-[clamp(1.35rem,2.1vw,1.7rem)] font-heading text-[clamp(2.2rem,4.2vw,3.4rem)] leading-[1.02] font-light tracking-[-0.03em] break-words text-balance max-[760px]:tracking-[-0.018em]">
            {movie.title}
          </h1>
          {movie.subtitle && (
            <p className="mt-[clamp(0.7rem,1vw,0.9rem)] font-heading text-[clamp(0.78rem,1.15vw,0.98rem)] font-normal tracking-[0.3em] text-[#8a8a8a] uppercase max-[430px]:tracking-[0.24em]">
              {movie.subtitle}
            </p>
          )}

          {/* Hairlines hang off the left edge of every item but the first,
              which breaks the moment the rail wraps; below 560px it always
              does, so they give way to plain spacing. */}
          {meta.length > 0 && (
            <ul className="mt-[clamp(1rem,1.55vw,1.28rem)] flex list-none flex-wrap items-center gap-x-0 gap-y-2 text-[0.84rem] tracking-[0.06em] text-[#8a8a8a] tabular-nums max-[560px]:gap-x-[1.15rem]">
              {meta.map((item) => (
                <li
                  key={item.key}
                  className="not-first:ml-[clamp(0.85rem,1.8vw,1.5rem)] not-first:border-l not-first:border-[rgba(250,250,250,0.11)] not-first:pl-[clamp(0.85rem,1.8vw,1.5rem)] max-[560px]:not-first:ml-0 max-[560px]:not-first:border-l-0 max-[560px]:not-first:pl-0"
                >
                  {item.accent ? <span className="text-[#ff3040]">{item.text}</span> : item.text}
                </li>
              ))}
            </ul>
          )}

          {/* Three lines: enough to read the premise while keeping the block
              inside its share of the opening screen. Full text stays in the
              DOM, so screen readers and SEO are unaffected. */}
          <p className="mt-[clamp(1.05rem,1.7vw,1.35rem)] line-clamp-3 max-w-[78ch] font-[family-name:'Segoe_UI',Roboto,-apple-system,BlinkMacSystemFont,sans-serif] text-[clamp(1rem,1.12vw,1.1rem)] leading-[1.78] font-medium tracking-[0] text-[#c7c7bd]">
            {movie.description}
          </p>

          <div className="mt-[clamp(1.18rem,1.9vw,1.58rem)] flex flex-nowrap gap-0 [--edge-gap:10px]">
            <button
              type="button"
              className={cx(ACTION, "[--pad:clamp(2.5rem,4.4vw,3.6rem)] max-[480px]:[--pad:2.1rem] bg-ink pr-[calc(var(--pad)+var(--slant))] pl-(--pad) text-black slant-lead hover:bg-[#e8e8cd]")}
              onClick={startPlayer}
            >
              <svg
                className="h-3 w-[10px] flex-none"
                viewBox="0 0 12 14"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M0 0v14l12-7z" fill="currentColor" />
              </svg>
              <span>{labels.play}</span>
            </button>

            {/* The hairline outline is a clipped layer rather than a border,
                because clip-path shears a real border off along the cut edge:
                the element is the outline colour and ::before insets by 1px in
                the page colour. Saved reads as engaged, not disabled: a quiet
                fill, label at full strength. */}
            <button
              type="button"
              className={cx(
                ACTION,
                "[--pad:clamp(1.05rem,1.8vw,1.5rem)] max-[480px]:[--pad:0.7rem] relative isolate ml-[calc(var(--edge-gap)-var(--slant))] bg-[rgba(250,250,250,0.28)] pr-(--pad) pl-[calc(var(--pad)+var(--slant))] text-ink slant-trail before:absolute before:inset-px before:z-[-1] before:content-[''] before:[clip-path:polygon(0_0,100%_0,100%_100%,var(--slant)_100%)] hover:bg-ink",
                saved ? "before:bg-[#1a1a19] hover:before:bg-[#232322]" : "before:bg-black",
              )}
              aria-pressed={saved}
              onClick={toggleCurrentSaved}
            >
              {/* Wrapped so the button's counter-skew rule can reach the label —
                  a bare text node would stay sheared with the button. */}
              <span>{saved ? labels.inWatchlist : labels.watchlist}</span>
            </button>
          </div>
        </section>

        {/* Full-bleed and deliberately huge — the page's centrepiece. The 70vh
            floor holds it near two-thirds of the opening screen even on short,
            wide windows where 21:9 alone would compute much shorter. Playing,
            the frame drops its poster proportions and becomes a theatre. */}
        <figure className="w-full min-w-0">
          <div
            ref={plateRef}
            className={cx(
              "group/frame relative w-full overflow-hidden transition-[height] duration-[0.45s] ease-[cubic-bezier(0.2,0.7,0.2,1)]",
              playing
                ? "h-[92vh] max-h-none min-h-0 cursor-default bg-black aspect-auto"
                : // The fade-to-page gradient belongs to the poster state, not the theatre.
                  "max-h-[88vh] min-h-[68vh] bg-[#101010] aspect-[21/9] after:pointer-events-none after:absolute after:inset-0 after:bg-[image:linear-gradient(to_bottom,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,0)_58%,#000000_100%)] after:content-[''] max-[899px]:max-h-none max-[899px]:min-h-0 max-[899px]:aspect-[16/10] max-[760px]:aspect-[4/3]",
            )}
          >
            {playing ? (
              <MoviePlayer
                title={movie.title}
                episodeLabel={
                  pickedEpisode && pick !== "trailer"
                    ? `S${pick.season}:E${pick.episode} · ${pickedEpisode.title}`
                    : isSeries
                      ? "Trailer"
                      : undefined
                }
                media={
                  pickedEpisode && pick !== "trailer"
                    ? mediaFor(pickedEpisode.videoUrl, standInOffset(pick.season, pick.episode))
                    : mediaFor(movie.trailerUrl)
                }
                poster={pickedEpisode?.still || movie.backdrop}
                onClose={closePlayer}
                series={isSeries ? { seasons, current: pick, fallbackStill: movie.backdrop, onSelect: choose } : undefined}
                onNext={nextPick ? () => choose(nextPick) : undefined}
              />
            ) : (
              <>
                <img className="block h-full w-full object-cover object-[center_40%]" src={movie.backdrop} alt={movie.title} />
                <button
                type="button"
                className={cx(
                  "absolute top-1/2 left-1/2 z-[1] grid aspect-square w-[clamp(58px,7vw,84px)] cursor-pointer place-items-center rounded-[50%] border border-[rgba(250,250,250,0.5)] bg-[rgba(0,0,0,0.15)] text-ink transition-[background-color,border-color] duration-[0.35s] ease-[ease] [transform:translate(-50%,-50%)] hover:border-ink hover:bg-[rgba(250,250,250,0.12)] motion-reduce:transition-none",
                  FOCUS_RING,
                )}
                aria-label={labels.trailerPlay}
                onClick={startPlayer}
              >
                <svg
                  className="ml-[0.2em] h-auto w-[clamp(11px,1.4vw,15px)]"
                  viewBox="0 0 12 14"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M0 0v14l12-7z" fill="currentColor" />
                </svg>
              </button>
              </>
            )}
          </div>

          {/* The plate is full-bleed, so its caption re-applies the page shell
              to line up with the rest of the content. */}
          <figcaption className={SHELL}>
            <div className="mt-[clamp(0.9rem,1.4vw,1.2rem)] flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-[rgba(250,250,250,0.11)] pt-[clamp(0.7rem,1.1vw,0.95rem)]">
              <span className="flex min-w-0 flex-col gap-[0.55rem]">
                <span className="text-[0.66rem] font-medium tracking-[0.28em] text-[#8a8a8a] uppercase">{labels.trailerHeading}</span>
                <span className="font-heading text-[clamp(0.95rem,1.4vw,1.15rem)] font-normal tracking-[0.01em]">
                  {movie.title} — {labels.trailerTitleSuffix}
                </span>
              </span>
              <span className="text-[0.72rem] tracking-[0.16em] text-[#8a8a8a] uppercase">{labels.trailerStudio}</span>
            </div>
          </figcaption>
        </figure>

        {isSeries && (
          <section className={cx(SHELL, "mt-[clamp(2.75rem,5.5vw,4.5rem)]")} aria-labelledby="episodes-heading">
            <div className="mb-[clamp(1.1rem,2.2vw,1.75rem)] flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <div className="flex items-baseline gap-4">
                <h2 id="episodes-heading" className="font-heading text-[clamp(1.4rem,2.3vw,1.85rem)] leading-none font-light tracking-[-0.02em]">
                  Episodes
                </h2>
                <span className="text-[0.7rem] tracking-[0.18em] text-[#8a8a8a] uppercase tabular-nums">
                  {movie.duration}
                </span>
              </div>

              {/* The season selector is light glass: a frosted track with the
                  chosen season lifted out of it in near-white. It scrolls
                  sideways rather than wrapping when a show runs long. */}
              <div
                role="tablist"
                aria-label="Seasons"
                className="flex max-w-full gap-0.5 overflow-x-auto rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.07)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-[18px] backdrop-saturate-150 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {seasons.map((season) => {
                  const active = season.number === listSeasonNumber;
                  return (
                    <button
                      key={season.number}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={cx(
                        "h-9 flex-none cursor-pointer rounded-full border-0 px-[1.05rem] text-[0.78rem] font-semibold tracking-[0.03em] whitespace-nowrap tabular-nums transition-[background-color,color,box-shadow] duration-250 ease-[ease] max-[480px]:h-8 max-[480px]:px-3.5 motion-reduce:transition-none",
                        FOCUS_RING,
                        active
                          ? "bg-[rgba(255,255,255,0.92)] text-black shadow-[0_4px_14px_rgba(0,0,0,0.3)]"
                          : "bg-transparent text-[rgba(255,255,255,0.72)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white",
                      )}
                      onClick={() => setListSeasonNumber(season.number)}
                    >
                      <span className="max-[480px]:hidden">Season </span>
                      <span className="hidden max-[480px]:inline">S</span>
                      {season.number}
                    </button>
                  );
                })}
              </div>
            </div>

            <ol className="list-none border-t border-[rgba(250,250,250,0.11)]">
              {(seasons.find((season) => season.number === listSeasonNumber) ?? seasons[0]).episodes.map((episode) => {
                const here = { season: listSeasonNumber, episode: episode.number };
                const isNow = playing && pick !== "trailer" && pick.season === here.season && pick.episode === here.episode;
                return (
                  <li key={episode.number} className="border-b border-[rgba(250,250,250,0.11)]">
                    <button
                      type="button"
                      aria-current={isNow}
                      className={cx(
                        "group/row grid w-full cursor-pointer grid-cols-[2.75rem_minmax(0,15rem)_minmax(0,1fr)] items-center gap-x-[clamp(1rem,2.4vw,2rem)] border-0 bg-transparent py-[clamp(0.95rem,1.8vw,1.35rem)] text-left text-ink transition-[background-color] duration-200 hover:bg-[rgba(255,255,255,0.03)] max-[640px]:grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] max-[640px]:gap-x-3.5 max-[640px]:py-3 motion-reduce:transition-none",
                        FOCUS_RING,
                      )}
                      onClick={() => playFromList(here)}
                    >
                      <span
                        className={cx(
                          "text-center font-heading text-[clamp(1.4rem,2.2vw,1.9rem)] font-light tabular-nums max-[640px]:hidden",
                          isNow ? "text-[#ff3040]" : "text-[#5c5c5c]",
                        )}
                        aria-hidden="true"
                      >
                        {episode.number}
                      </span>

                      <span className="relative block aspect-video overflow-hidden bg-[#101010]">
                        <img
                          className="block h-full w-full object-cover transition-[scale] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover/row:scale-[1.04] motion-reduce:transition-none"
                          src={episode.still || movie.backdrop}
                          alt=""
                          loading="lazy"
                        />
                        <span
                          className={cx(
                            "absolute inset-0 grid place-items-center bg-[rgba(0,0,0,0.28)] transition-opacity duration-200",
                            isNow ? "opacity-100" : "opacity-0 group-hover/row:opacity-100 group-focus-visible/row:opacity-100",
                          )}
                          aria-hidden="true"
                        >
                          <span className="grid size-10 place-items-center rounded-full border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.16)] backdrop-blur-[10px] max-[640px]:size-8">
                            <svg className={cx("ml-0.5 h-3 w-2.5", isNow ? "text-[#ff3040]" : "text-white")} viewBox="0 0 12 14" focusable="false">
                              <path d="M0 0v14l12-7z" fill="currentColor" />
                            </svg>
                          </span>
                        </span>
                      </span>

                      <span className="min-w-0">
                        <span className="flex items-baseline justify-between gap-4">
                          <span className="line-clamp-2 font-heading text-[clamp(0.98rem,1.3vw,1.12rem)] leading-snug font-normal tracking-[0.005em] max-[640px]:text-[0.92rem]">
                            {episode.title}
                          </span>
                          <span className="flex-none text-[0.78rem] text-[#8a8a8a] tabular-nums max-[640px]:hidden">{episode.duration}</span>
                        </span>
                        <span className="mt-1.5 block text-[0.64rem] font-medium tracking-[0.16em] text-[#8a8a8a] uppercase tabular-nums">
                          {isNow ? (
                            <span className="text-[#ff3040]">Now playing</span>
                          ) : (
                            <>
                              {episodeCode(here.season, here.episode)}
                              <span className="hidden max-[640px]:inline"> · {episode.duration}</span>
                            </>
                          )}
                        </span>
                        {episode.description && (
                          <span className="mt-2 line-clamp-2 max-w-[70ch] text-[0.9rem] leading-[1.6] text-[#a6a69c] max-[640px]:hidden">
                            {episode.description}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        <div className={SHELL}>
          <section className="mt-(--step)">
            <div className="mb-[clamp(1.75rem,3.2vw,2.75rem)] flex items-center gap-[clamp(1.25rem,2.5vw,2rem)]">
              <h2 className="font-body text-[0.7rem] font-medium tracking-[0.28em] whitespace-nowrap text-[#8a8a8a] uppercase">{labels.relatedHeading}</h2>
              <span className="h-px flex-1 bg-[rgba(250,250,250,0.11)]" aria-hidden="true" />
            </div>

            {/* Fixed 190px tracks rather than fr-based columns: `1fr` stretched
                each card, so a related card came out larger than the same card
                on the catalog. Below 560px the cards fill the row instead, two
                up, so a fixed track cannot leave a lone column with a hole. */}
            {related.length > 0 ? (
              <ul className="grid list-none grid-cols-[repeat(auto-fill,190px)] [justify-content:start] gap-x-[10px] gap-y-[clamp(1.5rem,2.4vw,2rem)] max-[559px]:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] max-[559px]:gap-y-6">
                {related.map((item) => (
                  <li key={item.id} className="min-w-0">
                    <PosterCard
                      movie={item}
                      saved={!!bookmarked[item.id]}
                      saveLabel={labels.saveToList}
                      onToggleSave={() => toggleBookmark(item.id)}
                      {...popover.cardProps(item)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[0.95rem] leading-[1.7] text-[#8a8a8a]">Nothing else in this collection yet.</p>
            )}
          </section>
        </div>
      </main>

      <SiteFooter brand={brand} footer={footer} />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        movies={allMovies}
        placeholder={`${labels.search} titles…`}
      />

      {popover.movie && popover.position && (
        <TitlePopover
          movie={popover.movie}
          position={popover.position}
          labels={popoverLabels}
          saved={!!bookmarked[popover.movie.id]}
          onToggleSave={() => toggleBookmark(popover.movie!.id)}
          onWatch={() => router.push(`/watch/${popover.movie!.id}`)}
          {...popover.popoverProps}
        />
      )}
    </div>
  );
}
