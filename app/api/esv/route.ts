import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) return NextResponse.json({ error: "No reference provided" }, { status: 400 });

  const res = await fetch(
    `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(reference)}&include-headings=false&include-footnotes=false&include-verse-numbers=false&include-short-copyright=false&include-passage-references=false`,
    {
      headers: {
        Authorization: `Token ${process.env.ESV_API_KEY}`,
      },
    }
  );

  const data = await res.json();
  const text = data.passages?.[0]?.trim() ?? null;

  return NextResponse.json({ text });
}