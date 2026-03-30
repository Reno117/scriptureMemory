"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import VerseModal from "./VerseModal";

type Verse = {
  id: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  isMemorized: boolean;
  isSeed: boolean;
  imageUrl: string | null;
  createdAt: Date;
};

type SoloRow = { type: "solo"; verse: Verse };
type GroupRow = { type: "group"; verses: Verse[] };
type DisplayRow = SoloRow | GroupRow;

function areSiblings(a: Verse, b: Verse): boolean {
  return (
    a.book === b.book &&
    a.chapter === b.chapter &&
    a.translation === b.translation &&
    b.verse === a.verse + 1 &&
    Math.abs(new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) < 2000
  );
}

function groupVerses(verses: Verse[]): DisplayRow[] {
  if (verses.length === 0) return [];

  const sorted = [...verses].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const rows: DisplayRow[] = [];
  let i = 0;

  while (i < sorted.length) {
    let j = i + 1;
    while (j < sorted.length && areSiblings(sorted[j - 1], sorted[j])) j++;
    if (j - i === 1) {
      rows.push({ type: "solo", verse: sorted[i] });
    } else {
      rows.push({ type: "group", verses: sorted.slice(i, j) });
    }
    i = j;
  }

  return rows;
}

function rangeReference(verses: Verse[]): string {
  const first = verses[0];
  const last = verses[verses.length - 1];
  if (first.verse === last.verse) return first.reference;
  return `${first.book} ${first.chapter}:${first.verse}–${last.verse}`;
}

export default function VerseList({
  verses,
  totalCount,
  page,
  pageSize,
}: {
  verses: Verse[];
  totalCount: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [modalVerse, setModalVerse] = useState<Verse | null>(null);
  const [modalGroup, setModalGroup] = useState<Verse[] | null>(null);
  const totalPages = Math.ceil(totalCount / pageSize);
  const rows = groupVerses(verses);

  const openSolo = (v: Verse) => { setModalVerse(v); setModalGroup(null); };
  const openGroup = (vs: Verse[]) => { setModalVerse(vs[0]); setModalGroup(vs); };
  const closeModal = () => { setModalVerse(null); setModalGroup(null); };

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      {modalVerse && (
        <VerseModal
          verse={modalVerse}
          verses={modalGroup ?? undefined}
          onClose={closeModal}
        />
      )}

      {verses.length === 0 && (
        <div className="text-center py-16 text-stone-400 text-sm">
          No verses found. Try a different search.
        </div>
      )}

      <div className="space-y-4">
        {rows.map((row, rowIdx) => {
          if (row.type === "solo") {
            const v = row.verse;
            return (
              <div
                key={v.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openSolo(v)}
              >
                <div className="flex items-stretch">
                  <div className="w-24 shrink-0">
                    <img
                      src={v.imageUrl ?? "/placeholder.jpg"}
                      alt={v.reference}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.jpg"; }}
                    />
                  </div>
                  <div className="flex-1 p-5 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                          {v.reference} · {v.translation}
                        </p>
                        {v.isMemorized && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Memorized ✓
                          </span>
                        )}
                      </div>
                      <p className="text-stone-700 text-sm leading-relaxed">{v.text}</p>
                    </div>
                    <Link
                      href={`/verses/${v.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 text-xs text-stone-400 border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          }

          const { verses: groupVs } = row;
          const first = groupVs[0];
          const allMemorized = groupVs.every((v) => v.isMemorized);
          const someMemorized = groupVs.some((v) => v.isMemorized);
          const rangeRef = rangeReference(groupVs);

          return (
            <div
              key={rowIdx}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openGroup(groupVs)}
            >
              <div className="flex items-stretch">
                <div className="w-24 shrink-0">
                  <img
                    src={first.imageUrl ?? "/placeholder.jpg"}
                    alt={rangeRef}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.jpg"; }}
                  />
                </div>
                <div className="flex-1 p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                      {rangeRef} · {first.translation}
                    </p>
                    {allMemorized && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Memorized ✓
                      </span>
                    )}
                    {!allMemorized && someMemorized && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        Partially memorized
                      </span>
                    )}
                  </div>
                  <div className="divide-y divide-stone-100">
                    {groupVs.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-start justify-between gap-4 py-2 first:pt-0 last:pb-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-stone-700 text-sm leading-relaxed">
                          <span className="text-stone-400 font-medium mr-1.5">{v.verse}</span>
                          {v.text}
                        </p>
                        <Link
                          href={`/verses/${v.id}/edit`}
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 text-xs text-stone-400 border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-8">
        <p className="text-xs text-stone-400">
          Page {page} of {totalPages} · {totalCount} total verses
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="text-sm px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="text-sm px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}