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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-stone-800 mb-2">
                Scripture Memory
              </h1>
              <p className="text-stone-500 text-sm">
                30 verses worth hiding in your heart
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/statsView"
                className="text-sm px-4 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
              >
                Stats
              </Link>
              <Link
                href="/addVerse"
                className="text-sm px-5 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
              >
                + Add Verse
              </Link>
            </div>
          </div>
        </div>

        <VerseList verses={verses} />
      </div>
    </main>
  );
}
