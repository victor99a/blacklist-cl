"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import slugify from "@/lib/slugify";

/* ─── Create vehicle with modifications and workshop ─── */
export async function createVehicle(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  const userId = session.user.id;
  const name = formData.get("name") as string;
  const make = formData.get("make") as string;
  const model = formData.get("model") as string;
  const year = parseInt(formData.get("year") as string) || null;
  const power = parseInt(formData.get("power") as string) || null;
  const city = formData.get("city") as string;
  const mainImageUrl = formData.get("mainImageUrl") as string;
  const description = formData.get("description") as string;

  const rawMods = formData.get("modifications") as string;
  const rawWorkshop = formData.get("workshop") as string;

  const modifications: { category: string; title: string; brand?: string }[] =
    rawMods ? JSON.parse(rawMods) : [];

  const workshop: {
    name: string;
    cityRegion: string;
    instagram?: string;
  } | null = rawWorkshop ? JSON.parse(rawWorkshop) : null;

  const baseSlug = slugify(`${make}-${model}-${userId.slice(0, 6)}`);
  const slug = baseSlug;

  // Create or find workshop
  let workshopId: string | null = null;
  if (workshop?.name) {
    const existing = await prisma.workshop.findFirst({
      where: { name: { equals: workshop.name, mode: "insensitive" } },
    });
    if (existing) {
      workshopId = existing.id;
    } else {
      const created = await prisma.workshop.create({
        data: {
          name: workshop.name,
          slug: slugify(workshop.name),
          cityRegion: workshop.cityRegion || "Santiago",
          instagram: workshop.instagram,
        },
      });
      workshopId = created.id;
    }
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      userId,
      name,
      make,
      model,
      year,
      slug,
      power,
      city,
      mainImageUrl,
      description,
      isPublished: true,
      modifications: {
        create: modifications.map((m) => ({
          category: m.category,
          title: m.title,
          brand: m.brand || null,
          workshopId,
        })),
      },
    },
  });

  // +50 bounty reward
  await prisma.user.update({
    where: { id: userId },
    data: { bountyScore: { increment: 50 } },
  });

  // Log bounty
  await prisma.bountyLog.create({
    data: {
      profileId: userId,
      amount: 50,
      action: "publish_vehicle",
      referenceId: vehicle.id,
      description: `Public\u00F3 ${name}`,
    },
  });

  revalidatePath("/garaje");
  return { success: true, slug: vehicle.slug };
}

/* ─── Vote Respect ─── */
export async function voteRespect(vehicleId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Debes iniciar sesi\u00F3n");

  const userId = session.user.id;

  // Check duplicate
  const existing = await prisma.vote.findUnique({
    where: { vehicleId_userId: { vehicleId, userId } },
  });
  if (existing) throw new Error("Ya votaste este proyecto");

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: { userId: true },
  });
  if (!vehicle) throw new Error("Proyecto no encontrado");
  if (vehicle.userId === userId) throw new Error("No puedes votar tu propio proyecto");

  await prisma.vote.create({ data: { vehicleId, userId } });

  // +1 respect
  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { respectCount: { increment: 1 } },
  });

  // +5 bounty to owner
  await prisma.user.update({
    where: { id: vehicle.userId },
    data: { bountyScore: { increment: 5 } },
  });

  await prisma.bountyLog.create({
    data: {
      profileId: vehicle.userId,
      amount: 5,
      action: "receive_respect",
      referenceId: vehicleId,
    },
  });

  revalidatePath(`/b/${vehicleId}`);
  return { success: true };
}
