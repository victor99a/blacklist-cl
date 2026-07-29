"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { api, setToken, isAuthenticated } from "@/lib/api";
import {
  RevealSection,
  AnimatedHeading,
  StaggerGrid,
  StaggerItem,
  SportButton,
  HoverCard,
  fadeInUp,
  scaleIn,
  AGGRESSIVE_EASE,
} from "@/components/Animated";
import MusicPlayer from "@/components/MusicPlayer";

type TopVehicle = {
  rank: number;
  name: string;
  pilot: string;
  vehicle: string;
  city: string;
  power: number | null;
  specs0_100: string | null;
  drivetrain: string | null;
  mainImageUrl: string | null;
  modsCount: number;
  respect: number;
  bounty: number;
  tags: string[];
  id: string;
  slug: string;
};

const BENEFITS = [
  {
    icon: "\uD83D\uDD27",
    title: "Descuentos en Autopartes",
    desc: "Accede a precios exclusivos en repuestos, performance y accesorios de talleres verificados.",
  },
  {
    icon: "\u26FD",
    title: "Cupones de Bencina",
    desc: "Recibe recargas y descuentos en bencinera para que llegar a la junta te salga más barato.",
  },
  {
    icon: "\uD83E\uDDFC",
    title: "Lavados & Detailing",
    desc: "Lavados premium y detailing gratuito en talleres asociados al club.",
  },
];

function StatBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{label}</span>
      <div className="nfs-bar flex-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`nfs-bar-segment ${i < Math.round(value) ? "nfs-bar-filled" : "nfs-bar-empty"}`} />
        ))}
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "text-yellow-400 drop-shadow-[0_0_16px_rgba(234,179,8,0.45)]",
    2: "text-zinc-300 drop-shadow-[0_0_8px_rgba(212,212,212,0.2)]",
    3: "text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.2)]",
  };
  return (
    <span className={`text-5xl font-black italic leading-none select-none ${colors[rank] || "text-zinc-800"}`}>
      #{rank.toString().padStart(2, "0")}
    </span>
  );
}

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [topVehicles, setTopVehicles] = useState<TopVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  useEffect(() => {
    api.vehicles.top()
      .then(setTopVehicles)
      .catch(() => setTopVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const data = await api.login(authUsername, authPassword);
      setToken(data.token);
      setAuthSuccess("Acceso concedido. Redirigiendo...");
      setTimeout(() => {
        setShowLogin(false);
        window.location.href = "/garaje";
      }, 800);
    } catch {
      setAuthError("Credenciales inválidas. Intenta de nuevo.");
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    try {
      const data = await api.signup(authUsername, authEmail, authPassword);
      setToken(data.token);
      setAuthSuccess("Licencia creada. Redirigiendo...");
      setTimeout(() => {
        setShowLogin(false);
        window.location.href = "/garaje/bienvenida";
      }, 800);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Error al registrarse");
    }
  };

  const vehicles = topVehicles.length > 0 ? topVehicles : [];

  return (
    <main className="relative min-h-screen bg-nfs-bg bg-carbon overflow-x-hidden">
      <div className="rain-overlay" />
      <div className="grain-overlay" />
      <div className="absolute inset-0 bg-grid pointer-events-none z-[1]" />
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-glow-gold rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-glow-neon rounded-full pointer-events-none z-0" />

      <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: AGGRESSIVE_EASE }} className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-zinc-800/70">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-yellow-500 rotate-45" />
          <span className="font-black uppercase italic tracking-[0.15em] text-zinc-100 text-base">BLACKLIST</span>
          <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-600">RANKING NACIONAL</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-[10px] font-mono tracking-widest text-emerald-400/70">RECOMPENSA: 0 PTS</span>
          <button onClick={() => { setAuthMode("login"); setShowLogin(true); }} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-yellow-400 transition-colors duration-300">INICIAR SESIÓN</button>
        </div>
      </motion.nav>

      {/* SECTION 1 - HERO */}
      <section className="relative z-10 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 pb-16">
        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.5, delay: 0.1, ease: AGGRESSIVE_EASE }} className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 bg-yellow-500 rotate-45" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-yellow-500/60">RANKING BLACKLIST</span>
          <span className="w-1.5 h-1.5 bg-yellow-500 rotate-45" />
        </motion.div>
        <motion.div variants={scaleIn} initial="initial" animate="animate" transition={{ duration: 0.7, delay: 0.2, ease: AGGRESSIVE_EASE }} className="relative">
          <h1 className="font-black uppercase italic tracking-[0.02em] text-zinc-100 text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] text-center select-none glitch-text">BLACK LIST<br />CHILE</h1>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
        </motion.div>
        <motion.p variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.5, delay: 0.4, ease: AGGRESSIVE_EASE }} className="mt-8 max-w-lg text-center text-zinc-400 text-sm tracking-wide leading-relaxed">Sube las fotos de tu proyecto, detalla dónde realizaste cada modificación y gana puntos de recompensa.</motion.p>
        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.5, delay: 0.5, ease: AGGRESSIVE_EASE }} className="mt-6 flex items-center gap-4 text-[10px] font-mono tracking-widest text-zinc-600">
          <span>0 PILOTOS</span>
          <span className="w-1 h-1 bg-zinc-700" />
          <span>{topVehicles.length} PROYECTOS</span>
          <span className="w-1 h-1 bg-zinc-700" />
          <span>0 TALLERES</span>
        </motion.div>
        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.5, delay: 0.6, ease: AGGRESSIVE_EASE }} className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <SportButton onClick={() => { setAuthMode("signup"); setShowLogin(true); }} className="border border-yellow-500/40 bg-yellow-500/10 px-12 py-5 group">
            <span className="font-bold uppercase tracking-[0.25em] text-yellow-400 text-sm">PRESIONA PARA INICIAR</span>
          </SportButton>
          <SportButton onClick={() => document.getElementById("ranking")?.scrollIntoView({ behavior: "smooth" })} className="border border-emerald-500/30 text-emerald-400/90 font-bold uppercase tracking-[0.2em] px-10 py-5 text-sm transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:shadow-[0_0_16px_rgba(16,185,129,0.15)]">VER BLACKLIST</SportButton>
        </motion.div>
      </section>

      {/* SECTION 2 - VALUE PROPOSITION */}
      <RevealSection className="relative z-10 py-24 md:py-32 border-t border-zinc-800/60">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedHeading as="h2" className="hud-header text-3xl md:text-4xl mb-8">ÚNETE AL CLUB</AnimatedHeading>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2, ease: AGGRESSIVE_EASE }} className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">Sube las imágenes de tu proyecto, detalla dónde realizaste cada modificación y gana puntos de recompensa. Cada voto de respeto te acerca al #01 del ranking nacional. La comunidad tuerca más grande de Chile, en un solo lugar.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35, ease: AGGRESSIVE_EASE }} className="mt-10 inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-600 border border-zinc-800 px-6 py-4">
            <span className="w-1.5 h-1.5 bg-yellow-500 rotate-45" />
            +100 PUNTOS DE RECOMPENSA AL REGISTRARTE
            <span className="w-1.5 h-1.5 bg-yellow-500 rotate-45" />
          </motion.div>
        </div>
      </RevealSection>

      {/* SECTION 3 - BENEFITS */}
      <RevealSection className="relative z-10 py-24 md:py-32 border-t border-zinc-800/60 bg-nfs-surface/30">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-start gap-4 mb-16">
            <span className="w-1.5 h-12 bg-yellow-500/80 mt-1 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-500/60 mb-1">RECOMPENSAS</p>
              <AnimatedHeading as="h2" className="hud-header text-3xl md:text-4xl">LLEGA AL #1 Y OBTÉN BENEFICIOS EXCLUSIVOS</AnimatedHeading>
              <p className="text-zinc-500 text-sm tracking-wide mt-2">Mientras más subes en la Blacklist, más grandes son las recompensas.</p>
            </div>
          </div>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {BENEFITS.map((b, i) => (
              <StaggerItem key={i}>
                <HoverCard glow={i === 0} className="border border-zinc-800 hover:border-yellow-500/30 bg-zinc-950/90 backdrop-blur-sm p-8 h-full transition-colors duration-300">
                  <div className="text-3xl mb-5">{b.icon}</div>
                  <h3 className="font-bold uppercase italic tracking-wider text-zinc-100 text-lg mb-3">{b.title}</h3>
                  <p className="text-zinc-400 text-sm tracking-wide leading-relaxed">{b.desc}</p>
                  <div className="mt-6 pt-4 border-t border-zinc-800/50">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500/60">[DISPONIBLE DESDE #5]</span>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </RevealSection>

      {/* SECTION 4 - TOP 3 RANKING */}
      <RevealSection id="ranking" className="relative z-10 py-24 md:py-32 border-t border-zinc-800/60">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-start gap-4 mb-16">
            <span className="w-1.5 h-12 bg-yellow-500/80 mt-1 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-500/60 mb-1">RANKING NACIONAL</p>
              <AnimatedHeading as="h2" className="hud-header text-3xl md:text-4xl">BLACKLIST RANKING TOP 03</AnimatedHeading>
              <p className="text-zinc-500 text-sm tracking-wide mt-1">Los proyectos más respetados de Chile. Datos en vivo desde Railway.</p>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
                <span className="text-[10px] font-mono tracking-widest text-zinc-600">CARGANDO BLACKLIST...</span>
              </div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-20"><p className="text-zinc-600 text-sm font-mono tracking-wider">NINGÚN PROYECTO PUBLICADO AÚN</p></div>
          ) : (
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {vehicles.map((car) => (
                <StaggerItem key={car.id}>
                  <HoverCard glow={car.rank === 1} className={`group overflow-hidden clip-diagonal transition-colors duration-300 ${car.rank === 1 ? "border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)]" : "border border-zinc-800"} bg-nfs-surface/90 backdrop-blur-sm`}>
                    {/* 16:9 image area */}
                    <Link href={`/b/${car.slug}`} className="relative aspect-video bg-gradient-to-br from-zinc-800/40 via-zinc-900/80 to-zinc-950 overflow-hidden block">
                      {car.mainImageUrl ? (
                        <img src={car.mainImageUrl} alt={car.name} className="absolute inset-0 w-full h-full object-cover" />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                      <div className="absolute inset-0 opacity-[0.04]"><div className="absolute top-0 right-0 w-[200%] h-[200%] bg-gradient-to-br from-yellow-500 via-transparent to-transparent rotate-12 translate-y-[-30%]" /></div>
                      {!car.mainImageUrl && (
                        <div className="absolute inset-0 flex items-center justify-center z-[1]">
                          <div className="text-center">
                            <div className="text-xl font-black italic text-zinc-800 select-none">{car.vehicle.split(" ").slice(0, 1).join(" ")}</div>
                            <div className="text-[9px] font-mono tracking-widest text-zinc-700 mt-1">{car.vehicle.split(" ").slice(1).join(" ")}</div>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 z-20"><RankBadge rank={car.rank} /></div>
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/70 border border-yellow-500/30 px-2 py-1">
                        <span className="text-yellow-400 text-xs font-black italic">{car.bounty}</span>
                        <span className="text-[7px] font-mono tracking-widest text-yellow-500/70">PTS</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <h3 className="font-black uppercase italic tracking-wider text-base text-white drop-shadow-lg">{car.vehicle}</h3>
                        <p className="text-[10px] font-mono text-yellow-500 mt-0.5">{car.pilot}</p>
                      </div>
                    </Link>

                    {/* Body */}
                    <div className="p-4">
                      {/* Quick specs 3-col grid */}
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-800 mb-3 text-center">
                        <div>
                          <p className="font-mono text-[11px] tracking-wider text-zinc-300">{car.power ? `${car.power} HP` : "—"}</p>
                          <p className="text-[7px] font-mono tracking-widest text-zinc-600">POTENCIA</p>
                        </div>
                        <div>
                          <p className="font-mono text-[11px] tracking-wider text-zinc-300">{car.specs0_100 || "—"}</p>
                          <p className="text-[7px] font-mono tracking-widest text-zinc-600">0-100</p>
                        </div>
                        <div>
                          <p className="font-mono text-[11px] tracking-wider text-zinc-300">{car.drivetrain || "—"}</p>
                          <p className="text-[7px] font-mono tracking-widest text-zinc-600">TRACCIÓN</p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {car.tags.map((tag) => (
                          <span key={tag} className={`text-[8px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 ${tag === "VERIFIED WORKSHOP" || tag === "NOS READY" ? "text-emerald-400/80 bg-emerald-500/5 border border-emerald-500/20" : "text-orange-400/80 bg-orange-500/5 border border-orange-500/20"}`}>[{tag}]</span>
                        ))}
                      </div>

                      {/* Stat bars */}
                      <div className="space-y-1 mb-3">
                        <StatBar value={car.power ? Math.min(10, car.power / 50) : 0} label="POWER" />
                        <StatBar value={car.modsCount ? Math.min(10, car.modsCount * 2) : 0} label="MODS" />
                        <StatBar value={car.respect ? Math.min(10, car.respect / 85) : 0} label="RESPETO" />
                      </div>

                      {/* CTA */}
                      <div className="pt-3 border-t border-zinc-800/40">
                        <Link href={`/b/${car.slug}`} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 group-hover:text-yellow-500/60 transition-colors duration-300 flex items-center gap-2">VER FICHA COMPLETA<span className="text-yellow-500/50 group-hover:translate-x-1 transition-transform duration-300">→</span></Link>
                      </div>
                    </div>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
          <div className="mt-14 text-center">
            <SportButton onClick={() => document.getElementById("ranking")?.scrollIntoView({ behavior: "smooth" })} className="border border-zinc-800 px-10 py-4 font-bold uppercase tracking-[0.2em] text-zinc-400 text-xs transition-colors duration-300 hover:border-yellow-500/30 hover:text-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.08)]">VER BLACKLIST COMPLETO →</SportButton>
          </div>
        </div>
      </RevealSection>

      <footer className="relative z-10 border-t border-zinc-800/50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-500 rotate-45" /><span className="font-black uppercase italic tracking-[0.15em] text-zinc-600 text-sm">BLACKLIST.CL</span></div>
          <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest text-zinc-700"><span>&copy; 2026 BLACK LIST CHILE</span><span className="hidden sm:inline">SANTIAGO</span></div>
        </div>
      </footer>

      <MusicPlayer />

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-500">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4, ease: AGGRESSIVE_EASE }} className="w-full max-w-md bg-zinc-950/95 border border-zinc-800 backdrop-blur-md p-8 relative">
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-yellow-500/50" /><div className="absolute top-0 left-0 w-[1px] h-8 bg-yellow-500/50" /><div className="absolute top-0 right-0 w-8 h-[1px] bg-yellow-500/50" /><div className="absolute top-0 right-0 w-[1px] h-8 bg-yellow-500/50" /><div className="absolute bottom-0 left-0 w-8 h-[1px] bg-yellow-500/50" /><div className="absolute bottom-0 left-0 w-[1px] h-8 bg-yellow-500/50" /><div className="absolute bottom-0 right-0 w-8 h-[1px] bg-yellow-500/50" /><div className="absolute bottom-0 right-0 w-[1px] h-8 bg-yellow-500/50" />
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3"><span className="w-1.5 h-1.5 bg-yellow-500 rotate-45" /><span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-500/60">LICENCIA DE PILOTO</span><span className="w-1.5 h-1.5 bg-yellow-500 rotate-45" /></div>
              <h2 className="hud-header text-2xl">BLACK LIST CHILE</h2>
              <p className="text-xs text-zinc-500 mt-2 tracking-wide">{authMode === "login" ? "Ingresa tus credenciales." : "Regístrate y obtén +100 PTS de recompensa como Fundador."}</p>
            </div>
            <div className="flex border-b border-zinc-800 mb-6">
              <button onClick={() => { setAuthMode("login"); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 pb-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${authMode === "login" ? "text-yellow-400 border-b-2 border-yellow-500/50" : "text-zinc-600 border-b-2 border-transparent"}`}>INGRESAR</button>
              <button onClick={() => { setAuthMode("signup"); setAuthError(""); setAuthSuccess(""); }} className={`flex-1 pb-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${authMode === "signup" ? "text-yellow-400 border-b-2 border-yellow-500/50" : "text-zinc-600 border-b-2 border-transparent"}`}>REGISTRARSE</button>
            </div>
            {authError && (<div className="mb-4 border border-red-500/30 bg-red-500/5 px-4 py-3"><p className="text-[11px] font-mono tracking-wider text-red-400">{authError}</p></div>)}
            {authSuccess && (<div className="mb-4 border border-emerald-500/30 bg-emerald-500/5 px-4 py-3"><p className="text-[11px] font-mono tracking-wider text-emerald-400">{authSuccess}</p></div>)}
            <form className="space-y-4" onSubmit={authMode === "login" ? handleLogin : handleSignup}>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">NOMBRE DE PILOTO</label>
                <input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} placeholder="ej: @subaru_wrx" required className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono tracking-wider placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-colors duration-300" />
              </div>
              {authMode === "signup" && (
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">EMAIL</label>
                  <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="piloto@blacklist.cl" required className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono tracking-wider placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-colors duration-300" />
                </div>
              )}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">CONTRASEÑA</label>
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono tracking-wider placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-colors duration-300" />
              </div>
              <SportButton type="submit" className="w-full bg-yellow-500 text-black font-bold uppercase tracking-[0.2em] py-4 text-sm">{authMode === "login" ? "ENTRAR AL GARAJE" : "CREAR LICENCIA +100 PTS"}</SportButton>
            </form>
            <div className="flex items-center gap-3 my-6"><div className="flex-1 h-[1px] bg-zinc-800" /><span className="text-[10px] font-mono text-zinc-700 tracking-widest">[ // ]</span><div className="flex-1 h-[1px] bg-zinc-800" /></div>
            <SportButton className="w-full border border-zinc-800 py-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 transition-colors duration-300 hover:border-zinc-700 hover:text-zinc-300">CONTINUAR CON GOOGLE</SportButton>
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-400 transition-colors text-sm font-mono">[X]</button>
          </motion.div>
        </div>
      )}
    </main>
  );
}
