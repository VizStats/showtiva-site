"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const showLetters = ["S", "h", "o", "w"];
  const tivaLetters = ["t", "i", "v", "a"];
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Bounce finishes around 1.7s. We wait 2.2s so the bounce settles, then transition.
    const timer = setTimeout(() => {
      setIsMinimized(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={`${styles.container} ${isMinimized ? styles.lightBg : ""}`}>
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
    </main>
  );
}
