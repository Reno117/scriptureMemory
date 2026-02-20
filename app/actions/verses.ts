"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

export async function addVerse(data: {
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return await prisma.verse.create({
    data: {
      ...data,
      userId: user.id,
      isSeed: false,
    },
  });
}