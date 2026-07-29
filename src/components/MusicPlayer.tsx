"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NFS_PLAYLIST_ID = "6E833f42r1aCkmJFipyl5Q";
const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/playlist/${NFS_PLAYLIST_ID}?utm_source=generator`;

export default function MusicPlayer() {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      {/* ─── Floating trigger button ─── */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-zinc-950/90 border border-zinc-800 backdrop-blur-md px-4 py-3 transition-colors duration-300 hover:border-yellow-500/40"
      >
        {/* LED indicator */}
        <span
          className={`w-2 h-2 rounded-full ${
            isPlaying ? "bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-zinc-600"
          }`}
        />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-yellow-400">
          {expanded ? "CERRAR MÚSICA" : "MÚSICA NFS"}
        </span>
      </motion.button>

      {/* ─── Expanded player panel ─── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-80 bg-zinc-950/95 border border-zinc-800 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/70">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rotate-45" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
                  NFS // MOST WANTED
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-zinc-500 hover:text-yellow-400 transition-colors text-[10px] font-mono tracking-widest"
                >
                  {isPlaying ? "[PAUSA]" : "[PLAY]"}
                </button>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-zinc-600 hover:text-zinc-400 transition-colors text-[10px] font-mono"
                >
                  [X]
                </button>
              </div>
            </div>

            {/* Spotify embed */}
            <div className="relative">
              <iframe
                src={SPOTIFY_EMBED_URL}
                width="100%"
                height="352"
                allow="autoplay; encrypted-media"
                className="border-0"
                onLoad={() => setIsPlaying(true)}
                title="NFS Most Wanted Soundtrack"
              />
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800/50">
              <span className="text-[8px] font-mono tracking-widest text-zinc-700">
                21 TEMAS // 1 HR 33 MIN
              </span>
              <span className="text-[8px] font-mono tracking-widest text-emerald-400/50 flex items-center gap-1">
                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                SOUNDTRACK
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
