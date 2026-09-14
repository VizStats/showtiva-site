"use client";

// The detail page's theatre, once Play is pressed.
//
// Streaming-app layout: "Now playing" and the title centred at the top, one
// large translucent play button in the middle, and along the bottom the
// elapsed time, a thin scrubber and the running time, with transport on the
// left (play, back 10, forward 10, volume) and viewing options on the right
// (audio & subtitles, settings, picture-in-picture, fullscreen). Everything
// but the picture fades away while the film plays and nobody is touching it.
import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cx } from "@/lib/cx";

interface MoviePlayerProps {
  title: string;
  /** Tried in order; the browser moves on to the next if one fails. */
  sources: string[];
  poster: string;
  onClose: () => void;
}

/* ------------------------------------------------------------- behaviour -- */

/** How long the controls stay up after the last sign of life. */
const HIDE_AFTER_MS = 2800;
const SKIP_SECONDS = 10;
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

/* Rotation is only offered where it can be honoured: something to call lock()
   on, and a screen for which sideways means anything. Android has both; iOS
   Safari has no lock, so the control never appears there. */
const COARSE_QUERY = "(pointer: coarse)";

/** The lock half of the Screen Orientation API, which the DOM lib omits. */
type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: string) => Promise<void>;
  unlock?: () => void;
};

/** iPhone Safari has no element fullscreen, only the video's own. */
type WebkitVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

