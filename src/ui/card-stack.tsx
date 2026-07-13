"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./card-stack.module.css";

export type CardStackItem = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

type CardStackProps = {
  items: CardStackItem[];
  offset?: number;
  scaleFactor?: number;
  flipIntervalMs?: number;
};

export function CardStack({
  items,
  offset = 12,
  scaleFactor = 0.06,
  flipIntervalMs = 5000,
}: CardStackProps) {
  const [cards, setCards] = useState(items);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setCards(items);
  }, [items]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = setInterval(() => {
      setCards((prev) => {
        const next = [...prev];
        next.unshift(next.pop()!);
        return next;
      });
    }, flipIntervalMs);

    return () => clearInterval(interval);
  }, [flipIntervalMs, items, shouldReduceMotion]);

  return (
    <div className={styles.stackRoot}>
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className={styles.stackCard}
          style={{ transformOrigin: "top center" }}
          animate={{
            top: index * -offset,
            scale: 1 - index * scaleFactor,
            zIndex: cards.length - index,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.25, 1, 0.5, 1] }
          }
        >
          <div className={styles.cardContent}>{card.content}</div>
          <div className={styles.cardFooter}>
            <p className={styles.cardName}>{card.name}</p>
            <p className={styles.cardDesignation}>{card.designation}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
