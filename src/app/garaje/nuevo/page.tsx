"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AGGRESSIVE_EASE } from "@/components/Animated";
import Link from "next/link";

type Step = 1 | 2 | 3;
type ModEntry = { category: string; title: string; brand: string };

const CATEGORIES = [
  "Escape", "Repro ECU", "Suspensión", "Polarizado/PPF",
  "Llantas", "Estética", "Audio", "Motor", "Transmisión", "Otro",
];

const fadeIn = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function NuevoProyectoPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1 - Ficha
  const [name, setName] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [power, setPower] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Step 2 - Mods
  const [mods, setMods] = useState<ModEntry[]>([]);
  const [modCategory, setModCategory] = useState(CATEGORIES[0]);
  const [modTitle, setModTitle] = useState("");
  const [modBrand, setModBrand] = useState("");

  // Step 3 - Workshop
  const [wsName, setWsName] = useState("");
  const [wsCity, setWsCity] = useState("");
  const [wsInstagram, setWsInstagram] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const data = await api.upload(file);
      if (data.url) setImageUrl(data.url);
    } catch { /* ignore */ }
    setUploading(false);
  };

  const addMod = () => {
    if (!modTitle.trim()) return;
    setMods([...mods, { category: modCategory, title: modTitle, brand: modBrand }]);
    setModTitle("");
    setModBrand("");
  };

  const removeMod = (i: number) => setMods(mods.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !make || !model) { setError("Completa los campos obligatorios"); return; }
    setSubmitting(true);
    setError("");

    try {
      const vehicleData = {
        name, make, model,
        year: year || undefined,
        power: power || undefined,
        city: city || "Santiago",
        mainImageUrl: imageUrl || undefined,
        description,
        modifications: mods,
        workshop: wsName.trim() ? {
          name: wsName,
          cityRegion: wsCity || "Santiago",
          instagram: wsInstagram || undefined,
        } : undefined,
      };

      const result = await api.vehicles.create(vehicleData);
      if (result.success) {
        router.push(`/b/${result.slug}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-nfs-bg bg-carbon">
      <div className="absolute inset-0 bg-grid pointer-events-none z-0 opacity-30" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-800/70">
        <Link href="/garaje" className="flex items-center gap-3">
          <span className="w-2 h-2 bg-yellow-500 rotate-45" />
          <span className="font-black uppercase italic tracking-[0.15em] text-zinc-100 text-base">BLACKLIST</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-widest text-yellow-500/70">
            PASO {step} / 3
          </span>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-6 h-0.5 ${s <= step ? "bg-yellow-500" : "bg-zinc-800"}`} />
            ))}
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <span className="w-1.5 h-10 bg-yellow-500/80" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-500/60 mb-0.5">
              {step === 1 ? "PASO 1 // FICHA TÉCNICA" : step === 2 ? "PASO 2 // MODIFICACIONES" : "PASO 3 // TALLER & RESEÑA"}
            </p>
            <h1 className="hud-header text-2xl">
              {step === 1 ? "NUEVO PROYECTO" : step === 2 ? "ESPECIFICACIONES" : "VERIFICAR TALLER"}
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 border border-red-500/30 bg-red-500/5 px-4 py-3">
            <p className="text-[11px] font-mono tracking-wider text-red-400">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" {...fadeIn} transition={{ duration: 0.35, ease: AGGRESSIVE_EASE }}>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">MARCA *</label>
                    <input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Mazda" required className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono tracking-wider placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">MODELO *</label>
                    <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="RX-7 FD3S" required className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono tracking-wider placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">NOMBRE DEL PROYECTO *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Proyecto Alba" required className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono tracking-wider placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">AÑO</label>
                    <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2001" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">POTENCIA (HP)</label>
                    <input value={power} onChange={(e) => setPower(e.target.value)} placeholder="350" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">CIUDAD</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Santiago" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">DESCRIPCIÓN</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Cuenta la historia de tu build..." className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono tracking-wider placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 resize-none" />
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">FOTO PRINCIPAL</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMainImage(file);
                      setImagePreview(URL.createObjectURL(file));
                      handleImageUpload(file);
                    }
                  }} className="w-full text-zinc-400 text-xs font-mono file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-zinc-800 file:text-zinc-300 file:text-xs file:font-bold file:uppercase file:tracking-wider hover:file:bg-zinc-700" />
                  {uploading && <p className="text-[10px] font-mono text-yellow-500/70 mt-2">Subiendo imagen...</p>}
                  {imagePreview && (
                    <div className="mt-3 h-40 bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                      <img src={imagePreview} alt="" className="h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button onClick={() => setStep(2)} className="bg-yellow-500 text-black font-bold uppercase tracking-[0.2em] px-10 py-4 text-sm transition-all duration-300 hover:brightness-110">
                    SIGUIENTE: MODIFICACIONES
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" {...fadeIn} transition={{ duration: 0.35, ease: AGGRESSIVE_EASE }}>
              <div className="space-y-5">
                <div className="p-4 border border-zinc-800 bg-zinc-950/50">
                  <p className="text-[10px] font-mono tracking-widest text-zinc-500 mb-3">AGREGAR MODIFICACIÓN</p>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <select value={modCategory} onChange={(e) => setModCategory(e.target.value)} className="bg-zinc-900 border border-zinc-700 px-3 py-3 text-zinc-100 text-xs font-mono tracking-wider focus:outline-none focus:border-yellow-500/50">
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <input value={modTitle} onChange={(e) => setModTitle(e.target.value)} placeholder="Título de la mod" className="bg-zinc-900 border border-zinc-700 px-3 py-3 text-zinc-100 text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50" />
                    <input value={modBrand} onChange={(e) => setModBrand(e.target.value)} placeholder="Marca (opcional)" className="bg-zinc-900 border border-zinc-700 px-3 py-3 text-zinc-100 text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50" />
                  </div>
                  <button onClick={addMod} className="border border-zinc-700 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 transition-all duration-300 hover:border-yellow-500/40 hover:text-yellow-400">
                    + AGREGAR
                  </button>
                </div>

                {mods.length === 0 ? (
                  <p className="text-zinc-600 text-xs font-mono tracking-wider text-center py-8">A\u00FAn no has agregado modificaciones</p>
                ) : (
                  <div className="space-y-2">
                    {mods.map((m, i) => (
                      <div key={i} className="flex items-center justify-between border border-zinc-800/60 bg-zinc-950/50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-yellow-500/60 bg-yellow-500/10 px-2 py-1">{m.category}</span>
                          <span className="text-sm font-mono tracking-wider text-zinc-300">{m.title}</span>
                          {m.brand && <span className="text-[10px] font-mono text-zinc-600">por {m.brand}</span>}
                        </div>
                        <button onClick={() => removeMod(i)} className="text-zinc-600 hover:text-red-400 text-xs font-mono transition-colors">[X]</button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="border border-zinc-700 text-zinc-400 font-bold uppercase tracking-[0.2em] px-8 py-4 text-sm transition-all duration-300 hover:border-zinc-600">ANTERIOR</button>
                  <button onClick={() => setStep(3)} className="bg-yellow-500 text-black font-bold uppercase tracking-[0.2em] px-10 py-4 text-sm transition-all duration-300 hover:brightness-110">
                    SIGUIENTE: TALLER
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" {...fadeIn} transition={{ duration: 0.35, ease: AGGRESSIVE_EASE }}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="p-4 border border-zinc-800 bg-zinc-950/50">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-4">DATOS DEL TALLER (OPCIONAL)</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">NOMBRE DEL TALLER</label>
                      <input value={wsName} onChange={(e) => setWsName(e.target.value)} placeholder="Ej: STAGE 3 MOTORSPORT" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">COMUNA / CIUDAD</label>
                      <input value={wsCity} onChange={(e) => setWsCity(e.target.value)} placeholder="Santiago" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">INSTAGRAM</label>
                    <input value={wsInstagram} onChange={(e) => setWsInstagram(e.target.value)} placeholder="@stage3_motorsport" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50" />
                  </div>
                </div>

                <div className="p-4 border border-zinc-800 bg-zinc-950/50">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">CALIFICACIÓN</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setRating(n)} className={`w-10 h-10 border text-sm font-bold transition-all duration-300 ${n <= rating ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400" : "bg-zinc-900 border-zinc-700 text-zinc-600 hover:border-zinc-600"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">COMENTARIO DE LA EXPERIENCIA</label>
                  <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} placeholder="Cuenta cómo fue tu experiencia en el taller..." className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 resize-none" />
                </div>

                <div className="border border-yellow-500/20 bg-yellow-500/5 px-4 py-4">
                  <p className="text-[11px] font-mono tracking-wider text-yellow-400/90 text-center">
                    AL PUBLICAR RECIBIRÁS +50 PUNTOS DE RECOMPENSA
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button type="button" onClick={() => setStep(2)} className="border border-zinc-700 text-zinc-400 font-bold uppercase tracking-[0.2em] px-8 py-4 text-sm transition-all duration-300 hover:border-zinc-600">ANTERIOR</button>
                  <button type="submit" disabled={submitting} className="bg-yellow-500 text-black font-bold uppercase tracking-[0.2em] px-10 py-4 text-sm transition-all duration-300 hover:brightness-110 disabled:opacity-50">
                    {submitting ? "GUARDANDO..." : "PUBLICAR PROYECTO"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
