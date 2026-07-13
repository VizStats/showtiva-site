"use client";

import React, { createContext, useContext, useRef } from "react";
import { motion } from "framer-motion";

const DraggableContainerContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const DraggableCardContainer = ({ children, className }: ContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableContainerContext.Provider value={containerRef}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </DraggableContainerContext.Provider>
  );
};

interface BodyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DraggableCardBody = ({ children, className, style }: BodyProps) => {
  const containerRef = useContext(DraggableContainerContext);

  return (
    <motion.div
      drag
      dragConstraints={containerRef || undefined}
      dragElastic={0.1}
      whileDrag={{ scale: 1.05, rotate: 0, zIndex: 100 }}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      style={{ cursor: "grab", touchAction: "none", ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
