"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipBack, SkipForward, Play, Pause, Volume2, X } from "lucide-react";

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
      {visible && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800/70 backdrop-blur-lg"
        >
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
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

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setTrackIndex((trackIndex - 1 + TRACKS.length) % TRACKS.length)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <SkipBack size={14} />
              </button>

              <button
                onClick={togglePlay}
                className="w-8 h-8 flex items-center justify-center border border-zinc-700 hover:border-yellow-500/50 text-zinc-300 hover:text-yellow-400 transition-all duration-300"
              >
                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              </button>

              <button
                onClick={() => setTrackIndex((trackIndex + 1) % TRACKS.length)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <SkipForward size={14} />
              </button>

              <div className="hidden sm:flex items-center gap-1.5">
                <Volume2 size={12} className="text-zinc-500" />
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

              <button
                onClick={() => setVisible(false)}
                className="text-zinc-600 hover:text-zinc-400 transition-colors ml-1"
              >
                <X size={12} />
              </button>
            </div>
          </div>

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

      {!visible && (
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-zinc-950/90 border border-zinc-800 backdrop-blur-md px-4 py-3 transition-colors duration-300 hover:border-yellow-500/40"
        >
          <Play size={12} fill="currentColor" className="text-yellow-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            ESCUCHAR NFS
          </span>
        </motion.button>
      )}
    </>
  );
}
