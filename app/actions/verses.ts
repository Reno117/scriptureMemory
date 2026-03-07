"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { BOOKS, DEFAULT_IMAGE } from "@/lib/books";

export async function addVerse(data: {
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  imageUrl?: string;
}) {
  const user = await getCurrentUser();

  await prisma.verse.create({
    data: {
      ...data,
      imageUrl: data.imageUrl ?? BOOKS[data.book] ?? DEFAULT_IMAGE,
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
  const user = await getCurrentUser();
  const { id, ...fields } = data;

  const verse = await prisma.verse.findUnique({ where: { id } });
  if (!verse) redirect("/");
  if (verse.userId !== (user?.id ?? null)) redirect("/");

  // update imageUrl if book changed
  const imageUrl = fields.book ? (BOOKS[fields.book] ?? DEFAULT_IMAGE) : undefined;

  await prisma.verse.update({
    where: { id },
    data: {
      ...fields,
      ...(imageUrl ? { imageUrl } : {}),
    },
  });

  redirect("/");
}

export async function deleteVerse(id: string) {
  const user = await getCurrentUser();

  const verse = await prisma.verse.findUnique({ where: { id } });
  if (!verse) redirect("/");
  if (verse.userId !== (user?.id ?? null)) redirect("/");

  await prisma.verse.delete({ where: { id } });

  redirect("/");
}

export async function getVerseById(id: string) {
  return prisma.verse.findUnique({ where: { id } });
}