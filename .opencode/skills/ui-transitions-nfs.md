---
name: ui-transitions-nfs
description: NFS Most Wanted cinematic transition system for Blacklist.cl — framer-motion scroll reveals, aggressive cubic-bezier easings, blur-in, hover skew/scale micro-interactions, staggered children animations.
---

# UI Transitions — NFS Cinematic Motion System

## Philosophy
Every element must feel like it belongs in a game menu or a cinematic cutscene. No pop-in, no fade-jarring. Motion must be aggressive, technical, and responsive — like a tachometer sweeping to redline.

---

## Dependencies

```bash
npm install framer-motion
```

---

## Core Animation Tokens

### Easing Curve (Aggressive Sport)
```ts
const AGGRESSIVE_EASE = [0.16, 1, 0.3, 1] as const;
// Fast start, controlled middle, crisp landing — like a gear shift
```

### Duration Tokens
```ts
const DURATIONS = {
  fast: 0.3,    // micro-interactions, hovers
  normal: 0.5,  // section entrances, card reveals
  slow: 0.8,    // hero reveals, cinematic intros
} as const;
```

---

## Reusable Variants

### Fade In Up (Standard Entrance)
```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};
```

### Fade In Up + Blur (Scroll Reveal)
```tsx
const blurInUp = {
  initial: { opacity: 0, y: 40, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};
```

### Scale In (Hero/Cinematic)
```tsx
const scaleIn = {
  initial: { opacity: 0, scale: 0.92, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};
```

### Stagger Children (Grid/Lists)
```tsx
const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
```

---

## Micro-Interactions (Hover/Active)

### Sport Button Hover
```tsx
<motion.button
  whileHover={{ scale: 1.03, skewX: -1.5 }}
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
>
  {children}
</motion.button>
```

### Card Hover Lift
```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
/>
```

### Glow Pulse on Hover
```tsx
<motion.div
  whileHover={{
    boxShadow: "0 0 30px rgba(234, 179, 8, 0.25)",
  }}
  transition={{ duration: 0.3 }}
/>
```

---

## Scroll-Triggered Reveal (useInView)

```tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function RevealSection({ children, className }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
```

---

## Page-Level Patterns

### Hero Entrance (Full Cinematic)
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
>
  <motion.h1
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
  >
    BLACK LIST CHILE
  </motion.h1>
</motion.div>
```

### Staggered Card Grid
```tsx
<motion.div
  variants={{ initial: {}, animate: { transition: { staggerChildren: 0.15 } } }}
  initial="initial"
  whileInView="animate"
  viewport={{ once: true, margin: "-60px" }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## DOs
- Always use `ease: [0.16, 1, 0.3, 1]` for primary transitions
- Use `useInView` with `once: true` for scroll reveals
- Stagger children at 0.12-0.15s intervals for lists
- Apply blur-in for section reveals (adds depth)
- Use `whileHover` for all interactive elements

## DON'Ts
- Don't use CSS transitions when framer-motion is available
- Don't use linear or default easings — always custom cubic-bezier
- Don't animate everything at once — stagger delays
- Don't exceed 0.8s for most animations (0.5s standard)
- Don't animate elements that are already visible (use `once: true`)
