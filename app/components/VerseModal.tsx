"use client";

import Link from "next/link";

type Verse = {
  id: string;
  reference: string;
  translation: string;
  text: string;
  book: string;
};

export default function VerseModal({ verse, onClose }: { verse: Verse; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
              {verse.reference} · {verse.translation}
            </p>
            <p className="text-stone-700 text-sm leading-relaxed">{verse.text}</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none ml-4">&times;</button>
        </div>

        <div className="border-t border-stone-100 pt-4 space-y-3">
          <p className="text-xs text-stone-500 uppercase tracking-widest">Practice Modes</p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/practice/${verse.id}?mode=firstletter`}
              onClick={onClose}
              className="flex items-center justify-between px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-stone-700">First Letter Mode</p>
                <p className="text-xs text-stone-400 mt-0.5">Type the first letter of each word</p>
              </div>
              <span className="text-stone-400">→</span>
            </Link>
            <Link
              href={`/practice/${verse.id}?mode=full`}
              onClick={onClose}
              className="flex items-center justify-between px-4 py-3 bg-stone-800 rounded-xl hover:bg-stone-700 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-white">Full Memory Mode</p>
                <p className="text-xs text-stone-400 mt-0.5">Type the entire verse from memory</p>
              </div>
              <span className="text-white">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}