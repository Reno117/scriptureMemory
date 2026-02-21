"use client";

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

const PAGE_SIZE = 10;

export default function VerseList({ verses }: { verses: Verse[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(verses.length / PAGE_SIZE);
  const paginated = verses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="space-y-4">
        {paginated.map((v) => (
          <div
            key={v.id}
            className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-stretch gap-0">
              {/* Image */}
              <div className="w-24 shrink-0 relative">
                <img
                  src={v.imageUrl ?? "/placeholder.jpg"}
                  alt={v.reference}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.jpg";
                  }}
                />
              </div>

              {/* Content */}
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
                  <p className="text-stone-700 text-sm leading-relaxed">
                    {v.text}
                  </p>
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
          Page {page} of {totalPages} · {verses.length} verses
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
