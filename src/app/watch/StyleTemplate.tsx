"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { generateWatchData } from "./watchData";

// Import all 7 style stylesheets
import style1 from "./style1/style1.module.css";
import style2 from "./style2/style2.module.css";
import style3 from "./style3/style3.module.css";
import style4 from "./style4/style4.module.css";
import style5 from "./style5/style5.module.css";
import style6 from "./style6/style6.module.css";
import style7 from "./style7/style7.module.css";

const stylesMap: Record<number, any> = {
  1: style1,
  2: style2,
  3: style3,
  4: style4,
  5: style5,
  6: style6,
  7: style7
};

interface StyleTemplateProps {
  styleNum: number;
}

export default function StyleTemplate({ styleNum }: StyleTemplateProps) {
  const styles = stylesMap[styleNum] || style1;

  // Generate 300 cards (25 per category across 12 categories)
  // For style 7 (Horizontal rails), we can make card height uniform (e.g. 180px) to form a neat row
  const categories = useMemo(() => {
    if (styleNum === 7) {
      return generateWatchData(180, 0); // Flat uniform heights for carousel
    }
    return generateWatchData(300, 80); // Varied heights for masonry
  }, [styleNum]);

  // Design descriptions for headers
  const styleDescriptions: Record<number, string> = {
    1: "Minimalist Slate Cinematic — Ultra-clean dark theme with slate gray details.",
    2: "Neon Glassmorphic Glow — Translucent glass panels with glowing cybernetic borders.",
    3: "Classic Netflix Grid — Flat solid cards, sharp corners, and high contrast typography.",
    4: "Retro Warm Charcoal — Organic clay tones, cozy rounded edges, and warm text.",
    5: "Swiss Bold Editorial — Heavy flat strokes, box outlines, and striking stark contrasts.",
    6: "Wholesome Pastel Dream — Bubbly rounded cards with ambient pastel aura backdrops.",
    7: "Horizontal Carousel Lanes — Scrollable category rails mimicking modern TV streaming dashboards."
  };

  return (
    <div className={styles.watchContainer}>
      
      {/* Ambient pastel glow lights only for Style 6 */}
      {styleNum === 6 && (
        <>
          <div className={styles.glowLight1} />
          <div className={styles.glowLight2} />
        </>
      )}

      {/* Sticky Header */}
      <header className={styles.watchHeader}>
        <Link href="/" className={styles.logo}>
          Show<span>Tiva</span>
        </Link>
        
        {/* Style Preview Navigation Switcher */}
        <div className={styles.styleSwitcher}>
          <span className={styles.switcherLabel}>Preview:</span>
          <div className={styles.switcherLinks}>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <Link
                key={num}
                href={`/watch/style${num}`}
                className={num === styleNum ? styles.activeStyleBtn : styles.styleBtn}
              >
                Style {num}
              </Link>
            ))}
          </div>
        </div>

        <button className={styles.signUpBtn}>
          Sign Up
        </button>
      </header>

      {/* Main Browse Section */}
      <main className={styles.watchMain}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Vetted Catalog</h1>
          <p className={styles.pageSubtitle}>
            {styleDescriptions[styleNum] || styleDescriptions[1]}
          </p>
        </div>

        {/* Content split wrapper */}
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
                  <h2 className={styles.categoryTitle}>{category.name}</h2>
                </div>

                {/* If Style 7, render Horizontal Scroll Container instead of Masonry Grid */}
                {styleNum === 7 ? (
                  <div className={styles.carouselWrapper}>
                    <div className={styles.carouselContainer}>
                      {category.cards.map((card) => (
                        <div key={card.id} className={styles.carouselItem}>
                          <div className={styles.videoCard}>
                            
                            <div className={styles.imageWrapper} style={card.heightStyle}>
                              <div className={styles.badge}>{card.rating}</div>
                              <img
                                src={card.image}
                                alt={card.title}
                                className={styles.videoThumbnail}
                                loading="lazy"
                              />
                              <div className={styles.playOverlay}>
                                <div className={styles.playCircle}>
                                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className={styles.cardDetails}>
                              <h3 className={styles.cardTitle}>{card.title}</h3>
                              <div className={styles.cardMeta}>
                                <span className={styles.genre}>{card.genre}</span>
                                <span className={styles.duration}>{card.duration}</span>
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Standard Masonry Grid for Styles 1-6 */
                  <div className={styles.masonryGrid}>
                    {category.cards.map((card) => (
                      <div key={card.id} className={styles.gridItem}>
                        <div className={styles.videoCard}>
                          
                          <div className={styles.imageWrapper} style={card.heightStyle}>
                            <div className={styles.badge}>{card.rating}</div>
                            <img
                              src={card.image}
                              alt={card.title}
                              className={styles.videoThumbnail}
                              loading="lazy"
                            />
                            <div className={styles.playOverlay}>
                              <div className={styles.playCircle}>
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          <div className={styles.cardDetails}>
                            <h3 className={styles.cardTitle}>{card.title}</h3>
                            <div className={styles.cardMeta}>
                              <span className={styles.genre}>{card.genre}</span>
                              <span className={styles.duration}>{card.duration}</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
