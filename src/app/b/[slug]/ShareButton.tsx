"use client";

import { useState, useEffect } from "react";

export function ShareButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/b/${slug}`);
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url, title: "Mira este proyecto en La Blacklist" });
        return;
      } catch { /* user cancelled */ }
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch { /* no clipboard */ }
  };

  return (
    <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-4">COMPARTIR PROYECTO</p>
      <button
        onClick={handleShare}
        className="w-full border border-zinc-700 py-5 font-bold uppercase tracking-[0.2em] text-zinc-300 text-sm transition-all duration-300 hover:border-emerald-500/40 hover:text-emerald-400 hover:shadow-[0_0_16px_rgba(16,185,129,0.1)]"
      >
        {copied ? "¡ENLACE COPIADO!" : "COMPARTIR PROYECTO"}
      </button>
      {copied && (
        <p className="text-[9px] font-mono tracking-widest text-emerald-400/80 mt-3 text-center animate-pulse">
          Compártelo para recibir puntos de Respeto.
        </p>
      )}
    </div>
  );
}
