"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RespectButton } from "./RespectButton";
import { ShareButton } from "./ShareButton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function QuickSpecs({ vehicle }: { vehicle: any }) {
  const specs = [
    { label: "POTENCIA", value: vehicle.power ? `${vehicle.power} HP` : "—", icon: "⚡" },
    { label: "0-100 KM/H", value: vehicle.specs0_100 || "—", icon: "⏱️" },
    { label: "TRACCIÓN", value: vehicle.drivetrain || "—", icon: "⚙️" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800 my-3 text-center">
      {specs.map((s) => (
        <div key={s.label}>
          <span className="text-xs block mb-0.5">{s.icon}</span>
          <p className="font-mono text-[11px] tracking-wider text-zinc-300">{s.value}</p>
          <p className="text-[8px] font-mono tracking-widest text-zinc-600 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function VehicleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [groupedMods, setGroupedMods] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_BASE}/api/vehicles/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          setVehicle(null);
          setLoading(false);
          return;
        }
        setVehicle(data);
        const grouped = (data.modifications || []).reduce((acc: Record<string, any[]>, mod: any) => {
          const cat = mod.category.charAt(0).toUpperCase() + mod.category.slice(1);
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(mod);
          return acc;
        }, {});
        setGroupedMods(grouped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-nfs-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          <span className="text-[10px] font-mono tracking-widest text-zinc-600">CARGANDO...</span>
        </div>
      </main>
    );
  }

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-nfs-bg flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500 text-sm font-mono tracking-wider">PROYECTO NO ENCONTRADO</p>
        <Link href="/" className="border border-zinc-800 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-yellow-400 transition-colors">VOLVER AL INICIO</Link>
      </main>
    );
  }

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
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono tracking-widest text-zinc-600">FICHA // {vehicle.year || "—"}</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Hero Image Card (16:9) */}
            <div className="relative overflow-hidden border border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
              <div className="relative aspect-video bg-gradient-to-br from-zinc-800/30 via-zinc-900 to-zinc-950">
                {vehicle.mainImageUrl ? (
                  <Image src={vehicle.mainImageUrl} alt={vehicle.name} fill className="object-cover" priority />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black italic text-zinc-800">{vehicle.make?.charAt(0) || "?"}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 border border-yellow-500/30 px-3 py-1.5">
                  <span className="text-yellow-400 text-xs font-black italic">{vehicle.user?.bountyScore}</span>
                  <span className="text-[8px] font-mono tracking-widest text-yellow-500/70">PTS</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h1 className="font-black uppercase italic tracking-wider text-xl text-white drop-shadow-lg">
                    {vehicle.make} {vehicle.model}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <a href={`https://instagram.com/${(vehicle.instagram || vehicle.user?.username || "").replace("@", "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-yellow-500 hover:underline">
                      @{vehicle.instagram || vehicle.user?.username}
                    </a>
                    {vehicle.tiktok && (
                      <a href={`https://tiktok.com/${vehicle.tiktok.replace("@", "")}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-zinc-300 hover:underline">
                        {vehicle.tiktok}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-5 pb-4">
                <QuickSpecs vehicle={vehicle} />
              </div>
            </div>

            {/* Gallery */}
            {vehicle.galleryUrls && vehicle.galleryUrls.length > 0 && (
              <div className="border border-zinc-800 bg-zinc-950/90 backdrop-blur-sm overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-zinc-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-500/60">GALERÍA</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1 p-1">
                  {vehicle.galleryUrls.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative aspect-square bg-zinc-900 overflow-hidden group">
                      <Image src={url} alt={`${vehicle.name} - ${i + 2}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <span className="text-white/0 group-hover:text-white/80 text-[10px] font-bold uppercase tracking-widest">AMPLIAR</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div className="border border-zinc-800/60 bg-zinc-950/50 p-5">
                <p className="text-zinc-300 text-sm tracking-wide leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {/* Modifications */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1 h-8 bg-yellow-500/80" />
                <h2 className="hud-header text-xl">ESPECIFICACIONES</h2>
              </div>
              {Object.keys(groupedMods).length === 0 ? (
                <p className="text-zinc-600 text-xs font-mono tracking-wider py-4">Sin modificaciones registradas</p>
              ) : (
                Object.entries(groupedMods).map(([cat, mods]) => (
                  <div key={cat} className="mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-500/60 mb-3 border-b border-zinc-800/50 pb-2">{cat}</h3>
                    <div className="space-y-2">
                      {(mods as any[]).map((mod: any) => (
                        <div key={mod.id} className="flex items-center justify-between border-l-2 border-zinc-800 pl-4 py-2 hover:border-yellow-500/30 transition-colors">
                          <div>
                            <p className="text-sm font-mono tracking-wider text-zinc-300">{mod.title}</p>
                            {mod.brand && <p className="text-[10px] font-mono tracking-widest text-zinc-600 mt-0.5">{mod.brand}</p>}
                          </div>
                          {mod.workshop && (
                            <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1 ${mod.workshop.isVerified ? "text-emerald-400/80 bg-emerald-500/5 border border-emerald-500/20" : "text-zinc-500 bg-zinc-800/30 border border-zinc-700/30"}`}>
                              {mod.workshop.name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-4">DAR RESPETO</p>
              <RespectButton vehicleId={vehicle.id} hasVoted={false} respectCount={vehicle.respectCount || 0} />
              <p className="text-[9px] font-mono tracking-widest text-zinc-600 mt-3 text-center">+5 PTS DE RECOMPENSA AL DUEÑO</p>
            </div>

            <ShareButton slug={vehicle.slug} />

            <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-3">PROPIETARIO</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-zinc-700 bg-zinc-900 flex items-center justify-center">
                  <span className="text-sm font-black italic text-zinc-600">?</span>
                </div>
                <div>
                  <p className="font-bold uppercase italic tracking-wider text-zinc-100 text-sm">{vehicle.user?.displayName || vehicle.user?.username}</p>
                  <a href={`https://instagram.com/${(vehicle.instagram || vehicle.user?.username || "").replace("@", "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[10px] font-mono tracking-widest text-yellow-500 hover:underline inline-flex items-center gap-1">
                    @{vehicle.instagram || vehicle.user?.username}
                  </a>
                  {vehicle.tiktok && (
                    <a href={`https://tiktok.com/${vehicle.tiktok.replace("@", "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-[10px] font-mono tracking-widest text-zinc-500 hover:text-zinc-400 hover:underline ml-2">
                      {vehicle.tiktok}
                    </a>
                  )}
                </div>
              </div>
              {vehicle.city && <p className="text-[10px] font-mono tracking-widest text-zinc-600 mt-3">📍 {vehicle.city}</p>}
            </div>

            <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-3">ESTADÍSTICAS</p>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono tracking-wider">
                  <span className="text-zinc-500">Respeto</span>
                  <span className="text-yellow-400 font-bold">{vehicle.respectCount}</span>
                </div>
                <div className="flex justify-between text-xs font-mono tracking-wider">
                  <span className="text-zinc-500">Modificaciones</span>
                  <span className="text-zinc-300">{(vehicle.modifications || []).length}</span>
                </div>
                <div className="flex justify-between text-xs font-mono tracking-wider">
                  <span className="text-zinc-500">Categorías</span>
                  <span className="text-zinc-300">{Object.keys(groupedMods).length}</span>
                </div>
                <div className="flex justify-between text-xs font-mono tracking-wider">
                  <span className="text-zinc-500">Año</span>
                  <span className="text-zinc-300">{vehicle.year || "—"}</span>
                </div>
                <div className="flex justify-between text-xs font-mono tracking-wider">
                  <span className="text-zinc-500">Potencia</span>
                  <span className="text-zinc-300">{vehicle.power ? `${vehicle.power} HP` : "—"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
