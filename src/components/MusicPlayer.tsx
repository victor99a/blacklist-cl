"use client";

import { motion } from "framer-motion";

const NFS_PLAYLIST_ID = "6E833f42r1aCkmJFipyl5Q";
const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/playlist/${NFS_PLAYLIST_ID}?utm_source=generator`;

export default function MusicPlayer() {
  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800/60"
    >
      <div className="flex items-center justify-between px-3 py-1 max-w-6xl mx-auto gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 hidden sm:inline">NFS MW</span>
        </div>

        <div className="flex-1 max-w-md mx-auto h-[60px] overflow-hidden">
          <iframe
            src={SPOTIFY_EMBED_URL}
            width="100%"
            height="80"
            allow="autoplay; encrypted-media"
            title="NFS Most Wanted Soundtrack"
            className="border-0 -mt-[10px] pointer-events-auto"
            style={{ clipPath: "inset(10px 0 10px 0)" }}
          />
        </div>

        <div className="text-[8px] font-mono tracking-widest text-zinc-700 shrink-0 hidden sm:block">
          21 TEMAS
        </div>
      </div>
    </motion.div>
  );
}
