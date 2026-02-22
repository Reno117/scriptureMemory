"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

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
};

export default function VerseList({
  verses, totalCount, page, pageSize
}: {
  verses: Verse[];
  totalCount: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / pageSize);

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      {verses.length === 0 && (
        <div className="text-center py-16 text-stone-400 text-sm">
          No verses found. Try a different search.
        </div>
      )}

      <div className="space-y-4">
        {verses.map((v) => (
          <div key={v.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                  className="shrink-0 text-xs text-stone-400 border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8">
        <p className="text-xs text-stone-400">
          Page {page} of {totalPages} · {totalCount} total verses
        </p>
        <div className="flex gap-2">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}
            className="text-sm px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            Previous
          </button>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages}
            className="text-sm px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}