function subscribeToPointerKind(onChange: () => void) {
  const query = window.matchMedia(COARSE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readCanRotate() {
  const orientation = window.screen?.orientation as LockableOrientation | undefined;
  return typeof orientation?.lock === "function" && window.matchMedia(COARSE_QUERY).matches;
}

function readIsCoarse() {
  return window.matchMedia(COARSE_QUERY).matches;
}

const noSubscribe = () => () => undefined;
const readCanPip = () => typeof document !== "undefined" && document.pictureInPictureEnabled === true;

/** 83 → "1:23", 4023 → "1:07:03". */
function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

function seekBy(video: HTMLVideoElement, delta: number) {
  const end = Number.isFinite(video.duration) ? video.duration : video.currentTime + delta;
  video.currentTime = Math.min(end, Math.max(0, video.currentTime + delta));
}

/* --------------------------------------------------------------- styling -- */

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/* One button shape for the whole bar: a translucent disc that brightens on
   hover. The disc is smaller on a phone, where eight of them share 343px. */
const DISC_BASE =
  "relative inline-grid flex-none cursor-pointer place-items-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.12)] p-0 text-white backdrop-blur-[14px] transition-[background-color,border-color,scale,opacity] duration-200 ease-[ease] hover:border-[rgba(255,255,255,0.22)] hover:bg-[rgba(255,255,255,0.24)] active:scale-95 aria-expanded:bg-[rgba(255,255,255,0.28)] motion-reduce:transition-none " +
  FOCUS_RING;
/* Sizes kept apart from the base, so a bigger disc never has two size
   utilities fighting over the same property. */
const DISC = DISC_BASE + " size-11 max-[560px]:size-9 [&_svg]:size-5 max-[560px]:[&_svg]:size-[18px]";
const DISC_SKIP_CENTRE = DISC_BASE + " size-12 min-[561px]:hidden [&_svg]:size-6";
const DISC_HERO = DISC_BASE + " size-[clamp(4.5rem,8vw,6rem)] max-[560px]:size-[4.25rem] [&_svg]:size-[42%]";

const MENU =
  "absolute right-0 bottom-[calc(100%+0.75rem)] z-[8] w-[15rem] max-w-[calc(100vw-2rem)] animate-menu-in rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(18,18,18,0.86)] p-2 text-left shadow-[0_18px_48px_rgba(0,0,0,0.55)] backdrop-blur-[18px] motion-reduce:animate-none";
const MENU_HEADING = "px-3 pt-2 pb-1 text-[0.62rem] font-semibold tracking-[0.2em] text-[rgba(255,255,255,0.5)] uppercase";
const MENU_ITEM =
  "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border-0 bg-transparent px-3 py-2 text-left text-[0.86rem] text-white transition-[background-color] duration-150 hover:bg-[rgba(255,255,255,0.1)] disabled:cursor-default disabled:text-[rgba(255,255,255,0.4)] disabled:hover:bg-transparent " +
  FOCUS_RING;

/* ----------------------------------------------------------------- icons -- */

const svgProps = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
} as const;
const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const PlayIcon = () => (
  <svg {...svgProps}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" />
  </svg>
);
const PauseIcon = () => (
  <svg {...svgProps}>
    <rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
    <rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
  </svg>
);
const ReplayIcon = () => (
  <svg {...svgProps}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" {...strokeProps} />
    <path d="M4.2 3.8v3.6h3.6" {...strokeProps} />
  </svg>
);
/* A circling arrow with the seconds inside it. */
const SkipIcon = ({ forward }: { forward?: boolean }) => (
  <svg {...svgProps} className="overflow-visible">
    <g transform={forward ? "translate(24 0) scale(-1 1)" : undefined}>
      <path d="M5.6 8.2A7.6 7.6 0 1 1 4.4 12" {...strokeProps} />
      <path d="M5.2 3.9v4.6h4.6" {...strokeProps} />
    </g>
    <text x="12.4" y="15.3" textAnchor="middle" fill="currentColor" fontSize="7.2" fontWeight="700">
      10
    </text>
  </svg>
);
const VolumeIcon = ({ level }: { level: "muted" | "low" | "high" }) => (
  <svg {...svgProps}>
    <path d="M4 9.5h3.2L11.5 6v12l-4.3-3.5H4z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    {level === "muted" ? (
      <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" {...strokeProps} />
    ) : (
      <>
        <path d="M15 9.2a4 4 0 0 1 0 5.6" {...strokeProps} />
        {level === "high" && <path d="M17.8 6.6a7.6 7.6 0 0 1 0 10.8" {...strokeProps} />}
      </>
    )}
  </svg>
);
const GlobeIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="8.5" {...strokeProps} />
    <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5S9.6 5.9 12 3.5z" {...strokeProps} />
  </svg>
);
const GearIcon = () => (
  <svg {...svgProps}>
    <path
      d="M10.3 3.6h3.4l.5 2.3 1.7 1 2.2-.8 1.7 3-1.7 1.5v2l1.7 1.5-1.7 3-2.2-.8-1.7 1-.5 2.3h-3.4l-.5-2.3-1.7-1-2.2.8-1.7-3 1.7-1.5v-2L4.2 9.1l1.7-3 2.2.8 1.7-1z"
      {...strokeProps}
    />
    <circle cx="12" cy="12" r="2.6" {...strokeProps} />
  </svg>
);
const PipIcon = () => (
  <svg {...svgProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" {...strokeProps} />
    <rect x="12" y="11.5" width="6.5" height="5" rx="1" fill="currentColor" />
  </svg>
);
const FullscreenIcon = ({ exit }: { exit?: boolean }) => (
  <svg {...svgProps}>
    {exit ? (
      <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" {...strokeProps} />
    ) : (
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" {...strokeProps} />
    )}
  </svg>
);
/* A handset upright or on its side, showing where the next press takes it. */
const RotateIcon = ({ landscape }: { landscape: boolean }) => (
  <svg {...svgProps}>
    <rect
      x={landscape ? "3" : "7.5"}
      y={landscape ? "7.5" : "3"}
      width={landscape ? "18" : "9"}
      height={landscape ? "9" : "18"}
      rx="1.8"
      {...strokeProps}
    />
  </svg>
);
const CloseIcon = () => (
  <svg {...svgProps}>
    <path d="M6 6l12 12M18 6L6 18" {...strokeProps} strokeWidth={2.1} />
  </svg>
);
const CheckIcon = () => (
  <svg {...svgProps} className="size-4 flex-none">
    <path d="M5 12.5l4.5 4.5L19 7.5" {...strokeProps} strokeWidth={2.2} />
  </svg>
);

/* ------------------------------------------------------------- component -- */

export default function MoviePlayer({ title, sources, poster, onClose }: MoviePlayerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [paused, setPaused] = useState(true);
  const [ended, setEnded] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [awake, setAwake] = useState(true);
  const [menu, setMenu] = useState<"language" | "settings" | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const [pulse, setPulse] = useState<"back" | "forward" | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [inPip, setInPip] = useState(false);

  // Device capabilities live outside React; the server snapshot is false, so
  // these controls are absent until the client has looked.
  const canRotate = useSyncExternalStore(subscribeToPointerKind, readCanRotate, () => false);
  const isCoarse = useSyncExternalStore(subscribeToPointerKind, readIsCoarse, () => false);
  const canPip = useSyncExternalStore(noSubscribe, readCanPip, () => false);

  // Paused, finished, mid-drag or with a menu open, the controls never hide.
  const showControls = awake || paused || ended || scrubbing || menu !== null;

  /* -- waking the controls --------------------------------------------- */

  const wake = () => {
    setAwake(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setAwake(false), HIDE_AFTER_MS);
  };

  const flashSkip = (direction: "back" | "forward") => {
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    setPulse(direction);
    pulseTimerRef.current = setTimeout(() => setPulse(null), 620);
  };

  /* -- transport ---------------------------------------------------------- */

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) void video.play().catch(() => undefined);
    else video.pause();
  };

  const skip = (direction: "back" | "forward") => {
    const video = videoRef.current;
    if (!video) return;
    seekBy(video, direction === "forward" ? SKIP_SECONDS : -SKIP_SECONDS);
    flashSkip(direction);
    wake();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    // Unmuting at zero volume would change nothing you could hear.
    if (video.muted || video.volume === 0) {
      video.muted = false;
      if (video.volume === 0) video.volume = 0.6;
    } else {
      video.muted = true;
    }
  };

  const changeVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    video.muted = value === 0;
  };

  const changeSpeed = (value: number) => {
    const video = videoRef.current;
    if (video) video.playbackRate = value;
    setMenu(null);
  };

  /* -- scrubber ----------------------------------------------------------- */

  const ratioAt = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };

  const seekToRatio = (ratio: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = ratio * duration;
    setCurrent(ratio * duration);
  };

  const onScrubDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setScrubbing(true);
    seekToRatio(ratioAt(event.clientX));
  };
  const onScrubMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const ratio = ratioAt(event.clientX);
    if (event.pointerType === "mouse") setHoverRatio(ratio);
    if (scrubbing) seekToRatio(ratio);
  };
  const onScrubUp = () => {
    setScrubbing(false);
    wake();
  };
  const onScrubKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const moves: Record<string, () => void> = {
      ArrowLeft: () => seekBy(video, -5),
      ArrowRight: () => seekBy(video, 5),
      ArrowDown: () => seekBy(video, -5),
      ArrowUp: () => seekBy(video, 5),
      PageDown: () => seekBy(video, -SKIP_SECONDS),
      PageUp: () => seekBy(video, SKIP_SECONDS),
      Home: () => (video.currentTime = 0),
      End: () => (video.currentTime = duration),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    move();
    wake();
  };

  /* -- screen modes ------------------------------------------------------- */

  const toggleFullscreen = () => {
    const root = rootRef.current;
    const video = videoRef.current as WebkitVideo | null;
    if (!root) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
      return;
    }
    if (typeof root.requestFullscreen === "function") {
      void root.requestFullscreen().catch(() => undefined);
    } else {
      video?.webkitEnterFullscreen?.();
    }
  };

  // The orientation lock is only granted to a fullscreen element, so turning
  // sideways enters fullscreen first. Going back releases both.
  const toggleOrientation = async () => {
    const root = rootRef.current;
    const orientation = window.screen?.orientation as LockableOrientation | undefined;
    if (!root || typeof orientation?.lock !== "function") return;

    if (isLandscape) {
      orientation.unlock?.();
      setIsLandscape(false);
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => undefined);
      return;
    }

    if (!document.fullscreenElement) await root.requestFullscreen().catch(() => undefined);
    // A refused lock leaves the film fullscreen and upright, which is still a
    // better place to watch from than where it started.
    await orientation.lock("landscape").then(
      () => setIsLandscape(true),
      () => setIsLandscape(false),
    );
  };

  const togglePip = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) void document.exitPictureInPicture().catch(() => undefined);
    else void video.requestPictureInPicture().catch(() => undefined);
  };

  /* -- the surface -------------------------------------------------------- */

  // A mouse click on the picture plays or pauses, as everywhere else. A tap
  // cannot mean that — you could never bring the controls up without also
  // stopping the film — so a tap only shows or hides them.
  const onSurfaceClick = () => {
    if (menu) {
      setMenu(null);
      return;
    }
    if (isCoarse) {
      if (showControls && !paused) {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        setAwake(false);
      } else {
        wake();
      }
      return;
    }
    togglePlay();
    wake();
  };

  /* -- effects ------------------------------------------------------------ */

  // Play was the gesture that opened the theatre, so starting with sound is
  // allowed. If the browser refuses anyway, the big play button is waiting.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;

    const onFullscreenChange = () => {
      const open = document.fullscreenElement === root;
      setIsFullscreen(open);
      // Leaving fullscreen releases the lock with it.
      if (!open) setIsLandscape(false);
    };
    const onEnterPip = () => setInPip(true);
    const onLeavePip = () => setInPip(false);

    document.addEventListener("fullscreenchange", onFullscreenChange);
    video?.addEventListener("enterpictureinpicture", onEnterPip);
    video?.addEventListener("leavepictureinpicture", onLeavePip);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      video?.removeEventListener("enterpictureinpicture", onEnterPip);
      video?.removeEventListener("leavepictureinpicture", onLeavePip);
      // Closing the theatre takes every borrowed screen mode with it.
      if (document.fullscreenElement === root) void document.exitFullscreen().catch(() => undefined);
      if (document.pictureInPictureElement === video) void document.exitPictureInPicture().catch(() => undefined);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, []);

  // The keyboard listener is bound once; these hand it the current handlers.
  const flashSkipRef = useRef(flashSkip);
  const toggleFullscreenRef = useRef(toggleFullscreen);
  const wakeRef = useRef(wake);
  useEffect(() => {
    flashSkipRef.current = flashSkip;
    toggleFullscreenRef.current = toggleFullscreen;
    wakeRef.current = wake;
  });

  // Keyboard, the way every player does it. Keys typed into a field (the
  // search overlay) are left alone, and so are keys a focused control
  // already handles, so nothing happens twice.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const video = videoRef.current;
      const target = event.target instanceof Element ? event.target : null;
      if (!video || event.altKey || event.ctrlKey || event.metaKey) return;
      if (target?.closest("input, textarea, select, [contenteditable='true'], [role='slider'], [role='dialog']")) return;
      const onButton = !!target?.closest("button, a");

      switch (event.key) {
        case " ":
        case "k":
          if (onButton && event.key === " ") return;
          event.preventDefault();
          if (video.paused || video.ended) void video.play().catch(() => undefined);
          else video.pause();
          break;
        case "ArrowLeft":
        case "j":
          event.preventDefault();
          seekBy(video, -SKIP_SECONDS);
          flashSkipRef.current("back");
          break;
        case "ArrowRight":
        case "l":
          event.preventDefault();
          seekBy(video, SKIP_SECONDS);
          flashSkipRef.current("forward");
          break;
        case "ArrowUp":
          event.preventDefault();
          video.muted = false;
          video.volume = Math.min(1, video.volume + 0.1);
          break;
        case "ArrowDown":
          event.preventDefault();
          video.volume = Math.max(0, video.volume - 0.1);
          break;
        case "m":
          video.muted = !video.muted;
          break;
        case "f":
          toggleFullscreenRef.current();
          break;
        case "Escape":
          setMenu(null);
          return;
        default:
          return;
      }
      wakeRef.current();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // A click anywhere outside an open menu closes it.
  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-player-menu]")) return;
      setMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [menu]);

  /* -- derived ------------------------------------------------------------ */

  const progress = duration > 0 ? Math.min(1, current / duration) : 0;
  const bufferedRatio = duration > 0 ? Math.min(1, buffered / duration) : 0;
  const level = muted || volume === 0 ? "muted" : volume < 0.5 ? "low" : "high";
  const fade = cx(
    "transition-opacity duration-300 ease-[ease] motion-reduce:transition-none",
    showControls ? "opacity-100" : "pointer-events-none opacity-0",
  );
  // For buttons inside a pass-through layer: pointer-events-auto on a child
  // beats none on its parent, so a hidden button would still take the tap.
  const live = showControls ? "pointer-events-auto" : "pointer-events-none";

  const centreLabel = ended ? "Replay" : paused ? "Play" : "Pause";

  return (
    <div
      ref={rootRef}
      className={cx(
        "absolute inset-0 z-[2] overflow-hidden bg-black font-body text-white select-none",
        !showControls && "cursor-none",
      )}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse") wake();
      }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 block h-full w-full bg-black object-contain"
        poster={poster}
        playsInline
        preload="auto"
        onPlay={() => {
          setPaused(false);
          setEnded(false);
          wake();
        }}
        onPause={() => setPaused(true)}
        onEnded={() => {
          setPaused(true);
          setEnded(true);
        }}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => {
          if (!scrubbing) setCurrent(event.currentTarget.currentTime);
        }}
        onProgress={(event) => {
          const ranges = event.currentTarget.buffered;
          if (ranges.length) setBuffered(ranges.end(ranges.length - 1));
        }}
        onVolumeChange={(event) => {
          setVolume(event.currentTarget.volume);
          setMuted(event.currentTarget.muted);
        }}
        onRateChange={(event) => setSpeed(event.currentTarget.playbackRate)}
      >
        {sources.map((source) => (
          // The type lets a browser skip a format it cannot play without
          // downloading it first.
          <source key={source} src={source} type={source.endsWith(".webm") ? "video/webm" : "video/mp4"} />
        ))}
      </video>

      {/* The surface: takes clicks and taps meant for the picture itself. */}
      <div className="absolute inset-0 z-[1]" onClick={onSurfaceClick} aria-hidden="true" />

      {/* Scrims, so white controls read over a white sky. */}
      <div
        className={cx(
          "pointer-events-none absolute inset-0 z-[2] bg-[image:linear-gradient(to_bottom,rgba(0,0,0,0.72),rgba(0,0,0,0)_26%),linear-gradient(to_top,rgba(0,0,0,0.82),rgba(0,0,0,0)_38%)]",
          fade,
        )}
        aria-hidden="true"
      />

      {/* ---- top: close, and what is playing ---- */}
      <div
        className={cx(
          "absolute inset-x-0 top-0 z-[3] grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-start gap-3 px-[clamp(1rem,3vw,2.25rem)] pt-[clamp(0.9rem,2.2vw,1.6rem)] max-[560px]:grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] max-[560px]:px-3 max-[560px]:pt-3",
          fade,
        )}
      >
        <span aria-hidden="true" />
        <div className="min-w-0 pt-1 text-center">
          <p className="text-[0.72rem] font-medium tracking-[0.04em] text-[rgba(255,255,255,0.72)] max-[560px]:text-[0.66rem]">Now playing</p>
          <h2 className="mt-1 truncate font-heading text-[clamp(1.05rem,2vw,1.5rem)] leading-tight font-semibold tracking-[-0.01em] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
            {title}
          </h2>
        </div>
        <button type="button" className={DISC} aria-label="Close player" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      {/* ---- centre: the big play button, flanked by skips on a phone ---- */}
      <div
        className={cx(
          "pointer-events-none absolute inset-0 z-[3] flex items-center justify-center gap-[clamp(2rem,6vw,4.5rem)]",
          fade,
        )}
      >
        <button
          type="button"
          className={cx(DISC_SKIP_CENTRE, live)}
          aria-label={`Back ${SKIP_SECONDS} seconds`}
          onClick={() => skip("back")}
        >
          <SkipIcon />
        </button>

        <button
          type="button"
          className={cx(DISC_HERO, live, waiting && !paused && "opacity-0")}
          aria-label={centreLabel}
          onClick={() => {
            togglePlay();
            wake();
          }}
        >
          {ended ? <ReplayIcon /> : paused ? <PlayIcon /> : <PauseIcon />}
        </button>

        <button
          type="button"
          className={cx(DISC_SKIP_CENTRE, live)}
          aria-label={`Forward ${SKIP_SECONDS} seconds`}
          onClick={() => skip("forward")}
        >
          <SkipIcon forward />
        </button>
      </div>

      {/* Buffering: a ring where the play button was, always visible. */}
      {waiting && !paused && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-[3] size-14 -translate-1/2 animate-spin rounded-full border-[3px] border-[rgba(255,255,255,0.22)] border-t-white motion-reduce:animate-none" aria-hidden="true" />
      )}

      {pulse && (
        <div
          className={cx(
            "pointer-events-none absolute top-1/2 z-[4] grid size-[clamp(4.5rem,8vw,6rem)] animate-skip-flash place-items-center rounded-full bg-[rgba(0,0,0,0.45)] text-[clamp(1rem,1.8vw,1.35rem)] font-semibold text-white backdrop-blur-[10px] motion-reduce:animate-none motion-reduce:opacity-100",
            pulse === "back" ? "left-[18%] max-[560px]:left-[6%]" : "right-[18%] max-[560px]:right-[6%]",
          )}
          aria-hidden="true"
        >
          {pulse === "back" ? `−${SKIP_SECONDS}` : `+${SKIP_SECONDS}`}
        </div>
      )}

      {/* ---- bottom: time, scrubber, and the two button rows ---- */}
      <div
        className={cx(
          "absolute inset-x-0 bottom-0 z-[4] px-[clamp(1rem,3vw,2.25rem)] pb-[clamp(0.9rem,2.2vw,1.6rem)] max-[560px]:px-3 max-[560px]:pb-3",
          fade,
        )}
      >
        <div className="flex items-center gap-[clamp(0.7rem,1.4vw,1.1rem)] text-[0.8rem] font-medium text-white tabular-nums max-[560px]:gap-2.5 max-[560px]:text-[0.72rem]">
          <span className="min-w-[2.6rem] text-left">{formatTime(current)}</span>

          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(current)}
            aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
            className={cx("group/scrub relative flex h-6 flex-1 cursor-pointer touch-none items-center rounded-full", FOCUS_RING)}
            onPointerDown={onScrubDown}
            onPointerMove={onScrubMove}
            onPointerUp={onScrubUp}
            onPointerCancel={onScrubUp}
            onPointerLeave={() => setHoverRatio(null)}
            onKeyDown={onScrubKey}
          >
            <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.24)] transition-[height] duration-150 group-hover/scrub:h-[5px] motion-reduce:transition-none">
              <div className="absolute inset-y-0 left-0 bg-[rgba(255,255,255,0.38)]" style={{ width: `${bufferedRatio * 100}%` }} />
              <div className="absolute inset-y-0 left-0 bg-[#ff3040]" style={{ width: `${progress * 100}%` }} />
            </div>
            <div
              className={cx(
                "pointer-events-none absolute top-1/2 size-3.5 -translate-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,48,64,0.35)] transition-[scale] duration-150 group-hover/scrub:scale-110 motion-reduce:transition-none",
                scrubbing && "scale-125",
              )}
              style={{ left: `${progress * 100}%` }}
              aria-hidden="true"
            />
            {hoverRatio !== null && duration > 0 && (
              <span
                className="pointer-events-none absolute bottom-[calc(100%+0.4rem)] -translate-x-1/2 rounded-md bg-[rgba(0,0,0,0.78)] px-2 py-1 text-[0.72rem] text-white"
                style={{ left: `${hoverRatio * 100}%` }}
                aria-hidden="true"
              >
                {formatTime(hoverRatio * duration)}
              </span>
            )}
          </div>

          <span className="min-w-[2.6rem] text-right">{formatTime(duration)}</span>
        </div>

        <div className="mt-[clamp(0.55rem,1.2vw,0.85rem)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-[clamp(0.45rem,0.9vw,0.7rem)]">
            {/* A phone has play and the skips in the middle of the screen. */}
            <button type="button" className={cx(DISC, "max-[560px]:hidden")} aria-label={ended ? "Replay" : paused ? "Play" : "Pause"} onClick={togglePlay}>
              {ended ? <ReplayIcon /> : paused ? <PlayIcon /> : <PauseIcon />}
            </button>
            <button type="button" className={cx(DISC, "max-[560px]:hidden")} aria-label={`Back ${SKIP_SECONDS} seconds`} onClick={() => skip("back")}>
              <SkipIcon />
            </button>
            <button type="button" className={cx(DISC, "max-[560px]:hidden")} aria-label={`Forward ${SKIP_SECONDS} seconds`} onClick={() => skip("forward")}>
              <SkipIcon forward />
            </button>

            {/* The level slider slides out of the mute button on hover. Touch
                screens set volume with the hardware keys, so they get mute. */}
            <div className="group/volume flex items-center rounded-full transition-[background-color] duration-200 hover:bg-[rgba(255,255,255,0.08)] focus-within:bg-[rgba(255,255,255,0.08)]">
              <button type="button" className={DISC} aria-label={level === "muted" ? "Unmute" : "Mute"} onClick={toggleMute}>
                <VolumeIcon level={level} />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                aria-label="Volume"
                className="player-volume w-0 opacity-0 transition-[width,opacity,margin] duration-200 ease-[ease] group-hover/volume:mx-3 group-hover/volume:w-20 group-hover/volume:opacity-100 focus-visible:mx-3 focus-visible:w-20 focus-visible:opacity-100 group-focus-within/volume:mx-3 group-focus-within/volume:w-20 group-focus-within/volume:opacity-100 pointer-coarse:hidden motion-reduce:transition-none"
                style={{ "--fill": `${(muted ? 0 : volume) * 100}%` } as React.CSSProperties}
                onChange={(event) => changeVolume(Number(event.currentTarget.value))}
              />
            </div>
          </div>

          <div className="flex items-center gap-[clamp(0.45rem,0.9vw,0.7rem)] max-[560px]:gap-1.5">
            <div className="relative" data-player-menu>
              <button
                type="button"
                className={DISC}
                aria-label="Audio and subtitles"
                aria-haspopup="menu"
                aria-expanded={menu === "language"}
                onClick={() => setMenu((open) => (open === "language" ? null : "language"))}
              >
                <GlobeIcon />
              </button>
              {menu === "language" && (
                <div className={MENU} role="menu" aria-label="Audio and subtitles">
                  <p className={MENU_HEADING}>Audio</p>
                  <button type="button" role="menuitemradio" aria-checked="true" className={MENU_ITEM} onClick={() => setMenu(null)}>
                    English <span className="ml-auto text-[0.72rem] text-[rgba(255,255,255,0.5)]">Original</span>
                    <CheckIcon />
                  </button>
                  <p className={cx(MENU_HEADING, "mt-1")}>Subtitles</p>
                  <button type="button" role="menuitemradio" aria-checked="true" className={MENU_ITEM} onClick={() => setMenu(null)}>
                    Off
                    <CheckIcon />
                  </button>
                  {/* Listed but disabled: no title carries a caption file yet,
                      and a switch that changes nothing is worse than none. */}
                  <button type="button" role="menuitemradio" aria-checked="false" className={MENU_ITEM} disabled>
                    English
                    <span className="text-[0.72rem]">Not available</span>
                  </button>
                </div>
              )}
            </div>

            <div className="relative" data-player-menu>
              <button
                type="button"
                className={DISC}
                aria-label="Settings"
                aria-haspopup="menu"
                aria-expanded={menu === "settings"}
                onClick={() => setMenu((open) => (open === "settings" ? null : "settings"))}
              >
                <GearIcon />
              </button>
              {menu === "settings" && (
                <div className={MENU} role="menu" aria-label="Settings">
                  <p className={MENU_HEADING}>Playback speed</p>
                  <div className="grid grid-cols-3 gap-1 px-1 pb-1">
                    {SPEEDS.map((value) => (
                      <button
                        key={value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={speed === value}
                        className={cx(
                          "cursor-pointer rounded-lg border-0 px-2 py-2 text-[0.8rem] font-medium transition-[background-color] duration-150 " + FOCUS_RING,
                          speed === value ? "bg-white text-black" : "bg-[rgba(255,255,255,0.06)] text-white hover:bg-[rgba(255,255,255,0.14)]",
                        )}
                        onClick={() => changeSpeed(value)}
                      >
                        {value === 1 ? "Normal" : `${value}×`}
                      </button>
                    ))}
                  </div>
                  <p className={cx(MENU_HEADING, "mt-1")}>Quality</p>
                  <button type="button" role="menuitemradio" aria-checked="true" className={MENU_ITEM} onClick={() => setMenu(null)}>
                    Auto
                    <CheckIcon />
                  </button>
                </div>
              )}
            </div>

            {canPip && (
              <button type="button" className={DISC} aria-label={inPip ? "Exit picture-in-picture" : "Picture-in-picture"} aria-pressed={inPip} onClick={togglePip}>
                <PipIcon />
              </button>
            )}

            {canRotate && (
              <button
                type="button"
                className={DISC}
                aria-label={isLandscape ? "Back to portrait" : "Watch in landscape"}
                aria-pressed={isLandscape}
                onClick={toggleOrientation}
              >
                <RotateIcon landscape={isLandscape} />
              </button>
            )}

            <button type="button" className={DISC} aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={toggleFullscreen}>
              <FullscreenIcon exit={isFullscreen} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
