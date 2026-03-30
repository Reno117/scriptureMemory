"use client";

import Link from "next/link";

type Verse = {
  id: string;
  reference: string;
  translation: string;
  text: string;
  book: string;
  verse: number;
  chapter: number;
};

function rangeReference(verses: Verse[]): string {
  const first = verses[0];
  const last = verses[verses.length - 1];
  if (first.verse === last.verse) return first.reference;
  return `${first.book} ${first.chapter}:${first.verse}–${last.verse}`;
}

export default function VerseModal({
  verse,
  verses,
  onClose,
}: {
  verse: Verse;
  verses?: Verse[]; // populated when opened from a grouped card
  onClose: () => void;
}) {
  // Normalize: always work with an array internally
  const group: Verse[] = verses && verses.length > 1
    ? [...verses].sort((a, b) => a.verse - b.verse)
    : [verse];

  const isGroup = group.length > 1;
  const reference = isGroup ? rangeReference(group) : verse.reference;

  // Practice links encode all IDs as a comma-separated query param
  const ids = group.map((v) => v.id).join(",");
  const practiceBase = isGroup ? `/practice/group` : `/practice/${verse.id}`;
  const practiceQuery = isGroup ? `?ids=${ids}` : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
              {reference} · {group[0].translation}
            </p>

            {isGroup ? (
              <div className="space-y-2 mt-2">
                {group.map((v) => (
                  <p key={v.id} className="text-stone-700 text-sm leading-relaxed">
                    <span className="text-stone-400 font-medium mr-1.5">{v.verse}</span>
                    {v.text}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-stone-700 text-sm leading-relaxed">{verse.text}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-xl leading-none ml-4"
          >
            &times;
          </button>
        </div>

        {/* Practice modes */}
        <div className="border-t border-stone-100 pt-4 space-y-3">
          <p className="text-xs text-stone-500 uppercase tracking-widest">Practice Modes</p>
          <div className="flex flex-col gap-3">
            <Link
              href={`${practiceBase}?mode=firstletter${isGroup ? `&ids=${ids}` : ""}`}
              onClick={onClose}
              className="flex items-center justify-between px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-stone-700">First Letter Mode</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {isGroup
                    ? `Type the first letter of each word across all ${group.length} verses`
                    : "Type the first letter of each word"}
                </p>
              </div>
              <span className="text-stone-400">→</span>
            </Link>
            <Link
              href={`${practiceBase}?mode=full${isGroup ? `&ids=${ids}` : ""}`}
              onClick={onClose}
              className="flex items-center justify-between px-4 py-3 bg-stone-800 rounded-xl hover:bg-stone-700 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-white">Full Memory Mode</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {isGroup
                    ? `Type all ${group.length} verses from memory`
                    : "Type the entire verse from memory"}
                </p>
              </div>
              <span className="text-white">→</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}