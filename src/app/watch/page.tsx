"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "./watch.module.css";

// 4 Hero Slider Movies matching the Figma Design specification
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

// 12 Wholesome categories for classification
const CATEGORY_NAMES = [
  "Wholesome Cartoons",
  "Fantasy & Wonders",
  "Action & Expeditions",
  "Family & Friendship",
  "Adventure Chronicles",
  "Sci-Fi & Cosmos",
  "Wholesome Tales",
  "Mystery & Legends",
  "Nature & Landscapes",
  "Retro Pixels",
  "Little Explorers",
  "Creative Canvas"
];

const TITLES_POOL = [
  "Starlit Skyward Dreams",
  "Neon City Midnight Sketch",
  "Enchanted Forest Journey",
  "The Lost Kingdom Gates",
  "Chibi Quest & The Magic Key",
  "Cyber Legend Chronicles",
  "Magical Forest Path",
  "Little Panda Chronicles",
  "Cosmic Stardust Voyage",
  "Undersea Kingdom Secrets",
  "Skyward Balloon Escapade",
  "Winter Wonderland Magic",
  "Cozy Woodside Cottage",
  "Retro Arcade Pixels",
  "Magical Bookstore Mystery",
  "Dreamland Express Train",
  "Whimsical Garden Party",
  "Curious Fox Explorers",
  "Flying Castle Expedition",
  "Robot Buddy Adventures"
];

const GENRES = ["Animation", "Family Story", "Adventure", "Fantasy", "Sci-Fi", "Comedy", "Wholesome"];
const RATINGS = ["TV-G", "TV-Y7", "TV-Y", "G"];

const UNSPLASH_IDS = [
  "photo-1534447677768-be436bb09401",
  "photo-1607604276583-eef5d076aa5f",
  "photo-1581833971358-2c8b550f87b3",
  "photo-1518709268805-4e9042af9f23",
  "photo-1618336753974-aae8e04506aa",
  "photo-1569003339405-ea396a5a8a90",
  "photo-1579783900882-c0d3dad7b119",
  "photo-1541562232579-512a21360020",
  "photo-1501854140801-50d01698950b",
  "photo-1518173946687-a4c8892bbd9f"
];

export default function WatchPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("popular");

  // Auto-advance hero slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Generate and categorize 300 items deterministically using useMemo
  const categories = useMemo(() => {
    const cardPool = Array.from({ length: 300 }, (_, i) => {
      const title = TITLES_POOL[i % TITLES_POOL.length];
      const imageId = UNSPLASH_IDS[i % UNSPLASH_IDS.length];
      const genre = GENRES[(i * 3) % GENRES.length];
      const rating = RATINGS[(i * 7) % RATINGS.length];
      const durationMin = 5 + (i * 4) % 25;
      const height = 200 + (i % 4) * 60;

      return {
        id: `show-card-${i}`,
        title: `${title} - Episode ${Math.floor(i / TITLES_POOL.length) + 1}`,
        image: `https://images.unsplash.com/${imageId}?q=80&w=600&auto=format&fit=crop`,
        genre,
        rating,
        duration: `${durationMin} mins`,
        heightStyle: { height: `${height}px` }
      };
    });

    const chunkSize = 25;
    return CATEGORY_NAMES.map((name, catIndex) => {
      const start = catIndex * chunkSize;
      const cards = cardPool.slice(start, start + chunkSize);
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return {
        id,
        name,
        cards
      };
    });
  }, []);

  return (
    <div className={styles.watchContainer}>
      {/* Top Navbar */}
      <header className={styles.watchHeader}>
        <Link href="/" className={styles.logo}>
          SHOW<span>TIVA</span>
        </Link>
        
        {/* Right Nav Utility Icons */}
        <div className={styles.navActions}>
          {/* Search Icon Button */}
          <button className={styles.iconBtn} aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Bell Notifications Button */}
          <button className={styles.iconBtn} aria-label="Notifications">
            <span className={styles.notificationBadge} />
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* User Profile Button */}
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

        {/* Carousel Pagination Controls (Dash Lines) */}
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
        {/* Trending Now Header & Filters Row */}
        <div className={styles.trendingHeaderRow}>
          <h2 className={styles.trendingTitle}>Trending Now</h2>
          <div className={styles.filterTabs}>
            <button
              onClick={() => setActiveTab("popular")}
              className={`${styles.filterTabBtn} ${activeTab === "popular" ? styles.activeFilterTabBtn : ""}`}
            >
              <span>🔥</span> Popular
            </button>
            <button
              onClick={() => setActiveTab("premieres")}
              className={`${styles.filterTabBtn} ${activeTab === "premieres" ? styles.activeFilterTabBtn : ""}`}
            >
              <span>★</span> Premieres
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`${styles.filterTabBtn} ${activeTab === "recent" ? styles.activeFilterTabBtn : ""}`}
            >
              <span>+</span> Recently Added
            </button>
          </div>
        </div>

        {/* Content wrapper splitting sidebar and feed */}
        <div className={styles.watchContentWrapper}>
          
          {/* Left Navigation Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              <div className={styles.sidebarTitle}>Categories</div>
              <nav className={styles.sidebarNav}>
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`#${category.id}`}
                    className={styles.sidebarLink}
                  >
                    {category.name}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Main Feed */}
          <div className={styles.mainFeed}>
            {categories.map((category) => (
              <section key={category.id} id={category.id} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h3 className={styles.categoryTitle}>{category.name}</h3>
                </div>

                <div className={styles.masonryGrid}>
                  {category.cards.map((card) => (
                    <div key={card.id} className={styles.gridItem}>
                      <div className={styles.videoCard}>
                        
                        <div className={styles.imageWrapper} style={card.heightStyle}>
                          <div className={styles.badge}>{card.rating}</div>
                          <img
                            src={card.image}
                            alt={card.title}
                            loading="lazy"
                            className={styles.videoThumbnail}
                          />
                          <div className={styles.playOverlay}>
                            <div className={styles.playCircle}>
                              <svg
                                className={styles.playIcon}
                                viewBox="0 0 24 24"
                                width="26"
                                height="26"
                                fill="currentColor"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className={styles.cardDetails}>
                          <h4 className={styles.cardTitle}>{card.title}</h4>
                          <div className={styles.cardMeta}>
                            <span className={styles.genre}>{card.genre}</span>
                            <span className={styles.duration}>{card.duration}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
