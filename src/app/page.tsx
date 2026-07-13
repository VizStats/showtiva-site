"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { FlipWords } from "../ui/flip-words";
import { CardStack, type CardStackItem } from "../ui/card-stack";
import { Highlight } from "../ui/highlight";
import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card";

const FAMILY_CARDS: CardStackItem[] = [
  {
    id: 0,
    name: "Sarah M.",
    designation: "Parent of two",
    content: (
      <p>
        Finally a place where I can let my kids browse freely.{" "}
        <Highlight>Zero explicit content</Highlight> — just wholesome stories.
      </p>
    ),
  },
  {
    id: 1,
    name: "ShowTiva Safety",
    designation: "Content Pipeline",
    content: (
      <p>
        Every show passes <Highlight>human review + filtering</Highlight> before
        it ever reaches your family screen.
      </p>
    ),
  },
  {
    id: 2,
    name: "James T.",
    designation: "Homeschool parent",
    content: (
      <p>
        The shows are <Highlight>age-appropriate and educational</Highlight> —
        no aggressive auto-play or hidden ads.
      </p>
    ),
  },
];

const CREATOR_CARDS: CardStackItem[] = [
  {
    id: 0,
    name: "Alex R.",
    designation: "Animation Director",
    content: (
      <p>
        Getting vetted and invited was tough — but worth it.{" "}
        <Highlight>Real studio collaboration</Highlight>, not another upload dump.
      </p>
    ),
  },
  {
    id: 1,
    name: "ShowTiva Studio",
    designation: "Vetting Standard",
    content: (
      <p>
        Access is earned through <Highlight>background checks and referrals</Highlight>.
        We protect the platform&apos;s trust.
      </p>
    ),
  },
  {
    id: 2,
    name: "Maya K.",
    designation: "Story Artist",
    content: (
      <p>
        I co-create <Highlight>family-safe originals</Highlight> with a team that
        actually cares about standards, not just views.
      </p>
    ),
  },
];

const draggableItems = [
  {
    title: "Starlit Dreams",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2669&auto=format&fit=crop",
    style: { position: "absolute" as const, top: "8%", left: "8%", transform: "rotate(-6deg)" }
  },
  {
    title: "Neon City Study",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=2574&auto=format&fit=crop",
    style: { position: "absolute" as const, top: "45%", left: "14%", transform: "rotate(-9deg)" }
  },
  {
    title: "Enchanted Sketch",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2574&auto=format&fit=crop",
    style: { position: "absolute" as const, top: "6%", left: "34%", transform: "rotate(5deg)" }
  },
  {
    title: "Lost Kingdom",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2574&auto=format&fit=crop",
    style: { position: "absolute" as const, top: "38%", left: "55%", transform: "rotate(8deg)" }
  },
  {
    title: "Chibi Quest",
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=2574&auto=format&fit=crop",
    style: { position: "absolute" as const, top: "18%", right: "8%", transform: "rotate(3deg)" }
  },
  {
    title: "Cyber Legend",
    image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=2574&auto=format&fit=crop",
    style: { position: "absolute" as const, top: "42%", left: "36%", transform: "rotate(-6deg)" }
  },
  {
    title: "Magical Forest",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=2574&auto=format&fit=crop",
    style: { position: "absolute" as const, top: "8%", right: "28%", transform: "rotate(4deg)" }
  },
];

function LandingContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "family"; // defaults to family
  const isCreator = role === "creator";

  const showLetters = ["S", "h", "o", "w"];
  const tivaLetters = ["T", "i", "v", "a"];
  const [isMinimized, setIsMinimized] = useState(false);
  const rotatingWords = ["Shows", "Movies", "Series", "Stories", "Shorts", "Tales"];

  useEffect(() => {
    const minimizeTimer = setTimeout(() => {
      setIsMinimized(true);
    }, 2200);

    return () => {
      clearTimeout(minimizeTimer);
    };
  }, []);

  // Set up scroll reveal animations
  useEffect(() => {
    if (!isMinimized) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealVisible);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Query selector targets elements with the reveal class
    const revealElements = document.querySelectorAll(`.${styles.reveal}`);
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [isMinimized, role]);

  const stripes = [0, 1, 2, 3, 4];

  // Dynamic content based on search parameter ?role=
  const copy = {
    family: {
      heroSub: "100% WHOLESOME SHOWS",
      heroTitle: "Trusted Animation for Your Family",
      heroDesc: "We feed families clean, safe, and trusted video shows. Zero explicit content, pure storytelling, and complete peace of mind for our audience.",
      emailPlaceholder: "Enter your email to start watching",
      emailButtonText: "Start watching",
      bannerHeadline: "Trusted Entertainment Studio",
      bannerDesc: "Every single animation is fully vetted, creating a wholesome environment for your family.",
      bottomCTA: "Coming soon",
      
      // Below the fold sections matching the page.module.css definitions
      section1Eyebrow: "SAFETY STANDARD",
      section1Title: "Pure Shows. Zero Harmful Content.",
      section1Body: "We guarantee that your children will never encounter explicit content, inappropriate language, or aggressive algorithmic triggers on ShowTiva. Our content pipeline combines advanced filtering with rigorous human review to ensure a safe sanctuary.",
      list1Label: "What We Guarantee",
      list1Items: [
        "100% wholesome animation streams",
        "Age-appropriate educational themes",
        "Complete parent-guided interface limits"
      ],
      list2Label: "What We Exclude",
      list2Items: [
        "No violence or explicit graphics",
        "No hidden advertisements or trackers",
        "No unvetted algorithmic auto-play feeds"
      ],
    },
    creator: {
      heroSub: "ELITE CREATOR STUDIO ACCESS",
      heroTitle: "Co-Create the Future of Family Shows",
      heroDesc: "Collaborate with our studio to produce trusted shows. Access is exclusive: you must be invited and pass our vetting checks to earn a spot.",
      emailPlaceholder: "Enter email for invite request",
      emailButtonText: "Request Invite",
      bannerHeadline: "The Ultimate Creator Hub",
      bannerDesc: "Upload stories, collaborate with creators, and showcase films to the world.",
      bottomCTA: "Coming soon",

      // Below the fold sections matching the page.module.css definitions
      section1Eyebrow: "VETTING & STANDARDS",
      section1Title: "Vetted Excellence. Earned Access.",
      section1Body: "ShowTiva works exclusively with highly vetted video creators. Access is based on referral validation and thorough background checks to maintain the absolute safety and quality standards of our platform.",
      list1Label: "What We Demand",
      list1Items: [
        "Background check and reference audits",
        "Original co-production designs",
        "Strict adherence to our audience policies"
      ],
      list2Label: "What We Prohibit",
      list2Items: [
        "No copyright infringements or asset theft",
        "No unverified content submissions",
        "No explicit or borderline adult designs"
      ],
    }
  };

  const activeCopy = isCreator ? copy.creator : copy.family;
  const activeCards = isCreator ? CREATOR_CARDS : FAMILY_CARDS;

  return (
    <main className={`${styles.container} ${isMinimized ? styles.lightBg : ""}`}>
      {/* Intro viewport wrapper to contain the initial cinematic reveal */}
      <div className={styles.intro}>
        {/* Background Video Stripes */}
        <div className={`${styles.stripeContainer} ${isMinimized ? styles.stripeVisible : ""}`}>
          {stripes.map((index) => {
            // Switch video folder based on ?role=
            const videoSrc = isCreator 
              ? `/creator_video_${index + 1}.mp4` 
              : `/bg_video_${index + 1}.mp4`;
            return (
              <div
                key={index}
                className={styles.stripe}
                style={{
                  animationDelay: `${index * 0.3}s`,
                } as React.CSSProperties}
              >
                <video
                  key={`${role}-${index}`}
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={styles.stripeVideo}
                />
              </div>
            );
          })}
          {/* Dark blur overlay */}
          <div className={`${styles.videoOverlay} ${isMinimized ? styles.overlayActive : ""}`}></div>
        </div>

        {/* Centered Hero Writeup */}
        <div className={`${styles.heroWriteup} ${isMinimized ? styles.heroActive : ""}`}>
          <h3 className={styles.heroSub}>{activeCopy.heroSub}</h3>
          <h1 className={styles.heroTitle}>
            {!isCreator ? (
              <>
                Trusted{" "}
                <span style={{ whiteSpace: "nowrap" }}>
                  Family <FlipWords words={rotatingWords} />
                </span>
              </>
            ) : (
              activeCopy.heroTitle
            )}
          </h1>
          <p className={styles.heroDesc}>{activeCopy.heroDesc}</p>
          <div className={styles.emailCollector}>
            <button className={styles.emailButton}>
              <span>Start watching</span>
              <svg className={styles.arrowIconSmall} viewBox="0 0 24 24" width="18" height="18">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Left pattern overlay at start */}
        <div className={styles.patternLeft}></div>
        
        {/* Minimized Logo Link */}
        <div className={`${styles.logoContainer} ${isMinimized ? styles.minimized : ""}`}>
          <Link href={`/?role=${role}`} className={styles.logoLink}>
            <h1 className={styles.logo}>
              <span className={styles.showText}>
                {showLetters.map((char, index) => (
                  <span
                    key={`show-${index}`}
                    className={styles.letter}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              <span className={styles.tivaText}>
                {tivaLetters.map((char, index) => (
                  <span
                    key={`tiva-${index}`}
                    className={styles.letter}
                    style={{ 
                      animationDelay: `${(showLetters.length + index) * 0.08 + 0.05}s` 
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </h1>
          </Link>
        </div>

        {/* Bottom Banner Bar */}
        <div className={styles.writeup}>
          <div className={styles.bannerInfo}>
            <h2 className={styles.headline}>{activeCopy.bannerHeadline}</h2>
            <span className={styles.divider}></span>
            <p className={styles.description}>{activeCopy.bannerDesc}</p>
          </div>
          <button className={styles.ctaButton}>
            <span>{activeCopy.bottomCTA}</span>
          </button>
        </div>
      </div>

      {/* Scrollable details section 1 (Standards & Lists) */}
      <section className={`${styles.section} ${styles.reveal}`}>
        <div className={styles.sectionInner}>
          <div className={styles.splitLayout}>
            <div className={styles.splitText}>
              <span className={styles.eyebrow}>{activeCopy.section1Eyebrow}</span>
              <h2 className={styles.sectionTitle}>{activeCopy.section1Title}</h2>
              <p className={styles.sectionBody}>{activeCopy.section1Body}</p>
              <div className={styles.accentRule} />
              <div className={styles.listColumns}>
                <div>
                  <span className={styles.listLabel}>{activeCopy.list1Label}</span>
                  <ul className={styles.listItems}>
                    {activeCopy.list1Items.map((item) => (
                      <li key={item} className={styles.listItem}>
                        <span className={styles.markYes}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className={styles.listLabel}>{activeCopy.list2Label}</span>
                  <ul className={styles.listItems}>
                    {activeCopy.list2Items.map((item) => (
                      <li key={item} className={styles.listItem}>
                        <span className={styles.markNo}>✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className={styles.splitMedia}>
              <CardStack key={role} items={activeCards} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive Draggable Cartoon Stack */}
      <section className={`${styles.section} ${styles.reveal}`} style={{ borderTop: "none", padding: "0 0 120px 0", zIndex: 10 }}>
        <div className={styles.sectionInner} style={{ position: "relative", minHeight: "80vh", width: "100%", overflow: "visible" }}>
          <DraggableCardContainer className={styles.draggableContainer}>
            <p className={styles.draggableBgText}>
              {!isCreator 
                ? "Drag to explore our safe family shows" 
                : "Drag to preview our creator series catalog"}
            </p>
            {draggableItems.map((item) => (
              <DraggableCardBody 
                key={item.title} 
                className={styles.draggableCard}
                style={item.style}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.draggableImage}
                />
                <h3 className={styles.draggableCardTitle}>
                  {item.title}
                </h3>
              </DraggableCardBody>
            ))}
          </DraggableCardContainer>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Loading ShowTiva...</p>
      </div>
    }>
      <LandingContent />
    </Suspense>
  );
}
