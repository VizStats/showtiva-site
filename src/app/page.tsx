"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const showLetters = ["S", "h", "o", "w"];
  const tivaLetters = ["t", "i", "v", "a"];
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCards, setShowCards] = useState(false);

  const movies = [
    { id: 1, title: "Aero Bot", img: "/kids_movie_1.png", genre: "Sci-Fi / Adventure" },
    { id: 2, title: "Candy Wing", img: "/kids_movie_2.png", genre: "Fantasy / Comedy" },
    { id: 3, title: "Cosmo Paws", img: "/kids_movie_3.png", genre: "Adventure / Space" },
    { id: 4, title: "Byte Forest", img: "/kids_movie_1.png", genre: "Sci-Fi / Nature" },
    { id: 5, title: "Sweet Flight", img: "/kids_movie_2.png", genre: "Fantasy / Magic" },
    { id: 6, title: "Nebula Tail", img: "/kids_movie_3.png", genre: "Space / Comedy" },
  ];

  useEffect(() => {
    // Bounce finishes around 1.7s. We wait 2.2s so the bounce settles, then transition.
    const minimizeTimer = setTimeout(() => {
      setIsMinimized(true);
    }, 2200);

    // Initial logo transition completes by 3.4s. 0.5s later is 3.9s.
    const cardsTimer = setTimeout(() => {
      setShowCards(true);
    }, 3900);

    return () => {
      clearTimeout(minimizeTimer);
      clearTimeout(cardsTimer);
    };
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

      <div className={`${styles.cardsWrapper} ${showCards ? styles.cardsVisible : ""}`}>
        <div className={styles.cardsTrack}>
          {movies.map((movie) => (
            <div key={movie.id} className={styles.card}>
              <div className={styles.cardInner}>
                <img src={movie.img} alt={movie.title} className={styles.cardImage} />
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{movie.title}</h3>
                  <p className={styles.cardGenre}>{movie.genre}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
