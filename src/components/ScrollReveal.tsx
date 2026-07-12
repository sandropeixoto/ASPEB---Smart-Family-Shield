import React, { ReactNode } from "react";
import { motion } from "motion/react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  id?: string;
}

/**
 * ScrollReveal Component
 * Applies a smooth fade-in and slide-up effect when children enter the viewport.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 35,
  className = "",
  id,
}: ScrollRevealProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Premium custom cubic bezier curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
