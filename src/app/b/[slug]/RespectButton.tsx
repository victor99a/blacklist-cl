"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, isAuthenticated } from "@/lib/api";

export function RespectButton({
  vehicleId,
  hasVoted: initial,
  respectCount: initialCount = 0,
}: {
  vehicleId: string;
  hasVoted: boolean;
  respectCount?: number;
}) {
  const [hasVoted, setHasVoted] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(initialCount);
  const router = useRouter();

  const handleVote = async () => {
    if (!isAuthenticated()) {
      setError("Debes iniciar sesión para votar");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.vote(vehicleId);
      setHasVoted(true);
      setCount((c) => c + 1);
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
        <p className="text-lg font-black italic text-emerald-400 mt-1">{count}</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleVote}
        disabled={loading}
        className="w-full bg-amber-500/10 hover:bg-amber-500 text-yellow-500 hover:text-black font-bold uppercase italic tracking-[0.15em] py-5 text-sm border border-yellow-500/40 transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "ENVIANDO..." : `DAR RESPETO (+1)  [${count}]`}
      </button>
      {error && (
        <p className="text-[10px] font-mono tracking-wider text-red-400 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
