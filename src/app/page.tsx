"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const showLetters = ["S", "h", "o", "w"];
  const tivaLetters = ["t", "i", "v", "a"];
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
      </div>
      
      <div className={styles.patternLeft}></div>
      <div className={styles.patternRight}></div>
      
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
          <h2 className={styles.headline}>The Ultimate Cinema Hub</h2>
          <span className={styles.divider}></span>
          <p className={styles.description}>
            Stream blockbusters, host watch parties with real-time sync, and explore curated picks.
          </p>
        </div>
        <button className={styles.ctaButton}>
          <span>Start Watching</span>
          <svg className={styles.arrowIcon} viewBox="0 0 24 24" width="20" height="20">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </div>

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="horizontalWave" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,0.85 C 0.75,0.7 0.25,1.0 0,0.85 Z" />
          </clipPath>
        </defs>
      </svg>
    </main>
  );
}
