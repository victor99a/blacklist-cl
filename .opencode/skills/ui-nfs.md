---
name: ui-nfs
description: NFS Most Wanted 2005 + Fast & Furious 1 visual design system for Blacklist.cl — night-asphalt atmosphere, rain/humidity effects, neon green NOS accents, gold blacklist glow, glitch/start-screen HUD, cinematic grain, underground street racing aesthetic.
---

# NFS Most Wanted (2005) + Fast & Furious UI/UX — Blacklist.cl

## Design Philosophy
Night-asphalt atmosphere, underground street racing, cinematic humidity. Every pixel should feel like 2AM on an empty industrial road — wet asphalt, neon reflections, carbon fiber, brushed aluminum, amber dashboard glow. No flat corporate design. No SaaS. This is **Midnight Club meets 2 Fast 2 Furious**.

---

## Atmosphere & Textures

### Background Base
- `#0A0A0C` (Carbon Black) — primary
- `#18181B` (Asphalt Grey) — surface
- `bg-zinc-950` / `bg-zinc-900` in Tailwind

### Rain / Wet Asphalt Effect
```css
/* Subtle rain streaks */
&::before {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255,255,255,0.008) 2px,
    rgba(255,255,255,0.008) 4px
  );
  pointer-events: none;
}
```

### Cinematic Film Grain
```css
&::after {
  content: '';
  position: absolute; inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,...");
  background-repeat: repeat;
  pointer-events: none;
}
```

### Metallic Grid (Dashboard / HUD)
```css
background-image:
  linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
background-size: 40px 40px;
```

---

## Color Palette

| Role | Tailwind | Hex |
|------|----------|-----|
| Carbon Black (base) | `bg-zinc-950` | `#0A0A0C` |
| Asphalt Grey (surface) | `bg-zinc-900` | `#18181B` |
| Wet Asphalt | `bg-zinc-900/80` | — |
| **MW Gold (Blacklist)** | `text-yellow-500` `border-yellow-500` `bg-yellow-500` | `#EAB308` |
| **NOS Neon Green** | `text-emerald-400` `border-emerald-500` `bg-emerald-500` | `#10B981` / `#34D399` |
| Crimson Warning | `text-red-500` `border-red-500/30` | `#EF4444` |
| Nitro Orange | `text-orange-500` | `#F97316` |
| Steel Chrome | `text-zinc-400` `border-zinc-700` | `#9CA3AF` / `#374151` |
| Dashboard Dim | `text-zinc-600` | `#52525B` |

---

## Typography & HUD

