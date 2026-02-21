import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const totalVerses = await prisma.verse.count();
  const memorizedVerses = await prisma.verse.count({
    where: { isMemorized: true },
  });
  const notMemorized = totalVerses - memorizedVerses;
  const memorizedPercent =
    totalVerses > 0 ? Math.round((memorizedVerses / totalVerses) * 100) : 0;

  const byBook = await prisma.verse.groupBy({
    by: ["book"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors mb-6 block"
          >
            ← Back to verses
          </Link>
          <h1 className="text-4xl font-serif font-bold text-stone-800 mb-2">
            Stats
          </h1>
          <p className="text-stone-500 text-sm">
            How your memory work is going
          </p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
              Total Verses
            </p>
            <p className="text-3xl font-serif font-bold text-stone-800">
              {totalVerses}
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
              Page Size
            </p>
            <p className="text-3xl font-serif font-bold text-stone-800">10</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
              Memorized
            </p>
            <p className="text-3xl font-serif font-bold text-green-700">
              {memorizedVerses}
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
              Remaining
            </p>
            <p className="text-3xl font-serif font-bold text-stone-400">
              {notMemorized}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-stone-500 uppercase tracking-widest">
              Memorization Progress
            </p>
            <p className="text-xs font-semibold text-stone-700">
              {memorizedPercent}%
            </p>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{ width: `${memorizedPercent}%` }}
            />
          </div>
        </div>

        {/* By book */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-stone-500 uppercase tracking-widest mb-4">
            Verses by Book
          </p>
          <div className="space-y-2">
            {byBook.map((b) => (
              <div key={b.book} className="flex items-center justify-between">
                <p className="text-sm text-stone-700">{b.book}</p>
                <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                  {b._count.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
