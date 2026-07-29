"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, isAuthenticated } from "@/lib/api";
import { AGGRESSIVE_EASE, fadeInUp, scaleIn } from "@/components/Animated";

export default function BienvenidaPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/?login=required");
      return;
    }
    api.me().then(setUser).catch(() => router.push("/")).finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <main className="min-h-screen bg-nfs-bg flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
    </main>
  );

  if (!user) return null;

  return (
    <main className="relative min-h-screen bg-nfs-bg bg-carbon overflow-x-hidden">
      <div className="rain-overlay" />
      <div className="grain-overlay" />
      <div className="absolute inset-0 bg-grid pointer-events-none z-[1]" />
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-glow-gold rounded-full pointer-events-none z-0" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: AGGRESSIVE_EASE }}
        className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-zinc-800/70"
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="w-2 h-2 bg-yellow-500 rotate-45" />
          <span className="font-black uppercase italic tracking-[0.15em] text-zinc-100 text-base">BLACKLIST</span>
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-emerald-400/70">BLACK LIST CHILE</span>
      </motion.nav>

      {/* Hero Welcome */}
      <section className="relative z-10 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.1, ease: AGGRESSIVE_EASE }}
          className="flex items-center gap-2 mb-6"
        >
          <span className="w-1.5 h-1.5 bg-yellow-500 rotate-45" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-yellow-500/60">
            LICENCIA DE PILOTO
          </span>
          <span className="w-1.5 h-1.5 bg-yellow-500 rotate-45" />
        </motion.div>

        {/* Star Icon */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.2, ease: AGGRESSIVE_EASE }}
          className="mb-6"
        >
          <span className="text-6xl">★</span>
        </motion.div>

        {/* Main message */}
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.3, ease: AGGRESSIVE_EASE }}
          className="font-black uppercase italic tracking-[0.02em] text-zinc-100 text-4xl md:text-6xl leading-[0.95] max-w-2xl"
        >
          ¡LICENCIA DE PILOTO
          <br />
          ACTIVADA!
        </motion.h1>

        {/* Bounty reward */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.5, ease: AGGRESSIVE_EASE }}
          className="mt-8 border border-yellow-500/30 bg-yellow-500/10 px-8 py-5"
        >
          <p className="text-yellow-400 text-3xl font-black italic drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]">
            +100 PTS
          </p>
          <p className="text-[10px] font-mono tracking-widest text-yellow-500/70 mt-1">
            PUNTOS DE RECOMPENSA
          </p>
        </motion.div>

        {/* Founder badge */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.6, ease: AGGRESSIVE_EASE }}
          className="mt-6 flex items-center gap-2 border border-yellow-400/40 bg-yellow-500/5 px-6 py-3"
        >
          <span className="text-yellow-300 text-sm">★</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-300 drop-shadow-[0_0_6px_rgba(234,179,8,0.2)]">
            PILOTO FUNDADOR
          </span>
          <span className="text-yellow-300 text-sm">★</span>
        </motion.div>

        {/* Call to action panel */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.8, ease: AGGRESSIVE_EASE }}
          className="mt-12 max-w-lg border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-8"
        >
          <p className="text-zinc-300 text-sm tracking-wide leading-relaxed mb-6">
            Para figurar en la Blacklist y empezar a recibir puntos de Respeto,
            debes registrar tu primer proyecto.
          </p>
          <Link
            href="/garaje/nuevo"
            className="block w-full bg-yellow-500 hover:brightness-110 text-black font-bold uppercase tracking-[0.2em] py-5 text-sm text-center transition-all duration-300 animate-pulse-glow"
          >
            PUBLICAR MI PRIMER AUTO (+50 PTS)
          </Link>
        </motion.div>

        {/* Skip link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-6"
        >
          <Link
            href="/garaje"
            className="text-[10px] font-mono tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            IR AL GARAJE →
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
