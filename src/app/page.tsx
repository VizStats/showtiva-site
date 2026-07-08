"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

const contentData = {
  family: {
    heroSub: "0% EXPLICIT CONTENT GUARANTEE",
    heroTitle: "Trusted Cartoon Animations, Made Safe for Kids",
    heroDesc: "Watch wholesome cartoons screened by advanced AI and vetted by parents. Enter your email for early access to the pilot launch.",
    emailPlaceholder: "Enter parent email address",
    emailButton: "Get Early Access",
    bannerHeadline: "The Ultimate Family Space",
    bannerDesc: "Entertaining cartoons custom-crafted by verified professional creators under rigorous safety checks.",
    sections: [
      {
        title: "Our Safety Standard",
        text: "Every animation on Show Tiva passes through a double-vetting pipeline: real-time AI scanning for inappropriate content, followed by manual review by our parent panel. We guarantee a completely safe screen environment for your children, free from explicit elements, hidden mature themes, or aggressive advertising."
      },
      {
        title: "Vetted Professional Animators",
        text: "Our cartoons are not AI-generated gibberish. They are created by hand-picked professional artists and animators from around the world. These creators are carefully background-checked, vetted, and operate on an invite-only basis to ensure that only the most responsible stories reach your screen."
      }
    ]
  },
  creator: {
    heroSub: "INVITE-ONLY CREATOR NETWORK",
    heroTitle: "Co-Create the Future of Wholesome Cinema",
    heroDesc: "Produce animations for families who value trust. Apply to join our vetted creator network. Enter your email to begin your vetting application.",
    emailPlaceholder: "Enter creator email address",
    emailButton: "Apply to Join",
    bannerHeadline: "The Ultimate Creator Hub",
    bannerDesc: "A vetted referral-only network for responsible animators. Get fair revenue share and co-creation tools.",
    sections: [
      {
        title: "Our Aim & Content Guidelines",
        text: "Our sole mission is to feed families premium, trusted cartoon animations. We accept beautiful, high-quality character-driven stories, educational shorts, and wholesome fantasy cartoons. We strictly reject explicit themes, mature language, violence, or unmoderated AI-generated content. All creators undergo professional background checks before being approved."
      },
      {
        title: "Connecting with Trusted Families",
        text: "Show Tiva connects vetted filmmakers directly with millions of safety-conscious parents. As a creator, you earn a spot on our platform through strict referral codes. Once vetted, you get access to fair royalty splits, real-time co-production tools, and a high-trust audience eager to watch your films."
      }
    ]
  }
};

function HomeContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") === "creator" ? "creator" : "family";
  const content = contentData[role];

  const showLetters = ["S", "h", "o", "w"];
  const tivaLetters = ["T", "i", "v", "a"];
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const minimizeTimer = setTimeout(() => {
      setIsMinimized(true);
    }, 2200);

    return () => {
      clearTimeout(minimizeTimer);
    };
  }, []);

  const stripes = [0, 1, 2, 3, 4];

  return (
    <main className={styles.container}>
      {/* First Fold (Viewport Height container) */}
      <div className={`${styles.firstFold} ${isMinimized ? styles.lightBg : ""}`}>
        <div className={`${styles.stripeContainer} ${isMinimized ? styles.stripeVisible : ""}`}>
          {stripes.map((index) => {
            const videoSrc = `/bg_video_${index + 1}.mp4`;
            return (
              <div
                key={index}
                className={styles.stripe}
                style={{
                  animationDelay: `${index * 0.3}s`,
                } as React.CSSProperties}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={styles.stripeVideo}
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              </div>
            );
          })}
          {/* Dark blur overlay */}
          <div className={`${styles.videoOverlay} ${isMinimized ? styles.overlayActive : ""}`}></div>
        </div>

        {/* Centered Hero Writeup */}
        <div className={`${styles.heroWriteup} ${isMinimized ? styles.heroActive : ""}`}>
          <h3 className={styles.heroSub}>{content.heroSub}</h3>
          <h1 className={styles.heroTitle}>{content.heroTitle}</h1>
          <p className={styles.heroDesc}>{content.heroDesc}</p>
          <form className={styles.emailCollector} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={content.emailPlaceholder}
              className={styles.emailInput}
              required
            />
            <button type="submit" className={styles.emailButton}>
              <span>{content.emailButton}</span>
              <svg className={styles.arrowIconSmall} viewBox="0 0 24 24" width="18" height="18">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </button>
          </form>
        </div>
        
        <div className={styles.patternLeft}></div>
        
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

        <div className={styles.writeup}>
          <div className={styles.bannerInfo}>
            <h2 className={styles.headline}>{content.bannerHeadline}</h2>
            <span className={styles.divider}></span>
            <p className={styles.description}>{content.bannerDesc}</p>
          </div>
          <button className={styles.ctaButton}>
            <span>Coming soon</span>
          </button>
        </div>
      </div>

      {/* Second Fold (Scrollable Details Area) */}
      {isMinimized && (
        <div className={styles.belowFold}>
          {content.sections.map((section, idx) => (
            <div key={idx} className={styles.foldSection}>
              <h2 className={styles.foldTitle}>{section.title}</h2>
              <p className={styles.foldText}>{section.text}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

// Fallback skeleton loader to render cleanly during Suspense build generation
function HomeFallback() {
  const showLetters = ["S", "h", "o", "w"];
  const tivaLetters = ["T", "i", "v", "a"];
  const stripes = [0, 1, 2, 3, 4];

  return (
    <main className={styles.container}>
      <div className={styles.firstFold}>
        <div className={styles.stripeContainer}>
          {stripes.map((index) => (
            <div key={index} className={styles.stripe}></div>
          ))}
        </div>
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>
            <span className={styles.showText}>
              {showLetters.map((char, index) => (
                <span key={`show-${index}`} className={styles.letter}>{char}</span>
              ))}
            </span>
            <span className={styles.tivaText}>
              {tivaLetters.map((char, index) => (
                <span key={`tiva-${index}`} className={styles.letter}>{char}</span>
              ))}
            </span>
          </h1>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
