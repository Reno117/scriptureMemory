import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const bookImages: Record<string, string> = {
  "Genesis": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400",
  "Psalm": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
  "Proverbs": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
  "Isaiah": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
  "Jeremiah": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400",
  "Matthew": "https://images.unsplash.com/photo-1548081719-2d8d8093ee9a?w=400",
  "John": "https://images.unsplash.com/photo-1476611317561-60117649dd94?w=400",
  "Romans": "https://images.unsplash.com/photo-1499988921418-b7df40ff03f9?w=400",
  "Ephesians": "https://images.unsplash.com/photo-1490750967868-88df5691cc14?w=400",
  "Philippians": "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400",
  "Colossians": "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=400",
  "Galatians": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400",
  "Hebrews": "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=400",
  "James": "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400",
  "1 John": "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400",
  "2 Timothy": "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=400",
  "1 Corinthians": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
};

const defaultImage = "https://images.unsplash.com/photo-1499988921418-b7df40ff03f9?w=400";

export async function GET() {
  const verses = await prisma.verse.findMany();

  for (const verse of verses) {
    await prisma.verse.update({
      where: { id: verse.id },
      data: {
        imageUrl: bookImages[verse.book] ?? defaultImage,
      },
    });
  }

  return NextResponse.json({ message: "Images seeded!" });
}