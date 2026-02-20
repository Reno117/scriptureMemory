import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const verses = await prisma.verse.findMany({
    where: { isSeed: true },
    orderBy: [{ book: "asc" }, { chapter: "asc" }, { verse: "asc" }],
  });
  return NextResponse.json(verses);
}