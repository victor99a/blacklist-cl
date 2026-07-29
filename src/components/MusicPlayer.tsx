"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [trackIndex, setTrackIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <motion.div
      initial={{ y: 60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 border-t border-zinc-800/60 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPlaying ? "bg-emerald-400 animate-pulse shadow-[0_0_4px_rgba(52,211,153,0.5)]" : "bg-zinc-600"}`} />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 truncate">
              {isPlaying ? TRACKS[trackIndex] : "NFS MOST WANTED SOUNDTRACK"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setTrackIndex((trackIndex - 1 + TRACKS.length) % TRACKS.length)} className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5">
            <SkipBack size={12} />
          </button>

          <button
            onClick={togglePlay}
            className="w-7 h-7 flex items-center justify-center border border-zinc-700 hover:border-yellow-500/50 text-zinc-300 hover:text-yellow-400 transition-all duration-300"
          >
            {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
          </button>

          <button onClick={() => setTrackIndex((trackIndex + 1) % TRACKS.length)} className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5">
            <SkipForward size={12} />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <Volume2 size={10} className="text-zinc-500" />
          <input
            type="range" min="0" max="1" step="0.05"
            value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-14 h-1 accent-yellow-500 bg-zinc-800 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #EAB308 ${volume * 100}%, #27272a ${volume * 100}%)` }}
          />
        </div>
      </div>

      {isPlaying && (
        <div className="absolute bottom-12 right-4 z-50 w-72 h-20 overflow-hidden rounded border border-zinc-800 bg-zinc-950/90 shadow-xl">
          <iframe
            ref={iframeRef}
            src={SPOTIFY_EMBED_URL}
            width="100%" height="80"
            allow="autoplay; encrypted-media"
            title="NFS Soundtrack"
            className="border-0"
          />
        </div>
      )}
    </motion.div>
  );
}