| Element | Style |
|---------|-------|
| **Hero / Title** | `font-black uppercase italic tracking-[0.02em] text-zinc-100` — giant, 80px+ |
| **Section Header** | `font-black uppercase italic tracking-[0.15em] text-zinc-100 hud-header` |
| **HUD Sub-label** | `font-extrabold uppercase italic tracking-wider text-yellow-400/90` |
| **Telemetry / Specs** | `font-mono text-xs tracking-widest text-zinc-400` |
| **Badges / Tags** | `text-[10px] font-semibold uppercase tracking-[0.2em]` |
| **Rank Number (#01)** | `text-6xl font-black italic` — gold glow for top 3 |
| **Glitch Text** | `@keyframes glitch { ... }` — clip displacement on hover |

### Glitch Animation
```css
@keyframes glitch {
  0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); }
  20% { clip-path: inset(92% 0 1% 0); transform: translate(1px, -3px); }
  40% { clip-path: inset(43% 0 1% 0); transform: translate(-1px, 3px); }
  60% { clip-path: inset(25% 0 58% 0); transform: translate(3px, 1px); }
  80% { clip-path: inset(54% 0 7% 0); transform: translate(-3px, -2px); }
  100% { clip-path: inset(58% 0 43% 0); transform: translate(2px, 1px); }
}
```

---

## Component Architecture

### 1. NFS Start Screen / Menu Panel
- Fullscreen overlay with dimmed background
- "PRESS START // ENTRAR AL SAFEHOUSE" — blinking cursor effect
- Pilot License form: username, avatar, tagline
- `bg-black/90 backdrop-blur-md border border-zinc-800`
- Neon green cursor blink: `@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }`

### 2. Hero / Cinematic Banner
- Full viewport height, carbon + grid + rain overlay stack
- Giant title with `drop-shadow-[0_0_30px_rgba(234,179,8,0.15)]`
- Bottom gradient fade: `bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950`
- CTA buttons with neon green "NOS" secondary variant

### 3. Blackrank Cards (Top 3)
- Rank #01 with golden glow: `drop-shadow-[0_0_16px_rgba(234,179,8,0.4)]`
- Angled/diagonal corners via `clip-path: polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)`
- Image placeholder with `bg-gradient-to-br from-zinc-800/50 to-zinc-950`
- Bottom specs bar: power/mods/respect segmented meters
- Tags: `[VERIFIED WORKSHOP]` in emerald, `[BOUNTY X PTS]` in red

### 4. Stats / HUD Bar (Segmented)
```tsx
<div className="flex gap-[2px]">
  {Array.from({ length: 10 }).map((_, i) => (
    <div key={i}
      className={`h-1.5 flex-1 ${i < value ? 'bg-yellow-500 shadow-[0_0_4px_rgba(234,179,8,0.3)]' : 'bg-zinc-800'}`}
    />
  ))}
</div>
```

### 5. Buttons

| Variant | Classes |
|---------|---------|
| **Primary (Gold)** | `bg-yellow-500 text-black font-bold uppercase tracking-[0.2em] px-10 py-4 hover:brightness-110 hover:-translate-y-0.5` |
| **Secondary (NOS Green)** | `border border-emerald-500/40 text-emerald-400 font-bold uppercase tracking-[0.2em] px-10 py-4 hover:bg-emerald-500/10 hover:border-emerald-500/70` |
| **Ghost (Steel)** | `border border-zinc-700 text-zinc-400 uppercase tracking-[0.2em] px-10 py-4 hover:border-yellow-500/40 hover:text-yellow-400` |
| **Skew CTA** | Sliding pseudo-element `skew-x-[-12deg]` with `bg-yellow-500/10` over 500ms |

### 6. Login / Register (Pilot License)
- Form card: `bg-zinc-950/90 border border-zinc-800 backdrop-blur-md`
- Input fields: `bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono tracking-wider`
- Focus: `focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20`
- Submit: Primary gold button
- Divider with `[ O ]` or `[ // ]` separator

### 7. Badges & Tags
- `[RESPECT +1]` → `text-yellow-500/80 border-l-2 border-yellow-500 pl-2 text-[10px]`
- `[BOUNTY: 2,400 PTS]` → `bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px]`
- `[VERIFIED WORKSHOP]` → `text-emerald-400/80 text-[10px]`
- `[NOS READY]` → `text-emerald-400 border-emerald-500/30 text-[10px]`

---

## Animation & Motion

- **Hover transitions**: `transition-all duration-300`
- **Entrance**: `animate-in fade-in slide-in-from-bottom-4 duration-700` (if tailwindcss-animate available)
- **Stagger**: children at `delay-100`, `delay-200`, `delay-300`
- **Glitch trigger**: on hover for hero titles
- **Cursor blink**: `@keyframes blink` for start-screen text
- **No bouncy easings**: use `ease-out` or `ease-in-out`

---

## Tailwind v4 Theme Tokens (add to `@theme {}`)

```css
@theme {
  /* Surfaces */
  --color-nfs-bg: #0A0A0C;
  --color-nfs-surface: #18181B;
  --color-nfs-elevated: #1F2128;

  /* Gold (Blacklist) */
  --color-nfs-gold: #EAB308;
  --color-nfs-amber: #D97706;
  --color-nfs-brass: #E5A93B;
  --color-nfs-glow: rgba(234, 179, 8, 0.2);

  /* Neon (NOS/Underground) */
  --color-nfs-neon: #10B981;
  --color-nfs-neon-light: #34D399;
  --color-nfs-neon-glow: rgba(16, 185, 129, 0.2);

  /* Danger */
  --color-nfs-danger: #EF4444;
  --color-nfs-orange: #F97316;
  --color-nfs-heat: rgba(239, 68, 68, 0.15);

  /* Chrome */
  --color-nfs-steel-900: #374151;
  --color-nfs-steel-500: #6B7280;
  --color-nfs-steel-300: #9CA3AF;

  /* Glass */
  --color-nfs-glass: rgba(0, 0, 0, 0.85);
  --color-nfs-glass-border: rgba(63, 63, 70, 0.5);

  /* Fonts */
  --font-sans: 'Oswald', 'Titillium Web', 'Inter', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace;
  --font-display: 'Oswald', 'Titillium Web', sans-serif;
}
```

---

## DOs
- Night-asphalt backgrounds always: `bg-zinc-950`
- Layer rain streaks + grid + grain on hero sections
- `font-black uppercase italic tracking-wider` on all headers
- Restrained gold — accent, not dominant
- NOS green for secondary / action / "go" elements
- Hard crisp borders over rounded corners

## DON'Ts
- No light mode / white backgrounds
- No `rounded-xl` or `rounded-2xl` on primary components
- No flat corporate blues, teals, or blurple palettes
- No playful fonts or rounded sans-serifs
- No emojis unless explicitly called for
- No over-saturating the gold — it loses impact
