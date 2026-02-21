"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addVerse } from "@/app/actions/verses";
import { AnyAaaaRecord } from "dns";

export default function AddVerseForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [form, setForm] = useState({
    book: "",
    chapter: "",
    verse: "",
    text: "",
    translation: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await addVerse({
        ...form,
        reference: `${form.book} ${form.chapter}:${form.verse}`,
        chapter: parseInt(form.chapter),
        verse: parseInt(form.verse),
      });
      router.push("/");
      router.refresh(); // forces the page to re-fetch
    } catch (err) {
      if ((err as any)?.digest?.startsWith("NEXT_REDIRECT")) throw err;
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4"
    >
      <h2 className="text-lg font-serif font-semibold text-stone-800">
        Add a Verse
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-widest">
            Book
          </label>
          <input
            name="book"
            value={form.book}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-widest">
            Translation
          </label>
          <input
            name="translation"
            value={form.translation}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-widest">
            Chapter
          </label>
          <input
            name="chapter"
            value={form.chapter}
            onChange={handleChange}
            required
            type="number"
            className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-widest">
            Verse
          </label>
          <input
            name="verse"
            value={form.verse}
            onChange={handleChange}
            required
            type="number"
            className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-stone-500 uppercase tracking-widest">
            Verse Text
          </label>
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "loading"}
          className="text-sm px-5 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "Saving..." : "Add Verse"}
        </button>
        {status === "error" && (
          <p className="text-xs text-red-500">
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </form>
  );
}
