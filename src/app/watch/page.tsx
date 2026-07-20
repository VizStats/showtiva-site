"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./watch.module.css";

// 4 Hero Carousel Slides matching the Figma Design
const HERO_SLIDES = [
  {
    id: "slide-1",
    duration: "Duration 2h",
    title: "WALL.E",
    description:
      "In the year 2805, Earth is an uninhabitable wasteland abandoned by humanity due to overconsumption and garbage. WALL-E, the last functioning Waste Allocation Load Lifter, spends his days compacting trash and collecting trinkets.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "slide-2",
    duration: "Duration 1h 57m",
    title: "SPIDER-VERSE",
    description:
      "Teen Miles Morales becomes the new Spider-Man and must join forces with five spider-powered heroes from alternate dimensions to stop a threat to all realities.",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "slide-3",
    duration: "Duration 1h 55m",
    title: "THE INCREDIBLES",
    description:
      "A family of undercover superheroes, while trying to live the quiet suburban life, are forced into action to save the world from total destruction.",
    image: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "slide-4",
    duration: "Duration 1h 32m",
    title: "KUNG FU PANDA",
    description:
      "Po the Panda is surprisingly chosen as the Dragon Warrior and must master kung fu to defend the Peace Valley from an evil snow leopard.",
    image: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1600&auto=format&fit=crop",
  },
];

// Sections Data matching the Figma design screenshot
const MOVIE_SECTIONS = [
  {
    id: "trending-now",
    title: "Trending Now",
    titleColor: "normal",
    movies: [
      {
        id: "t1",
        title: "Soul",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
        rating: "6.6",
        year: "2018",
      },
      {
        id: "t2",
        title: "Vivo",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
        rating: "6.6",
        year: "2024",
      },
      {
        id: "t3",
        title: "Home",
        image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=600&auto=format&fit=crop",
        rating: "6.6",
        year: "2025",
      },
      {
        id: "t4",
        title: "Luca",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
        rating: "6.6",
        year: "2024",
      },
      {
        id: "t5",
        title: "Small Foot",
        image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=600&auto=format&fit=crop",
        rating: "6.6",
        year: "2020",
      },
    ],
  },
  {
    id: "movies",
    title: "Movies",
    titleColor: "yellow",
    movies: [
      {
        id: "m1",
        title: "The Good Dinosaur",
        image: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=600&auto=format&fit=crop",
        rating: "6.6",
        year: "2024",
      },
      {
        id: "m2",
        title: "David",
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop",
        rating: "6.6",
        year: "2026",
      },
      {
        id: "m3",
        title: "Wall-E",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
        rating: "6.6",
        year: "2023",
      },
      {
        id: "m4",
        title: "Soul",
        image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=600&auto=format&fit=crop",
        rating: "6.6",
        year: "2018",
      },
      {
        id: "m5",
        title: "Vivo",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
        rating: "6.6",
        year: "2024",
      },
    ],
  },
  {
    id: "cartoons-animation",
    title: "Cartoons & Animation",
    titleColor: "normal",
    movies: [
      {
        id: "c1",
        title: "Inside Out 2",
        image: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=600&auto=format&fit=crop",
        rating: "8.1",
        year: "2024",
      },
      {
        id: "c2",
        title: "Moana 2",
        image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=600&auto=format&fit=crop",
        rating: "7.8",
        year: "2024",
      },
      {
        id: "c3",
        title: "Across Spider-Verse",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
        rating: "8.7",
        year: "2023",
      },
      {
        id: "c4",
        title: "Elemental",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
        rating: "7.0",
        year: "2023",
      },
      {
        id: "c5",
        title: "Turning Red",
        image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=600&auto=format&fit=crop",
        rating: "7.0",
        year: "2022",
      },
    ],
  },
  {
    id: "wholesome-series",
    title: "Wholesome Series",
    titleColor: "yellow",
    movies: [
      {
        id: "s1",
        title: "Bluey Adventures",
        image: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=600&auto=format&fit=crop",
        rating: "9.5",
        year: "2024",
      },
      {
        id: "s2",
        title: "Airbender Chronicles",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
        rating: "9.2",
        year: "2024",
      },
      {
        id: "s3",
        title: "Hilda Tales",
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop",
        rating: "8.6",
        year: "2023",
      },
      {
        id: "s4",
        title: "Gravity Falls",
        image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=600&auto=format&fit=crop",
        rating: "8.9",
        year: "2022",
      },
      {
        id: "s5",
        title: "DuckTales",
        image: "https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=600&auto=format&fit=crop",
        rating: "8.2",
        year: "2023",
      },
    ],
  },
];

