"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NFS_PLAYLIST_ID = "6E833f42r1aCkmJFipyl5Q";
const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/playlist/${NFS_PLAYLIST_ID}?utm_source=generator`;

const TRACKS = [
  "Jokers Of The Scene - Baggy Bottom",
  "The Bots - Won't Be Around",
  "Celldweller - Shapeshifter",
  "Stratus - You Must Follow",
  "Avenged Sevenfold - Blinded In Chains",
];

export default function MusicPlayer() {
  const [visible, setVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [trackIndex, setTrackIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const togglePlay = () => {
    if (!visible) {
      setVisible(true);
      setTimeout(() => setIsPlaying(true), 500);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* ─── Floating bar player ─── */}
      {visible && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800/70 backdrop-blur-lg"
        >
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
            {/* Track info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isPlaying ? "bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-zinc-600"}`} />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 truncate">
                  {TRACKS[trackIndex]}
                </p>
                <p className="text-[8px] font-mono tracking-widest text-zinc-600 truncate">
                  NFS MOST WANTED SOUNDTRACK
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Previous */}
              <button
                onClick={() => setTrackIndex((trackIndex - 1 + TRACKS.length) % TRACKS.length)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-8 h-8 flex items-center justify-center border border-zinc-700 hover:border-yellow-500/50 text-zinc-300 hover:text-yellow-400 transition-all duration-300"
              >
                {isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>

              {/* Next */}
              <button
                onClick={() => setTrackIndex((trackIndex + 1) % TRACKS.length)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
              </button>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 accent-yellow-500 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #EAB308 ${volume * 100}%, #27272a ${volume * 100}%)` }}
                />
              </div>

              {/* Close */}
              <button
                onClick={() => setVisible(false)}
                className="text-zinc-600 hover:text-zinc-400 transition-colors ml-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          {/* Hidden Spotify embed for audio */}
          <div className="absolute -z-10 opacity-0 h-0 overflow-hidden">
            <iframe
              ref={iframeRef}
              src={isPlaying ? SPOTIFY_EMBED_URL : ""}
              width="1"
              height="1"
              allow="autoplay; encrypted-media"
              title="NFS Soundtrack"
            />
          </div>
        </motion.div>
      )}

      {/* ─── Toggle button ─── */}
      {!visible && (
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-zinc-950/90 border border-zinc-800 backdrop-blur-md px-4 py-3 transition-colors duration-300 hover:border-yellow-500/40"
        >
          <span className="w-2 h-2 rounded-full bg-zinc-600" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            ESCUCHAR NFS
          </span>
        </motion.button>
      )}
    </>
  );
}
