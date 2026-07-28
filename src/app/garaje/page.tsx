import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function GarajePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userId = session.user.id;

  const [user, vehicles] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, displayName: true, avatarUrl: true, bountyScore: true, tier: true },
    }),
    prisma.vehicle.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, make: true, model: true, slug: true, mainImageUrl: true, respectCount: true, power: true, year: true },
    }),
  ]);

  if (!user) redirect("/");

  const tierLabel = user.tier === "founder" ? "FUNDADOR" : user.tier === "pro" ? "PRO" : "PILOTO";

  return (
    <main className="min-h-screen bg-nfs-bg bg-carbon">
      <div className="absolute inset-0 bg-grid pointer-events-none z-0 opacity-40" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-800/70">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-2 h-2 bg-yellow-500 rotate-45" />
          <span className="font-black uppercase italic tracking-[0.15em] text-zinc-100 text-base">BLACKLIST</span>
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-emerald-400/70">GARAJE // PRIVADO</span>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* ─── License Card ─── */}
        <div className="border border-zinc-800 bg-zinc-950/90 backdrop-blur-sm p-6 md:p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-glow-gold rounded-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 border-2 border-yellow-500/30 bg-zinc-900 flex items-center justify-center">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt="" width={80} height={80} className="object-cover w-full h-full" />
              ) : (
                <span className="text-3xl font-black italic text-zinc-700">?</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="hud-header text-2xl md:text-3xl">{user.displayName || user.username}</h1>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/30 px-2 py-1">
                  {tierLabel}
                </span>
              </div>
              <p className="text-sm font-mono tracking-wider text-zinc-500">@{user.username}</p>
            </div>

            {/* Bounty */}
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-1">RECOMPENSA</p>
              <p className="text-3xl font-black italic text-yellow-400 drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]">
                {user.bountyScore.toLocaleString()}
              </p>
              <p className="text-[9px] font-mono tracking-widest text-zinc-600 mt-0.5">PTS</p>
            </div>
          </div>
        </div>

        {/* ─── Garage Header ─── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="w-1.5 h-10 bg-yellow-500/80" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-500/60 mb-0.5">TUS PROYECTOS</p>
              <h2 className="hud-header text-2xl md:text-3xl">EL GARAJE</h2>
            </div>
          </div>
          <Link
            href="/garaje/nuevo"
            className="border border-yellow-500/40 bg-yellow-500/10 px-6 py-3 font-bold uppercase tracking-[0.2em] text-yellow-400 text-xs transition-all duration-300 hover:bg-yellow-500/20 hover:border-yellow-500/60"
          >
            + AGREGAR NUEVO AUTO
          </Link>
        </div>

        {/* ─── Vehicle Grid ─── */}
        {vehicles.length === 0 ? (
          <div className="text-center py-20 border border-zinc-800/50 bg-zinc-950/50">
            <p className="text-zinc-600 text-sm font-mono tracking-wider mb-4">TU GARAJE EST\u00C1 VAC\u00CDO</p>
            <Link
              href="/garaje/nuevo"
              className="inline-block border border-yellow-500/30 px-8 py-4 font-bold uppercase tracking-[0.2em] text-yellow-400/80 text-xs transition-all duration-300 hover:bg-yellow-500/10"
            >
              PUBLICAR PRIMER PROYECTO
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((v) => (
              <div key={v.id} className="group border border-zinc-800 bg-zinc-950/90 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-zinc-700">
                {/* Image */}
                <div className="relative h-44 bg-gradient-to-br from-zinc-800/40 to-zinc-950 flex items-center justify-center overflow-hidden">
                  {v.mainImageUrl ? (
                    <Image src={v.mainImageUrl} alt={v.name} fill className="object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-xl font-black italic text-zinc-800">{v.make}</div>
                      <div className="text-[9px] font-mono tracking-widest text-zinc-700 mt-1">{v.model}</div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                  {v.year && (
                    <span className="absolute top-3 right-3 text-[9px] font-mono tracking-widest text-zinc-600 bg-zinc-950/80 px-2 py-1 border border-zinc-800">
                      {v.year}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-bold uppercase italic tracking-wider text-zinc-100 text-base">{v.name}</h3>
                  <p className="text-xs font-mono tracking-wider text-zinc-500 mt-0.5">{v.make} {v.model}</p>

                  <div className="flex items-center gap-3 mt-3 text-[10px] font-mono tracking-widest text-zinc-600">
                    {v.power && <span>{v.power} HP</span>}
                    <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                    <span className="text-yellow-500/70">RESP {v.respectCount}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800/50">
                    <Link
                      href={`/b/${v.slug}`}
                      className="flex-1 text-center border border-zinc-800 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 transition-all duration-300 hover:border-zinc-700 hover:text-zinc-300"
                    >
                      VER PROYECTO
                    </Link>
                    <button className="flex-1 border border-zinc-800 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-all duration-300 hover:border-yellow-500/30 hover:text-yellow-400">
                      EDITAR
                    </button>
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