export default function WatchPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTabs, setActiveTabs] = useState<{ [key: string]: string }>({
    "trending-now": "popular",
    movies: "popular",
    "cartoons-animation": "popular",
    "wholesome-series": "popular",
  });

  // Auto-advance hero slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (sectionId: string, tabKey: string) => {
    setActiveTabs((prev) => ({ ...prev, [sectionId]: tabKey }));
  };

  return (
    <div className={styles.watchContainer}>
      {/* Top Navbar */}
      <header className={styles.watchHeader}>
        <Link href="/" className={styles.logo}>
          SHOW<span>TIVA</span>
        </Link>

        {/* Right Nav Utility Icons */}
        <div className={styles.navActions}>
          <button className={styles.iconBtn} aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button className={styles.iconBtn} aria-label="Notifications">
            <span className={styles.notificationBadge} />
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <button className={styles.iconBtn} aria-label="Profile">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <section className={styles.heroBanner}>
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={slide.id}
              className={`${styles.slideContainer} ${isActive ? styles.activeSlide : ""}`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={styles.heroImageLayer}
              />
              <div className={styles.heroGradientOverlay} />

              <div className={styles.heroContent}>
                <span className={styles.durationTag}>{slide.duration}</span>
                <h1 className={styles.heroTitle}>{slide.title}</h1>
                <p className={styles.heroDesc}>{slide.description}</p>

                <div className={styles.heroBtnGroup}>
                  {/* Watch Now Red Pill */}
                  <button className={styles.watchNowBtn}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Watch Now</span>
                  </button>

                  {/* Add List Dark Pill */}
                  <button className={styles.addListBtn}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add List</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Pagination Controls */}
        <div className={styles.carouselDashContainer}>
          {HERO_SLIDES.map((_, index) => (
            <button
              key={`dash-${index}`}
              onClick={() => setActiveSlide(index)}
              className={`${styles.dashBar} ${index === activeSlide ? styles.activeDashBar : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Main Browse Section */}
      <main className={styles.watchMain}>
        {MOVIE_SECTIONS.map((section) => {
          const currentTab = activeTabs[section.id] || "popular";
          const isYellowTitle = section.titleColor === "yellow";

          return (
            <section key={section.id} id={section.id} className={styles.movieSection}>
              {/* Section Header with Filter Toolbar */}
              <div className={styles.sectionHeaderRow}>
                <h2 className={`${styles.sectionTitle} ${isYellowTitle ? styles.sectionTitleYellow : ""}`}>
                  {section.title}
                </h2>

                <div className={styles.filterTabs}>
                  <button
                    onClick={() => handleTabChange(section.id, "popular")}
                    className={`${styles.filterTabBtn} ${currentTab === "popular" ? styles.activeFilterTabBtn : ""}`}
                  >
                    <span>🔥</span> Popular
                  </button>
                  <button
                    onClick={() => handleTabChange(section.id, "premieres")}
                    className={`${styles.filterTabBtn} ${currentTab === "premieres" ? styles.activeFilterTabBtn : ""}`}
                  >
                    <span>★</span> Premieres
                  </button>
                  <button
                    onClick={() => handleTabChange(section.id, "recent")}
                    className={`${styles.filterTabBtn} ${currentTab === "recent" ? styles.activeFilterTabBtn : ""}`}
                  >
                    <span>+</span> Recently Added
                  </button>
                </div>
              </div>

              {/* 5-Column Movie Poster Grid */}
              <div className={styles.posterGrid}>
                {section.movies.map((movie) => (
                  <div key={movie.id} className={styles.posterCard}>
                    <div className={styles.posterWrapper}>
                      <img
                        src={movie.image}
                        alt={movie.title}
                        loading="lazy"
                        className={styles.posterImg}
                      />
                      <div className={styles.posterOverlay}>
                        <div className={styles.playBtnCircle}>
                          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className={styles.posterInfo}>
                      <h4 className={styles.posterTitle}>{movie.title}</h4>
                      <div className={styles.posterMeta}>
                        <div className={styles.metaLeft}>
                          <span className={styles.metaHeart}>♥</span>
                          <span className={styles.metaEye}>👁</span>
                          <span className={styles.ratingStar}>★ {movie.rating}</span>
                        </div>
                        <span className={styles.metaYear}>{movie.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
