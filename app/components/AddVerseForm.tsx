"use client";

import { useState, useRef, useEffect } from "react";
import { addVerse } from "@/app/actions/verses";

const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalm", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
  "James", "1 Peter", "2 Peter", "1 John", "2 John",
  "3 John", "Jude", "Revelation",
];

const TRANSLATIONS = [
  "ESV", "NIV", "KJV", "NLT", "NASB", "CSB", "MSG", "AMP", "NKJV", "RSV",
];

function BookCombobox({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = BOOKS.filter((b) => b.toLowerCase().includes(query.toLowerCase()));

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

export default function AddVerseForm() {
  const [form, setForm] = useState({
    book: "",
    chapter: "",
    verse: "",
    text: "",
    translation: "ESV",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "fetching" | "error">("idle");
  const [fetchError, setFetchError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchESVText = async () => {
    if (!form.book || !form.chapter || !form.verse) {
      setFetchError("Please select a book, chapter, and verse first.");
      return;
    }
    setFetchError("");
    setStatus("fetching");
    try {
      const ref = `${form.book} ${form.chapter}:${form.verse}`;
      const res = await fetch(`/api/esv?reference=${encodeURIComponent(ref)}`);
      const data = await res.json();
      if (data.text) {
        setForm((prev) => ({ ...prev, text: data.text }));
      } else {
        setFetchError("Could not fetch verse. Check the reference and try again.");
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
      await addVerse({
        book: form.book,
        chapter: parseInt(form.chapter),
        verse: parseInt(form.verse),
        text: form.text,
        translation: form.translation,
        reference: `${form.book} ${form.chapter}:${form.verse}`,
      });
    } catch (err) {
      if ((err as any)?.digest?.startsWith("NEXT_REDIRECT")) throw err;
      setStatus("error");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-stone-800 mb-8">Add a Verse</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-5">

        {/* Book */}
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-widest">Book</label>
          <BookCombobox value={form.book} onChange={(val) => setForm((prev) => ({ ...prev, book: val }))} />
        </div>

        {/* Chapter + Verse */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-widest">Chapter</label>
            <input name="chapter" value={form.chapter} onChange={handleChange} required type="number" min="1"
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300" />
          </div>
          <div>
            <label className="text-xs text-stone-500 uppercase tracking-widest">Verse</label>
            <input name="verse" value={form.verse} onChange={handleChange} required type="number" min="1"
              className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300" />
          </div>
        </div>

        {/* Translation */}
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-widest">Translation</label>
          <select name="translation" value={form.translation} onChange={handleChange}
            className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-300">
            {TRANSLATIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* ESV Fetch button */}
        {form.translation === "ESV" && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={fetchESVText}
              disabled={status === "fetching"}
              className="text-sm px-4 py-2 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-100 disabled:opacity-50 transition-colors"
            >
              {status === "fetching" ? "Fetching..." : "Fetch ESV Text"}
            </button>
            {fetchError && <p className="text-xs text-red-500">{fetchError}</p>}
          </div>
        )}

        {/* Verse text */}
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-widest">
            Verse Text {form.translation === "ESV" ? "(auto-filled for ESV)" : ""}
          </label>
          <textarea name="text" value={form.text} onChange={handleChange} required rows={4}
            placeholder={form.translation === "ESV" ? "Click 'Fetch ESV Text' or type manually..." : "Type the verse text..."}
            className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none" />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={status === "loading"}
            className="text-sm px-5 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors">
            {status === "loading" ? "Saving..." : "Add Verse"}
          </button>
          {status === "error" && <p className="text-xs text-red-500">Something went wrong. Try again.</p>}
        </div>
      </form>
    </div>
  );
}