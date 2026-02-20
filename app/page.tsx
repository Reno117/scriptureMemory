import { prisma } from "@/lib/prisma";
import VerseList from "@/app/components/VerseList";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const verses = await prisma.verse.findMany({
    //where: { isSeed: true },
    orderBy: [{ book: "asc" }, { chapter: "asc" }, { verse: "asc" }],
  });

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-stone-800 mb-2">
            Scripture Memory
          </h1>
          <p className="text-stone-500 text-sm">
            30 verses worth hiding in your heart
          </p>
        </div>
        <VerseList verses={verses} />
        <div className="mt-8">
          <Link
            href="/addVerse"
            className="inline-block text-sm px-5 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
          >
            + Add Verse
          </Link>
        </div>
      </div>
    </main>
  );
}
