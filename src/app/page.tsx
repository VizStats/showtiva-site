"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { FlipWords } from "../ui/flip-words";

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
      heroDesc: "We feed families clean, safe, and trusted video shows. Zero explicit content, pure storytelling, and complete peace of mind for parents.",
      emailPlaceholder: "Enter your email to join waitlist",
      emailButtonText: "Join waitlist",
      bannerHeadline: "Trusted Entertainment Studio",
      bannerDesc: "Every single animation is fully vetted for child safety, creating a wholesome environment for your family.",
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
        "Strict adherence to child safety policies"
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
          <form className={styles.emailCollector} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={activeCopy.emailPlaceholder}
              className={styles.emailInput}
              required
            />
            <button type="submit" className={styles.emailButton}>
              <span>{activeCopy.emailButtonText}</span>
              <svg className={styles.arrowIconSmall} viewBox="0 0 24 24" width="18" height="18">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </button>
          </form>
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
              
              <div className={styles.dualList}>
                <div className={styles.listCol}>
                  <h4 className={styles.listLabel}>{activeCopy.list1Label}</h4>
                  <ul className={styles.checkList}>
                    {activeCopy.list1Items.map((item, idx) => (
                      <li key={idx} className={styles.checkItem}>
                        <span className={styles.markYes}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.listCol}>
                  <h4 className={styles.listLabel}>{activeCopy.list2Label}</h4>
                  <ul className={styles.checkList}>
                    {activeCopy.list2Items.map((item, idx) => (
                      <li key={idx} className={styles.checkItem}>
                        <span className={styles.markNo}>✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Split Media Box (Animated CSS Widgets) */}
            <div className={styles.splitMedia}>
              {!isCreator ? (
                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <div className={styles.widgetIndicator}>
                      <span className={styles.widgetPulseGreen}></span>
                      <span className={styles.widgetStatusText}>SHIELD ACTIVE</span>
                    </div>
                    <span className={styles.widgetLogo}>ShowTiva Safeguard™</span>
                  </div>
                  
                  <div className={styles.widgetBody}>
                    <div className={styles.widgetMetricBlock}>
                      <span className={styles.metricLabel}>Daily Show Frames Scanned</span>
                      <span className={styles.metricValue}>142,840</span>
                    </div>
                    
                    <div className={styles.widgetProgressWrapper}>
                      <div className={styles.progressHeader}>
                        <span>Content Integrity Check</span>
                        <span className={styles.progressValue}>100% Secure</span>
                      </div>
                      <div className={styles.progressBarContainer}>
                        <div className={`${styles.progressBar} ${styles.progressFull}`}></div>
                      </div>
                    </div>

                    <div className={styles.widgetTags}>
                      <div className={styles.widgetTag}>
                        <span className={styles.tagDotGreen}></span>
                        <span>0% Explicit content filtered</span>
                      </div>
                      <div className={styles.widgetTag}>
                        <span className={styles.tagDotGreen}></span>
                        <span>Smart Adblock enabled</span>
                      </div>
                      <div className={styles.widgetTag}>
                        <span className={styles.tagDotGreen}></span>
                        <span>Age-Filter limits set</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.widgetCard}>
                  <div className={styles.widgetHeader}>
                    <div className={styles.widgetIndicator}>
                      <span className={styles.widgetPulseRed}></span>
                      <span className={styles.widgetStatusText}>PIPELINE VERIFYING</span>
                    </div>
                    <span className={styles.widgetLogo}>Creator Studio V2</span>
                  </div>
                  
                  <div className={styles.widgetBody}>
                    <div className={styles.widgetMetricBlock}>
                      <span className={styles.metricLabel}>Active Referral Code Vetted</span>
                      <span className={styles.metricValueCode}>ST-9482-OK</span>
                    </div>
                    
                    <div className={styles.widgetProgressWrapper}>
                      <div className={styles.progressHeader}>
                        <span>Background Vetting Status</span>
                        <span className={styles.progressValue}>94% Vetted</span>
                      </div>
                      <div className={styles.progressBarContainer}>
                        <div className={`${styles.progressBar} ${styles.progressCreator}`}></div>
                      </div>
                    </div>

                    <div className={styles.widgetTags}>
                      <div className={styles.widgetTag}>
                        <span className={styles.tagDotRed}></span>
                        <span>Video Safety Sweep: PASS</span>
                      </div>
                      <div className={styles.widgetTag}>
                        <span className={styles.tagDotRed}></span>
                        <span>Vetting Reference Check: OK</span>
                      </div>
                      <div className={styles.widgetTag}>
                        <span className={styles.tagDotGray}></span>
                        <span>Invite Code Activation: PENDING</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Footer bar */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          Show<span>Tiva</span>
        </div>
        <div className={styles.footerNote}>
          © 2026 ShowTiva. All rights reserved.
        </div>
        <div>
          <Link href={`/?role=${isCreator ? "family" : "creator"}`} className={styles.footerLink}>
            {isCreator ? "Switch to Family Site" : "Switch to Creator Site"}
          </Link>
        </div>
      </footer>
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
