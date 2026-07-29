"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { RevealSection, AnimatedHeading, AGGRESSIVE_EASE } from "@/components/Animated";

type RankItem = {
  rank: number;
  name: string;
  pilot: string;
  vehicle: string;
  city: string;
  power: number | null;
  specs0_100: string | null;
  drivetrain: string | null;
  mainImageUrl: string | null;
  modsCount: number;
  respect: number;
  bounty: number;
  id: string;
  slug: string;
};

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "text-yellow-400 drop-shadow-[0_0_16px_rgba(234,179,8,0.45)]",
    2: "text-zinc-300 drop-shadow-[0_0_8px_rgba(212,212,212,0.2)]",
    3: "text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.2)]",
  };
  return (
    <span className={`text-4xl md:text-5xl font-black italic leading-none select-none ${colors[rank] || "text-zinc-800"}`}>
      #{rank.toString().padStart(2, "0")}
    </span>
  );
}

export default function BlacklistPage() {
  const [ranking, setRanking] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.ranking?.()
      .then(setRanking)
      .catch(() => setRanking([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-nfs-bg bg-carbon overflow-x-hidden">
      <div className="rain-overlay" />
      <div className="grain-overlay" />
      <div className="absolute inset-0 bg-grid pointer-events-none z-[1] opacity-30" />

      <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-zinc-800/70">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-2 h-2 bg-yellow-500 rotate-45" />
          <span className="font-black uppercase italic tracking-[0.15em] text-zinc-100 text-base">BLACKLIST</span>
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-zinc-600">RANKING NACIONAL</span>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-start gap-4 mb-12">
          <span className="w-1.5 h-12 bg-yellow-500/80 mt-1 shrink-0" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-500/60 mb-1">RANKING NACIONAL</p>
            <h1 className="hud-header text-3xl md:text-5xl">BLACKLIST</h1>
            <p className="text-zinc-500 text-sm tracking-wide mt-1">Todos los proyectos ordenados por respeto.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
              <span className="text-[10px] font-mono tracking-widest text-zinc-600">CARGANDO BLACKLIST...</span>
            </div>
          </div>
        ) : ranking.length === 0 ? (
          <div className="text-center py-20 border border-zinc-800/50 bg-zinc-950/50">
            <p className="text-zinc-600 text-sm font-mono tracking-wider">NINGÚN PROYECTO PUBLICADO AÚN</p>
            <Link href="/garaje/nuevo" className="inline-block mt-6 border border-yellow-500/30 px-8 py-4 font-bold uppercase tracking-[0.2em] text-yellow-400/80 text-xs transition-all duration-300 hover:bg-yellow-500/10">
              PUBLICAR PRIMER PROYECTO
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {ranking.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: AGGRESSIVE_EASE }}
              >
                <Link
                  href={`/b/${item.slug}`}
                  className={`flex items-center gap-4 p-4 border transition-all duration-300 hover:border-yellow-500/30 group ${
                    item.rank <= 3
                      ? "border-yellow-500/20 bg-yellow-500/[0.02]"
                      : "border-zinc-800 bg-zinc-950/50"
                  }`}
                >
                  <div className="w-14 shrink-0 text-center">
                    <RankBadge rank={item.rank} />
                  </div>

                  <div className="w-16 h-16 shrink-0 bg-zinc-900 border border-zinc-800 overflow-hidden">
                    {item.mainImageUrl ? (
                      <img src={item.mainImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-lg font-black italic text-zinc-800">{item.vehicle.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold uppercase italic tracking-wider text-zinc-100 text-sm truncate group-hover:text-yellow-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-mono tracking-wider text-zinc-500 truncate">
                      {item.vehicle} <span className="text-zinc-700">&bull;</span> {item.pilot}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-mono tracking-widest text-zinc-600">
                      {item.power && <span>{item.power} HP</span>}
                      {item.specs0_100 && <span>0-100 {item.specs0_100}</span>}
                      <span>{item.modsCount} mods</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-black italic text-yellow-400">{item.respect}</p>
                    <p className="text-[8px] font-mono tracking-widest text-zinc-600">RESPETO</p>
                    <p className="text-[10px] font-mono tracking-widest text-zinc-600 mt-1">
                      {item.bounty} PTS
                    </p>
                  </div>

                  <div className="hidden md:block shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 group-hover:text-yellow-500/60 transition-colors flex items-center gap-1">
                      VER FICHA
                      <span className="text-yellow-500/50 group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="border border-zinc-800 px-10 py-4 font-bold uppercase tracking-[0.2em] text-zinc-400 text-xs transition-all duration-300 hover:border-yellow-500/30 hover:text-yellow-400 inline-block"
          >
            ← VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </main>
  );
}
