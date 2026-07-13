"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import styles from "./watch.module.css";
import { generateWatchData } from "./watchData";

export default function WatchPage() {
  // Generate and categorize 300 items deterministically using useMemo
  const categories = useMemo(() => {
    return generateWatchData(300, 80);
  }, []);

  return (
    <div className={styles.watchContainer}>
      {/* Sticky Header */}
      <header className={styles.watchHeader}>
        <Link href="/" className={styles.logo}>
          Show<span>Tiva</span>
        </Link>
        <button className={styles.signUpBtn}>
          Sign Up
        </button>
      </header>

      {/* Main Browse Section */}
      <main className={styles.watchMain}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Vetted Show Catalog</h1>
          <p className={styles.pageSubtitle}>
            100% wholesome cartoon and film streams. Zero explicit algorithms.
          </p>
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
            {/* Scrollable Category Blocks */}
            {categories.map((category) => (
              <section key={category.id} id={category.id} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>{category.name}</h2>
                </div>

                {/* CSS-Columns Masonry Grid for this Category */}
                <div className={styles.masonryGrid}>
                  {category.cards.map((card) => (
                    <div key={card.id} className={styles.gridItem}>
                      <div className={styles.videoCard}>
                        
                        {/* Thumbnail and Overlay Badge */}
                        <div className={styles.imageWrapper} style={card.heightStyle}>
                          <div className={styles.badge}>{card.rating}</div>
                          <img
                            src={card.image}
                            alt={card.title}
                            loading="lazy"
                            className={styles.videoThumbnail}
                          />
                          {/* Glassmorphic Play Icon Overlay */}
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

                        {/* Details Footer */}
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
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
