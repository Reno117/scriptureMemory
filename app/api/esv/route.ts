import { getCurrentUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

// Matches verse-number markers like [1], [12], [123] injected by the ESV API
const VERSE_NUMBER_REGEX = /\[(\d+)\]/g;

function parseVerses(raw: string): { verse: number; text: string }[] {
  const markers: { verse: number; index: number }[] = [];
  let match: RegExpExecArray | null;

  const regex = new RegExp(VERSE_NUMBER_REGEX.source, "g");
  while ((match = regex.exec(raw)) !== null) {
    markers.push({ verse: parseInt(match[1]), index: match.index });
  }

  if (markers.length === 0) return [];

  return markers.map((marker, i) => {
    const start = marker.index + `[${marker.verse}]`.length;
    const end = i + 1 < markers.length ? markers[i + 1].index : raw.length;
    return { verse: marker.verse, text: raw.slice(start, end).trim() };
  });
}

export async function GET(request: Request) {
  const isAuth = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) return NextResponse.json({ error: "No reference provided" }, { status: 400 });
  if (!isAuth) return NextResponse.json({ error: "Invalid user" }, { status: 400 });

  const res = await fetch(
    `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(reference)}&include-headings=false&include-footnotes=false&include-verse-numbers=true&include-short-copyright=false&include-passage-references=false`,
    {
      headers: {
        Authorization: `Token ${process.env.ESV_API_KEY}`,
      },
    }
  );

  const data = await res.json();
  const raw: string = data.passages?.[0]?.trim() ?? null;

  if (!raw) return NextResponse.json({ text: null, verses: null });

  const verses = parseVerses(raw);

  // Single verse (no markers found): return the old { text } shape so
  // any existing callers aren't broken.
  if (verses.length === 0) {
    return NextResponse.json({ text: raw, verses: null });
  }

  return NextResponse.json({
    verses,
    text: verses.map((v) => v.text).join(" "),
  });
}