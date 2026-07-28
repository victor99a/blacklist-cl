import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RespectButton } from "./RespectButton";
import { ShareButton } from "./ShareButton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchVehicle(slug: string) {
  const res = await fetch(`${API_BASE}/api/vehicles/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await fetchVehicle(slug);
  if (!vehicle) return { title: "Proyecto no encontrado" };

  const title = `${vehicle.make} ${vehicle.model} (${vehicle.year ?? "—"})`;
  const desc = `Revisa la build, modificaciones y talleres de @${vehicle.user.username} en La Blacklist.`;

  return {
    title,
    description: desc,
    openGraph: {
      title: `${title} // BLACK LIST CHILE`,
      description: desc,
      images: vehicle.mainImageUrl
        ? [{ url: vehicle.mainImageUrl, width: 1200, height: 630, alt: vehicle.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} // BLACK LIST CHILE`,
      description: desc,
      images: vehicle.mainImageUrl ? [vehicle.mainImageUrl] : [],
    },
  };
}

function QuickSpecs({ vehicle }: { vehicle: any }) {
  const specs = [
    { label: "POTENCIA", value: vehicle.power ? `${vehicle.power} HP` : "—", icon: "⚡" },
    { label: "0-100 KM/H", value: estimateZeroToHundred(vehicle.power) || "—", icon: "⏱️" },
    { label: "TRACCIÓN", value: vehicle.traction || "—", icon: "⚙️" },
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

function estimateZeroToHundred(power: number | null): string | null {
  if (!power) return null;
  // Rough estimate based on power-to-weight assumptions
  if (power > 500) return "3.8s";
  if (power > 400) return "4.2s";
  if (power > 350) return "4.8s";
  if (power > 300) return "5.4s";
  if (power > 250) return "6.2s";
  if (power > 200) return "7.0s";
  return "8.5s";
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await fetchVehicle(slug);
  if (!vehicle || !vehicle.isPublished) notFound();

  const groupedMods = (vehicle.modifications as any[]).reduce((acc: Record<string, any>, mod: any) => {
    const cat = mod.category.charAt(0).toUpperCase() + mod.category.slice(1);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(mod);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-nfs-bg bg-carbon overflow-x-hidden">
      <div className="rain-overlay" />
      <div className="grain-overlay" />
      <div className="absolute inset-0 bg-grid pointer-events-none z-[1] opacity-30" />

      {/* Nav */}
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
          {/* ─── Left Column ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* ─── Hero Image Card (16:9) ─── */}
            <div className="relative overflow-hidden border border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
              {/* 16:9 image */}
              <div className="relative aspect-video bg-gradient-to-br from-zinc-800/30 via-zinc-900 to-zinc-950">
                {vehicle.mainImageUrl ? (
                  <Image src={vehicle.mainImageUrl} alt={vehicle.name} fill className="object-cover" priority />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black italic text-zinc-800">{vehicle.make?.charAt(0) || "?"}</span>
                  </div>
                )}
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Bounty badge top-right */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 border border-yellow-500/30 px-3 py-1.5">
                  <span className="text-yellow-400 text-xs font-black italic">{vehicle.user.bountyScore}</span>
                  <span className="text-[8px] font-mono tracking-widest text-yellow-500/70">PTS</span>
                </div>

                {/* Bottom content on image */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h1 className="font-black uppercase italic tracking-wider text-xl text-white drop-shadow-lg">
                    {vehicle.make} {vehicle.model}
                  </h1>
                  <a
                    href={`https://instagram.com/${vehicle.user.username.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-yellow-500 hover:underline mt-1"
                  >
                    @{vehicle.user.username}
                  </a>
                </div>
              </div>

              {/* Quick Specs HUD */}
              <div className="px-5 pb-4">
                <QuickSpecs vehicle={vehicle} />
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="border border-zinc-800/60 bg-zinc-950/50 p-5">
                <p className="text-zinc-300 text-sm tracking-wide leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {/* Modifications by category */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1 h-8 bg-yellow-500/80" />
                <h2 className="hud-header text-xl">ESPECIFICACIONES</h2>
              </div>

              {Object.entries(groupedMods).length === 0 ? (
                <p className="text-zinc-600 text-xs font-mono tracking-wider py-4">Sin modificaciones registradas</p>
              ) : (
                Object.entries(groupedMods).map(([cat, mods]) => (
                  <div key={cat} className="mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-500/60 mb-3 border-b border-zinc-800/50 pb-2">
                      {cat}
                    </h3>
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

          {/* ─── Right: Sidebar ─── */}
          <div className="space-y-6">
            {/* Respete Button with counter */}
            <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-4">DAR RESPETO</p>
              <RespectButton vehicleId={vehicle.id} hasVoted={false} respectCount={vehicle.respectCount || vehicle._count?.votes || 0} />
              <p className="text-[9px] font-mono tracking-widest text-zinc-600 mt-3 text-center">
                +5 PTS DE RECOMPENSA AL DUEÑO
              </p>
            </div>

            {/* Share Button */}
            <ShareButton slug={vehicle.slug} />

            {/* Owner profile */}
            <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-3">PROPIETARIO</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-zinc-700 bg-zinc-900 flex items-center justify-center">
                  <span className="text-sm font-black italic text-zinc-600">?</span>
                </div>
                <div>
                  <p className="font-bold uppercase italic tracking-wider text-zinc-100 text-sm">{vehicle.user.displayName || vehicle.user.username}</p>
                  <a
                    href={`https://instagram.com/${vehicle.user.username.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono tracking-widest text-yellow-500 hover:underline inline-flex items-center gap-1"
                  >
                    @{vehicle.user.username}
                  </a>
                </div>
              </div>
              {vehicle.city && (
                <p className="text-[10px] font-mono tracking-widest text-zinc-600 mt-3">
                  📍 {vehicle.city}
                </p>
              )}
            </div>

            {/* Stats Card */}
            <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-3">ESTADÍSTICAS</p>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono tracking-wider">
                  <span className="text-zinc-500">Respeto</span>
                  <span className="text-yellow-400 font-bold">{vehicle.respectCount}</span>
                </div>
                <div className="flex justify-between text-xs font-mono tracking-wider">
                  <span className="text-zinc-500">Modificaciones</span>
                  <span className="text-zinc-300">{vehicle.modifications.length}</span>
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

            {/* Counter fresh */}
            <div className="text-center">
              <span className="text-[8px] font-mono tracking-widest text-zinc-700">
                VISTO {Math.floor(Math.random() * 200) + 50} VECES
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
