"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

export async function addVerse(data: {
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}) {
  const user = await getCurrentUser();

  await prisma.verse.create({
    data: {
      ...data,
      userId: user?.id ?? null,
      isSeed: false,
    },
  });

  redirect("/");
}

export async function editVerse(data: {
  id: string;
  reference?: string;
  book?: string;
  chapter?: number;
  verse?: number;
  text?: string;
  translation?: string;
  isMemorized?: boolean;
}) {
  const { id, ...fields } = data;

  await prisma.verse.update({
    where: { id },
    data: fields,
  });

  redirect("/");
}

export async function getVerseById(id: string) {
  return prisma.verse.findUnique({ where: { id } }); // or however your DB is set up
}