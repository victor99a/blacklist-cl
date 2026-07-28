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
    <main className="min-h-screen bg-nfs-bg bg-carbon">
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

      {/* ─── Hero ─── */}
      <section className="relative z-10">
        <div className="relative h-[40vh] md:h-[50vh] bg-gradient-to-br from-zinc-800/30 via-zinc-900 to-zinc-950 flex items-end overflow-hidden">
          {vehicle.mainImageUrl ? (
            <Image src={vehicle.mainImageUrl} alt={vehicle.name} fill className="object-cover" priority />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

          <div className="relative w-full max-w-6xl mx-auto px-6 pb-8 z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-black uppercase italic tracking-[0.02em] text-zinc-100 text-4xl md:text-6xl leading-[0.9] drop-shadow-lg">
                  {vehicle.name}
                </h1>
                <p className="text-lg font-mono tracking-wider text-zinc-400 mt-2">
                  {vehicle.make} {vehicle.model}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-500">RECOMPENSA</p>
                  <p className="text-2xl font-black italic text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                    {vehicle.user.bountyScore} PTS
                  </p>
                </div>
                <div className="w-14 h-14 border-2 border-zinc-700 bg-zinc-900 flex items-center justify-center">
                  <span className="text-xl font-black italic text-zinc-600">?</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── Left: Specs ─── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Respete & Stats */}
            <div className="flex items-center justify-between border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-5">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-500">RESPETO</p>
                  <p className="text-2xl font-black italic text-yellow-400">{vehicle.respectCount}</p>
                </div>
                {vehicle.power && (
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-500">POTENCIA</p>
                    <p className="text-xl font-black italic text-zinc-300">{vehicle.power} HP</p>
                  </div>
                )}
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-500">MODS</p>
                  <p className="text-xl font-black italic text-zinc-300">{vehicle.modifications.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono tracking-widest text-zinc-600">POR @{vehicle.user.username}</span>
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

              {Object.entries(groupedMods).map(([cat, mods]) => (
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
              ))}
            </div>
          </div>

          {/* ─── Right: Sidebar ─── */}
          <div className="space-y-6">
            {/* Respete Button */}
            <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-4">DAR RESPETO</p>
              <RespectButton vehicleId={vehicle.id} hasVoted={false} />
              <p className="text-[9px] font-mono tracking-widest text-zinc-600 mt-3 text-center">
                +5 PTS DE RECOMPENSA AL DUEÑO
              </p>
            </div>

            {/* Share Button */}
            <ShareButton slug={vehicle.slug} />

            {/* Owner info */}
            <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-3">PROPIETARIO</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                  <span className="text-sm font-black italic text-zinc-600">?</span>
                </div>
                <div>
                  <p className="font-bold uppercase italic tracking-wider text-zinc-100 text-sm">{vehicle.user.displayName || vehicle.user.username}</p>
                  <p className="text-[10px] font-mono tracking-widest text-zinc-600">@{vehicle.user.username}</p>
                </div>
              </div>
              {vehicle.city && (
                <p className="text-[10px] font-mono tracking-widest text-zinc-600 mt-3">
                  {vehicle.city}
                </p>
              )}
            </div>

            {/* Stats Card */}
            <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-3">ESTADÍSTICAS</p>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono tracking-wider">
                  <span className="text-zinc-500">Respeto</span>
                  <span className="text-yellow-400">{vehicle.respectCount}</span>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
