import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { BOOKS, DEFAULT_IMAGE } from "@/lib/books";

export const dynamic = "force-dynamic";

export async function GET() {
  const verses = await prisma.verse.findMany();

  for (const verse of verses) {
    await prisma.verse.update({
      where: { id: verse.id },
      data: {
        imageUrl: BOOKS[verse.book] ?? DEFAULT_IMAGE,
      },
    });
  }

  return NextResponse.json({ message: "Images seeded!" });
}