"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
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
    <main className={`${styles.container} ${isMinimized ? styles.lightBg : ""}`}>
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
        <h3 className={styles.heroSub}>NOW STREAMING SHOWTIVA ORIGINAL</h3>
        <h1 className={styles.heroTitle}>Unlimited Movies, <br />TV Shows, and More</h1>
        <p className={styles.heroDesc}>
          Watch anywhere. Cancel anytime. Sync up with friends for the ultimate watch party.
        </p>
        <form className={styles.emailCollector} onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email address"
            className={styles.emailInput}
            required
          />
          <button type="submit" className={styles.emailButton}>
            <span>Get Started</span>
            <svg className={styles.arrowIconSmall} viewBox="0 0 24 24" width="18" height="18">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        </form>
      </div>
      
      <div className={styles.patternLeft}></div>
      
      <div className={`${styles.logoContainer} ${isMinimized ? styles.minimized : ""}`}>
        <Link href="/" className={styles.logoLink}>
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
          <h2 className={styles.headline}>The Ultimate Creator Hub</h2>
          <span className={styles.divider}></span>
          <p className={styles.description}>
            Upload stories, co-edit with creators in real-time, and showcase films to the world.
          </p>
        </div>
        <button className={styles.ctaButton}>
          <span>Coming soon</span>
        </button>
      </div>

    </main>
  );
}
