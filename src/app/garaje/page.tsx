"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api, isAuthenticated, clearToken } from "@/lib/api";

export default function GarajePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/?login=required");
      return;
    }
    api.garaje()
      .then((data) => { setUser(data.user); setVehicles(data.vehicles); })
      .catch(() => router.push("/?login=required"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => { clearToken(); router.push("/"); };

  if (loading) return (
    <main className="min-h-screen bg-nfs-bg flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
    </main>
  );

  if (!user) return null;

  const isFounder = user.tier === "founder";
  const tierLabel = isFounder ? "PILOTO FUNDADOR" : user.tier === "pro" ? "PRO" : "PILOTO";

  return (
    <main className="min-h-screen bg-nfs-bg bg-carbon overflow-x-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none z-0 opacity-40" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-800/70">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-2 h-2 bg-yellow-500 rotate-45" />
          <span className="font-black uppercase italic tracking-[0.15em] text-zinc-100 text-base">BLACKLIST</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono tracking-widest text-emerald-400/70">MI GARAJE</span>
          <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-red-400 transition-colors">SALIR</button>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className={`p-6 md:p-8 mb-10 relative overflow-hidden backdrop-blur-sm ${
          isFounder
            ? "border border-yellow-500/50 bg-zinc-950/90 shadow-[0_0_30px_rgba(234,179,8,0.08)]"
            : "border border-zinc-800 bg-zinc-950/90"
        }`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-glow-gold rounded-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 border-2 border-yellow-500/30 bg-zinc-900 flex items-center justify-center">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt="" width={80} height={80} className="object-cover w-full h-full" />
              ) : (
                <span className="text-3xl font-black italic text-zinc-700">?</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="hud-header text-2xl md:text-3xl">{user.displayName || user.username}</h1>
                <span className={`text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1 flex items-center gap-1 ${
                  isFounder
                    ? "text-yellow-300 bg-yellow-500/10 border border-yellow-400/60 shadow-[0_0_8px_rgba(234,179,8,0.2)]"
                    : "text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/30"
                }`}>
                  {isFounder && <span className="text-[10px]">★</span>}
                  {tierLabel}
                </span>
              </div>
              <p className="text-sm font-mono tracking-wider text-zinc-500">@{user.username}</p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-1">RECOMPENSA</p>
              <p className="text-3xl font-black italic text-yellow-400 drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]">
                {user.bountyScore?.toLocaleString()}
              </p>
              <p className="text-[9px] font-mono tracking-widest text-zinc-600 mt-0.5">PTS</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="w-1.5 h-10 bg-yellow-500/80" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-500/60 mb-0.5">TUS PROYECTOS</p>
              <h2 className="hud-header text-2xl md:text-3xl">EL GARAJE</h2>
            </div>
          </div>
          <Link href="/garaje/nuevo" className="border border-yellow-500/40 bg-yellow-500/10 px-6 py-3 font-bold uppercase tracking-[0.2em] text-yellow-400 text-xs transition-all duration-300 hover:bg-yellow-500/20 hover:border-yellow-500/60">
            + AGREGAR NUEVO AUTO
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <div className="text-center py-20 border border-zinc-800/50 bg-zinc-950/50">
            <p className="text-zinc-600 text-sm font-mono tracking-wider mb-4">TU GARAJE ESTÁ VACÍO</p>
            <Link href="/garaje/nuevo" className="inline-block border border-yellow-500/30 px-8 py-4 font-bold uppercase tracking-[0.2em] text-yellow-400/80 text-xs transition-all duration-300 hover:bg-yellow-500/10">
              PUBLICAR PRIMER PROYECTO
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((v) => (
              <div key={v.id} className="group border border-zinc-800 bg-zinc-950/90 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-zinc-700">
                <div className="relative aspect-video bg-gradient-to-br from-zinc-800/40 to-zinc-950 overflow-hidden">
                  {v.mainImageUrl ? (
                    <Image src={v.mainImageUrl} alt={v.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-black italic text-zinc-800">{v.make}</div>
                        <div className="text-[9px] font-mono tracking-widest text-zinc-700 mt-1">{v.model}</div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {v.power && (
                    <div className="absolute top-3 right-3 bg-black/70 border border-yellow-500/30 px-2 py-1">
                      <span className="text-[10px] font-mono tracking-widest text-yellow-400">{v.power} HP</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-black uppercase italic tracking-wider text-sm text-white drop-shadow-lg">{v.make} {v.model}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold uppercase italic tracking-wider text-zinc-100 text-sm">{v.name}</h3>
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-800 my-2 text-center">
                    <div>
                      <p className="font-mono text-[10px] tracking-wider text-zinc-400">{v.power || "—"}</p>
                      <p className="text-[7px] font-mono tracking-widest text-zinc-600">HP</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] tracking-wider text-zinc-400">{v.year || "—"}</p>
                      <p className="text-[7px] font-mono tracking-widest text-zinc-600">AÑO</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] tracking-wider text-yellow-500">{v.respectCount}</p>
                      <p className="text-[7px] font-mono tracking-widest text-zinc-600">RESP</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Link href={`/b/${v.slug}`} className="flex-1 text-center border border-zinc-800 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 transition-all duration-300 hover:border-zinc-700 hover:text-zinc-300">VER PROYECTO</Link>
                    <button className="flex-1 border border-zinc-800 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-all duration-300 hover:border-yellow-500/30 hover:text-yellow-400">EDITAR</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
