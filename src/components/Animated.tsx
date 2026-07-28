"use client";

import { motion } from "framer-motion";
import { useRef, ComponentPropsWithoutRef } from "react";
import { useInView } from "framer-motion";

/* ─── Easing ─── */
export const AGGRESSIVE_EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Reusable Variants ─── */
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export const blurInUp = {
  initial: { opacity: 0, y: 40, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

/* ─── Scroll Reveal Section ─── */
type RevealProps = ComponentPropsWithoutRef<typeof motion.section>;

export function RevealSection({ children, className, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={blurInUp}
      transition={{ duration: 0.6, ease: AGGRESSIVE_EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

/* ─── Animated heading (hero style) ─── */
export function AnimatedHeading({
  children,
  className,
  delay = 0,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "div";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: AGGRESSIVE_EASE }}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
}

/* ─── Stagger Grid ─── */
export function StaggerGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      transition={{ duration: 0.5, ease: AGGRESSIVE_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Sport Button ─── */
export function SportButton({
  children,
  className,
  onClick,
  type,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, skewX: -1.5 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: AGGRESSIVE_EASE }}
      onClick={onClick}
      type={type}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ─── Card with hover lift ─── */
export function HoverCard({
  children,
  className,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: glow ? "0 0 40px rgba(234, 179, 8, 0.18)" : undefined,
      }}
      transition={{ duration: 0.25, ease: AGGRESSIVE_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
