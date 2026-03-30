"use client";

import { useState, useRef, useEffect } from "react";
import { addVerse, addVerses } from "@/app/actions/verses";
import { BOOKS, DEFAULT_IMAGE } from "@/lib/books";

const bookNames = Object.keys(BOOKS);

const TRANSLATIONS = [
  "ESV", "NIV", "KJV", "NLT", "NASB", "CSB", "MSG", "AMP", "NKJV", "RSV",
];

function BookCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = bookNames.filter((b) =>
    b.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); onChange(""); }}
        onFocus={() => setOpen(true)}
        placeholder="Search book..."
        className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-stone-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
          {filtered.map((book) => (
            <li
              key={book}
              onMouseDown={() => { onChange(book); setQuery(book); setOpen(false); }}
              className="px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              {book}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface ParsedVerse {
  book: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
  translation: string;
  imageUrl: string;
}

export default function AddVerseForm() {
  const [form, setForm] = useState({
    book: "",
    chapter: "",
    verseStart: "",
    verseEnd: "",
    translation: "ESV",
  });
  const [manualText, setManualText] = useState("");
  const [fetchedVerses, setFetchedVerses] = useState<ParsedVerse[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "fetching" | "error">("idle");
  const [fetchError, setFetchError] = useState("");

  const isRange = form.verseEnd !== "" && form.verseEnd !== form.verseStart;
  const isESV = form.translation === "ESV";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFetchedVerses([]);
  };

  const buildReference = () => {
    const end = isRange ? `-${form.verseEnd}` : "";
    return `${form.book} ${form.chapter}:${form.verseStart}${end}`;
  };

  const fetchESVText = async () => {
    if (!form.book || !form.chapter || !form.verseStart) {
      setFetchError("Please select a book, chapter, and starting verse first.");
      return;
    }
    setFetchError("");
    setFetchedVerses([]);
    setStatus("fetching");

    try {
      const ref = buildReference();
      const res = await fetch(`/api/esv?reference=${encodeURIComponent(ref)}`);
      const data = await res.json();

      if (data.verses && Array.isArray(data.verses)) {
        const parsed: ParsedVerse[] = data.verses.map((v: { verse: number; text: string }) => ({
          book: form.book,
          chapter: parseInt(form.chapter),
          verse: v.verse,
          reference: `${form.book} ${form.chapter}:${v.verse}`,
          text: v.text,
          translation: "ESV",
          imageUrl: BOOKS[form.book] ?? DEFAULT_IMAGE,
        }));
        setFetchedVerses(parsed);
        // Pre-fill manual text box with the fetched text for easy editing
        setManualText(parsed.map((v) => v.text).join(" "));
      } else if (data.text) {
        const single: ParsedVerse = {
          book: form.book,
          chapter: parseInt(form.chapter),
          verse: parseInt(form.verseStart),
          reference: `${form.book} ${form.chapter}:${form.verseStart}`,
          text: data.text,
          translation: "ESV",
          imageUrl: BOOKS[form.book] ?? DEFAULT_IMAGE,
        };
        setFetchedVerses([single]);
        setManualText(data.text);
      } else {
        setFetchError("Could not fetch verse(s). Check the reference and try again.");
      }
    } catch {
      setFetchError("Failed to fetch ESV text.");
    } finally {
      setStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      if (isESV && fetchedVerses.length > 1) {
        // Multi-verse range fetched from ESV — use bulk action
        await addVerses(fetchedVerses);
      } else {
        // Single verse (ESV or manual) — use the text box value so user edits are respected
        await addVerse({
          book: form.book,
          chapter: parseInt(form.chapter),
          verse: parseInt(form.verseStart),
          text: manualText,
          translation: form.translation,
          reference: `${form.book} ${form.chapter}:${form.verseStart}`,
          imageUrl: BOOKS[form.book] ?? DEFAULT_IMAGE,
        });
      }
    } catch (err) {
      if ((err as any)?.digest?.startsWith("NEXT_REDIRECT")) throw err;
      setStatus("error");
    }
  };

  const canSubmit =
    form.book &&
    form.chapter &&
    form.verseStart &&
    manualText.trim().length > 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-stone-800 mb-8">
        Add Verse{isRange ? "s" : ""}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-5"
      >
        {/* Book */}
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-widest">Book</label>
          <BookCombobox
            value={form.book}
            onChange={(val) => { setForm((prev) => ({ ...prev, book: val })); setFetchedVerses([]); }}
          />
        </div>

        {/* Chapter + verse range */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-widest">Chapter</label>
            <input
              name="chapter"
              value={form.chapter}
              onChange={handleChange}
              required
              type="number"
              min="1"
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-widest">Verse</label>
            <input
              name="verseStart"
              value={form.verseStart}
              onChange={handleChange}
              required
              type="number"
              min="1"
              placeholder="Start"
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-widest">To (optional)</label>
            <input
              name="verseEnd"
              value={form.verseEnd}
              onChange={handleChange}
              type="number"
              min={form.verseStart || "1"}
              placeholder="End"
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
          </div>
        </div>

        {isRange && !isESV && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Verse ranges with auto-fill are only supported for ESV. For other
            translations, please add verses one at a time.
          </p>
        )}

        {/* Translation */}
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-widest">Translation</label>
          <select
            name="translation"
            value={form.translation}
            onChange={handleChange}
            className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-300"
          >
            {TRANSLATIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* ESV fetch button */}
        {isESV && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={fetchESVText}
              disabled={status === "fetching"}
              className="text-sm px-4 py-2 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-100 disabled:opacity-50 transition-colors"
            >
              {status === "fetching"
                ? "Fetching..."
                : isRange
                ? `Fetch ESV Text (${form.verseStart}–${form.verseEnd})`
                : "Fetch ESV Text"}
            </button>
            {fetchError && <p className="text-xs text-red-500">{fetchError}</p>}
          </div>
        )}

        {/* Verse text — always shown, pre-filled by fetch for ESV */}
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-widest">
            Verse Text{isESV ? " (auto-filled, editable)" : ""}
          </label>
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            required
            rows={4}
            placeholder={
              isESV
                ? "Click 'Fetch ESV Text' or type manually..."
                : "Type the verse text..."
            }
            className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
          />
          {fetchedVerses.length > 1 && (
            <p className="text-xs text-stone-400 mt-1">
              Editing this box only affects single-verse saves. The {fetchedVerses.length} individual verses above will be saved as-is when adding a range.
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={status === "loading" || !canSubmit}
            className="text-sm px-5 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            {status === "loading"
              ? "Saving..."
              : fetchedVerses.length > 1
              ? `Add ${fetchedVerses.length} Verses`
              : "Add Verse"}
          </button>
          {status === "error" && (
            <p className="text-xs text-red-500">Something went wrong. Try again.</p>
          )}
          <a
            href="/"
            className="text-sm px-5 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}