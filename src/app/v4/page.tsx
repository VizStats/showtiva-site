"use client";

import { useEffect, useState } from "react";
import styles from "./v4.module.css";

export default function V4() {
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

  return (
    <main className={`${styles.container} ${isMinimized ? styles.lightBg : ""}`}>
      <div className={styles.perspectiveViewport}>
        <div className={`${styles.screen3D} ${isMinimized ? styles.screenVisible : ""}`}>
          <div className={styles.screenGloss}></div>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles.screenVideo}
          >
            <source src="/bg_video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      
      <div className={styles.patternLeft}></div>
      <div className={styles.patternRight}></div>
      
      <div className={`${styles.logoContainer} ${isMinimized ? styles.minimized : ""}`}>
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
      </div>

      <div className={styles.writeup}>
        <h2 className={styles.headline}>
          The Ultimate <br />Cinema Hub
        </h2>
        <p className={styles.description}>
          Stream blockbusters, host watch parties with real-time sync, and explore curated picks tailored just for you. Your screen, your theater.
        </p>
        <button className={styles.ctaButton}>
          <span>Start Watching</span>
          <svg className={styles.arrowIcon} viewBox="0 0 24 24" width="20" height="20">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </div>
    </main>
  );
}
