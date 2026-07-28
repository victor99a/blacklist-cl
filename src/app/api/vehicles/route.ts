import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { isPublished: true },
      orderBy: { respectCount: "desc" },
      take: 3,
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
            bountyScore: true,
          },
        },
        modifications: {
          select: {
            id: true,
            category: true,
            title: true,
            brand: true,
            workshop: {
              select: {
                name: true,
                isVerified: true,
              },
            },
          },
        },
        _count: {
          select: { votes: true },
        },
      },
    });

    // Compute stats for the frontend display
    const topVehicles = vehicles.map((v) => {
      const modCount = v.modifications.length;
      const uniqueModCategories = new Set(
        v.modifications.map((m) => m.category),
      ).size;

      // Normalize stats 0-10 scale
      const powerScore = Math.min(10, Math.max(1, ((v.power ?? 250) - 150) / 50));
      const modsScore = Math.min(10, Math.max(1, uniqueModCategories * 2.5));
      const respectScore = Math.min(10, Math.max(1, v.respectCount / 85));

      // Detect tags from modifications
      const tags: string[] = [];
      const allWorkshops = v.modifications
        .map((m) => m.workshop)
        .filter(Boolean);
      if (allWorkshops.some((w) => w!.isVerified)) {
        tags.push("VERIFIED WORKSHOP");
      }
      if (
        v.modifications.some(
          (m) =>
            m.category === "engine" &&
            (m.title.toLowerCase().includes("turbo") ||
              m.title.toLowerCase().includes("nos")),
        )
      ) {
        tags.push("NOS READY");
      }
      const uniqueCategories = [...new Set(v.modifications.map((m) => m.category))];
      const stageKeywords = ["stage", "repro", "tune"];
      if (uniqueCategories.length >= 3) {
        tags.push("STAGE 2");
      }
      if (uniqueCategories.length >= 5) {
        tags.push("FULL BUILD");
      }

      return {
        rank: 0, // Computed client-side
        name: v.name,
        pilot: `@${v.user.username}`,
        vehicle: `${v.make} ${v.model}`,
        city: v.city ?? "",
        power: Math.round(powerScore * 10) / 10,
        mods: Math.round(modsScore * 10) / 10,
        respect: Math.round(respectScore * 10) / 10,
        bounty: v.user.bountyScore,
        tags,
        id: v.id,
        slug: v.slug,
      };
    });

    // Assign ranks
    const result = topVehicles.map((v, i) => ({ ...v, rank: i + 1 }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Error al cargar vehículos" },
      { status: 500 },
    );
  }
}
