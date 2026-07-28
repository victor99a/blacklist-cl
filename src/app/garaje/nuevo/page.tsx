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
  const [specs0_100, setSpecs0_100] = useState("");
  const [drivetrain, setDrivetrain] = useState("AWD");
  const [city, setCity] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<(File | null)[]>([null, null, null, null, null]);
  const [photoUrls, setPhotoUrls] = useState<(string | null)[]>([null, null, null, null, null]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(["", "", "", "", ""]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

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

  const handleImageUpload = async (file: File, index: number) => {
    setUploadingIndex(index);
    try {
      const data = await api.upload(file);
      if (data.url) {
        const newUrls = [...photoUrls];
        newUrls[index] = data.url;
        setPhotoUrls(newUrls);
      }
    } catch { /* ignore */ }
    setUploadingIndex(null);
  };

  const handlePhotoSelect = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const newPhotos = [...photos];
        newPhotos[index] = file;
        setPhotos(newPhotos);
        const newPreviews = [...photoPreviews];
        newPreviews[index] = URL.createObjectURL(file);
        setPhotoPreviews(newPreviews);
        handleImageUpload(file, index);
      }
    };
    input.click();
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
    const newPreviews = [...photoPreviews];
    newPreviews[index] = "";
    setPhotoPreviews(newPreviews);
    const newUrls = [...photoUrls];
    newUrls[index] = null;
    setPhotoUrls(newUrls);
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
      const validUrls = photoUrls.filter((u): u is string => !!u);
      const vehicleData = {
        name, make, model,
        year: year || undefined,
        power: power || undefined,
        specs0_100: specs0_100 || undefined,
        drivetrain: drivetrain || undefined,
        city: city || "Santiago",
        mainImageUrl: validUrls[0] || undefined,
        galleryUrls: validUrls.length > 1 ? validUrls.slice(1) : [],
        description,
        instagram: instagram || undefined,
        tiktok: tiktok || undefined,
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">AÑO</label>
                    <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2001" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">CIUDAD</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Santiago" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                  </div>
                </div>

                {/* HUD Specs */}
                <div className="border border-zinc-800 bg-zinc-950/50 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-yellow-500/60 mb-3">MÉTRICAS FÍSICAS</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">POTENCIA (HP)</label>
                      <input value={power} onChange={(e) => setPower(e.target.value)} placeholder="350" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">0-100 KM/H</label>
                      <input value={specs0_100} onChange={(e) => setSpecs0_100(e.target.value)} placeholder="4.5s" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">TRACCIÓN</label>
                      <div className="flex gap-1">
                        {["AWD", "FWD", "RWD"].map((t) => (
                          <button key={t} type="button" onClick={() => setDrivetrain(t)}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.15em] border transition-all duration-300 ${
                              drivetrain === t
                                ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                                : "bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600"
                            }`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="border border-zinc-800 bg-zinc-950/50 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-yellow-500/60 mb-3">REDES SOCIALES</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">INSTAGRAM</label>
                      <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@usuario" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">TIKTOK</label>
                      <input value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="@usuario (opcional)" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">DESCRIPCIÓN</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Cuenta la historia de tu build..." className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-zinc-100 text-sm font-mono tracking-wider placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 resize-none" />
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">FOTOS DEL PROYECTO (MÁX. 5)</label>
                  <p className="text-[9px] font-mono tracking-widest text-zinc-600 mb-3">La foto #1 será la portada. Clickeá cada slot para subir o reemplazar.</p>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="relative">
                        {photoPreviews[i] ? (
                          <div className="relative aspect-square bg-zinc-900 border border-zinc-700 overflow-hidden group cursor-pointer" onClick={() => handlePhotoSelect(i)}>
                            <img src={photoPreviews[i]} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                              <span className="text-white/0 group-hover:text-white/80 text-[10px] font-bold uppercase tracking-wider">CAMBIAR</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); removePhoto(i); }} className="absolute top-1 right-1 w-5 h-5 bg-black/70 border border-zinc-700 text-zinc-400 hover:text-red-400 text-[10px] font-mono flex items-center justify-center transition-colors">X</button>
                            {i === 0 && <span className="absolute bottom-1 left-1 text-[7px] font-bold uppercase tracking-wider bg-yellow-500/80 text-black px-1 py-0.5">PORTADA</span>}
                          </div>
                        ) : (
                          <div onClick={() => handlePhotoSelect(i)} className="aspect-square bg-zinc-900 border border-zinc-800 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-zinc-600 transition-colors">
                            <span className="text-zinc-600 text-lg font-mono">{uploadingIndex === i ? "..." : "+"}</span>
                            <span className="text-[7px] font-mono tracking-widest text-zinc-700 mt-1">SLOT {i + 1}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
