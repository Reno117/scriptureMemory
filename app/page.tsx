import { prisma } from "@/lib/prisma";
import VerseList from "@/app/components/VerseList";
import VerseControls from "@/app/components/VerseControls";
import Link from "next/link";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string; pageSize?: string; page?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const cookiePageSize = cookieStore.get("pageSize")?.value;

  const search = params.search ?? "";
  const sort = params.sort ?? "book";
  const pageSize = parseInt(params.pageSize ?? cookiePageSize ?? "10");
  const page = parseInt(params.page ?? "1");

  const where = search
    ? {
        OR: [
          { reference: { contains: search } },
          { book: { contains: search } },
          { text: { contains: search } },
        ],
      }
    : {};

    const orderBy =
  sort === "book" ? [{ book: "asc" as const }, { chapter: "asc" as const }, { verse: "asc" as const }] :
  sort === "recent" ? [{ createdAt: "desc" as const }] :
  sort === "memorized" ? [{ isMemorized: "desc" as const }] :
  [{ book: "asc" as const }];

  const totalCount = await prisma.verse.count({ where });

  const verses = await prisma.verse.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-stone-800 mb-2">Scripture Memory</h1>
              <p className="text-stone-500 text-sm">30 verses worth hiding in your heart</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/statsView"
                className="text-sm px-4 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-100 transition-colors">
                Stats
              </Link>
              <Link href="/addVerse"
                className="text-sm px-5 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors">
                + Add Verse
              </Link>
            </div>
          </div>
        </div>

        <VerseControls search={search} sort={sort} pageSize={pageSize} />
        <VerseList verses={verses} totalCount={totalCount} page={page} pageSize={pageSize} />
      </div>
    </main>
  );
}