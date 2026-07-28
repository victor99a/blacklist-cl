import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Blacklist.cl database...");

  // ─── Clean existing data ───
  await prisma.vote.deleteMany();
  await prisma.review.deleteMany();
  await prisma.modification.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ───
  const user1 = await prisma.user.create({
    data: {
      username: "subaru_wrx",
      displayName: "Subaru STI Stage 3",
      email: "subaru@blacklist.cl",
      city: "Santiago",
      bountyScore: 2840,
      tier: "pro",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "golfgti_mk75",
      displayName: "Golf GTI Mk7.5",
      email: "golf@blacklist.cl",
      city: "Viña del Mar",
      bountyScore: 1950,
      tier: "pro",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: "s15_spec_r",
      displayName: "Silvia S15 Spec-R",
      email: "s15@blacklist.cl",
      city: "Concepción",
      bountyScore: 1620,
      tier: "free",
    },
  });

  console.log("  ✓ 3 users created");

  // ─── Workshops ───
  const workshop1 = await prisma.workshop.create({
    data: {
      ownerId: user1.id,
      name: "STAGE 3 MOTORSPORT",
      slug: "stage3-motorsport",
      description: "Especialistas en Subaru EJ257 y performance boxer. Repro, turbo, fuel system.",
      cityRegion: "Santiago",
      instagram: "@stage3_motorsport",
      specialties: ["repro", "turbo", "suspensión", "escape"],
      isVerified: true,
      ratingAvg: 4.7,
      ratingCount: 23,
    },
  });

  const workshop2 = await prisma.workshop.create({
    data: {
      name: "VAG CLINIC",
      slug: "vag-clinic",
      description: "Especialistas VAG. Repro Stage 1-3, DSG tune, suspensión.",
      cityRegion: "Viña del Mar",
      instagram: "@vag_clinic",
      specialties: ["repro", "dsg", "suspensión"],
      isVerified: true,
      ratingAvg: 4.5,
      ratingCount: 18,
    },
  });

  const workshop3 = await prisma.workshop.create({
    data: {
      name: "JDM GARAGE SUR",
      slug: "jdm-garage-sur",
      description: "Importación y performance JDM. SR20, RB, 4G63. Especialistas Nissan y Mitsubishi.",
      cityRegion: "Concepción",
      instagram: "@jdm_grage_sur",
      specialties: ["repro", "turbo", "suspensión", "body"],
      isVerified: true,
      ratingAvg: 4.8,
      ratingCount: 15,
    },
  });

  console.log("  ✓ 3 workshops created");

  // ─── Vehicles ───
  const vehicle1 = await prisma.vehicle.create({
    data: {
      userId: user1.id,
      name: "STAGE 3 // STI",
      make: "Subaru",
      model: "WRX STI EJ257",
      year: 2006,
      slug: "subaru-wrx-sti-stage3",
      description: "STI hatchback con build completo Stage 3. Turbo rotated, fuel system, y repro personalizada.",
      power: 420,
      city: "Santiago",
      isPublished: true,
      respectCount: 847,
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      userId: user2.id,
      name: "MK7.5 // REPRO",
      make: "Volkswagen",
      model: "Golf GTI Mk7.5",
      year: 2019,
      slug: "golf-gti-mk75-repro",
      description: "GTI con Stage 2 completo. Downpipe, intercooler, y tune personalizado.",
      power: 350,
      city: "Viña del Mar",
      isPublished: true,
      respectCount: 623,
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      userId: user3.id,
      name: "SILVIA // S15",
      make: "Nissan",
      model: "Silvia Spec-R S15",
      year: 2001,
      slug: "nissan-silvia-s15-spec-r",
      description: "Silvia S15 Spec-R con swap y build orientado a drift. SR20DET forged internals.",
      power: 380,
      city: "Concepción",
      isPublished: true,
      respectCount: 511,
    },
  });

  console.log("  ✓ 3 vehicles created");

  // ─── Modifications ───
  // Subaru
  await prisma.modification.createMany({
    data: [
      {
        vehicleId: vehicle1.id,
        category: "engine",
        title: "Garrett GTX3582R Gen2 Turbo",
        brand: "Garrett",
        description: "Turbo rotated con Tial MV-S 44mm wastegate",
        workshopId: workshop1.id,
      },
      {
        vehicleId: vehicle1.id,
        category: "engine",
        title: "ID1700X Injectors + AEM Fuel Rail",
        brand: "Injector Dynamics",
        description: "Fuel system completo 1300cc",
        workshopId: workshop1.id,
      },
      {
        vehicleId: vehicle1.id,
        category: "exhaust",
        title: "Tomei Expreme Ti Titanium Catback",
        brand: "Tomei",
        description: "Full titanium 3\" catback exhaust",
        workshopId: workshop1.id,
      },
      {
        vehicleId: vehicle1.id,
        category: "suspension",
        title: "Ohlins Road & Track Coilovers",
        brand: "Ohlins",
        workshopId: workshop1.id,
      },
    ],
  });

  // Golf
  await prisma.modification.createMany({
    data: [
      {
        vehicleId: vehicle2.id,
        category: "engine",
        title: "Stage 2 ECU Tune",
        brand: "Unitronic",
        description: "91 octane Stage 2 software + DSG tune",
        workshopId: workshop2.id,
      },
      {
        vehicleId: vehicle2.id,
        category: "exhaust",
        title: "ARM Motorsports Catted Downpipe",
        brand: "ARM",
        description: "3\" catted downpipe + vibrant resonator",
        workshopId: workshop2.id,
      },
      {
        vehicleId: vehicle2.id,
        category: "engine",
        title: "ECS Turbo Inlet + Intercooler",
        brand: "ECS Tuning",
        workshopId: workshop2.id,
      },
      {
        vehicleId: vehicle2.id,
        category: "suspension",
        title: "KW V1 Coilovers",
        brand: "KW",
        workshopId: workshop2.id,
      },
    ],
  });

  // Silvia
  await prisma.modification.createMany({
    data: [
      {
        vehicleId: vehicle3.id,
        category: "engine",
        title: "SR20DET Forged Bottom End",
        brand: "CP Pistons + Carrillo Rods",
        description: "9.0:1 compresión, pistones forjados CP, bielas Carrillo",
        workshopId: workshop3.id,
      },
      {
        vehicleId: vehicle3.id,
        category: "engine",
        title: "Precision 6266 Turbo Kit",
        brand: "Precision",
        description: "Turbo .68 A/R + 44mm wastegate",
        workshopId: workshop3.id,
      },
      {
        vehicleId: vehicle3.id,
        category: "exhaust",
        title: "Blitz NUR-Spec R Catback",
        brand: "Blitz",
        workshopId: workshop3.id,
      },
      {
        vehicleId: vehicle3.id,
        category: "body",
        title: "BN Sports Type 1 Body Kit",
        brand: "BN Sports",
      },
      {
        vehicleId: vehicle3.id,
        category: "interior",
        title: "Bride Zeta III Seats + Nardi Deep Corn",
        brand: "Bride / Nardi",
      },
    ],
  });

  console.log("  ✓ 13 modifications created");

  // ─── Votes (Respeto — one vote from each user per vehicle, for demo) ───
  await prisma.vote.createMany({
    data: [
      { vehicleId: vehicle1.id, userId: user2.id },
      { vehicleId: vehicle1.id, userId: user3.id },
      { vehicleId: vehicle2.id, userId: user1.id },
      { vehicleId: vehicle2.id, userId: user3.id },
      { vehicleId: vehicle3.id, userId: user1.id },
      { vehicleId: vehicle3.id, userId: user2.id },
    ],
    skipDuplicates: true,
  });

  console.log("  ✓ votes seeded");
  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
