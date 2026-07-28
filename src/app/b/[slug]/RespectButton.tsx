"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function RespectButton({ vehicleId, hasVoted: initial }: { vehicleId: string; hasVoted: boolean }) {
  const [hasVoted, setHasVoted] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVote = async () => {
    setLoading(true);
    setError("");
    try {
      await api.vote(vehicleId);
      setHasVoted(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al votar");
    } finally {
      setLoading(false);
    }
  };

  if (hasVoted) {
    return (
      <div className="text-center py-4 border border-emerald-500/20 bg-emerald-500/5">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">RESPETO ENVIADO</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleVote}
        disabled={loading}
        className="w-full border border-yellow-500/40 bg-yellow-500/10 py-5 font-bold uppercase tracking-[0.25em] text-yellow-400 text-sm transition-all duration-300 hover:bg-yellow-500/20 hover:border-yellow-500/60 hover:shadow-[0_0_20px_rgba(234,179,8,0.12)] disabled:opacity-50"
      >
        {loading ? "ENVIANDO..." : "DAR RESPETO (+1)"}
      </button>
      {error && <p className="text-[10px] font-mono tracking-wider text-red-400 mt-2 text-center">{error}</p>}
    </div>
  );
}
