import { notFound, redirect } from "next/navigation";
import { editVerse, getVerseById } from "@/app/actions/verses";
import DeleteVerseButton from "@/app/components/DeleteVerseButton";

export default async function EditVersePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verse = await getVerseById(id);
  if (!verse) notFound();

  async function handleSubmit(formData: FormData) {
    "use server";
    const book = formData.get("book") as string;
    const chapter = parseInt(formData.get("chapter") as string);
    const verseNum = parseInt(formData.get("verse") as string);

    await editVerse({
      id: verse!.id,
      book,
      chapter,
      verse: verseNum,
      text: formData.get("text") as string,
      translation: formData.get("translation") as string,
      reference: `${book} ${chapter}:${verseNum}`,
      isMemorized: formData.get("isMemorized") === "on",
    });

    redirect("/verses");
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-sm p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-serif font-semibold text-stone-800">Edit Verse</h1>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest">{verse.reference} · {verse.translation}</p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-stone-500 uppercase tracking-widest">Book</label>
              <input
                name="book"
                defaultValue={verse.book}
                required
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 uppercase tracking-widest">Translation</label>
              <input
                name="translation"
                defaultValue={verse.translation}
                required
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 uppercase tracking-widest">Chapter</label>
              <input
                name="chapter"
                defaultValue={verse.chapter}
                required
                type="number"
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 uppercase tracking-widest">Verse</label>
              <input
                name="verse"
                defaultValue={verse.verse}
                required
                type="number"
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-stone-500 uppercase tracking-widest">Verse Text</label>
              <textarea
                name="text"
                defaultValue={verse.text}
                required
                rows={4}
                className="mt-1 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isMemorized"
              defaultChecked={verse.isMemorized}
              className="w-4 h-4 rounded border-stone-300 accent-stone-800"
            />
            <span className="text-sm text-stone-600">I have memorized this verse</span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="text-sm px-5 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
            >
              Save Changes
            </button>
            <a
              href="/"
              className="text-sm px-5 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
        <DeleteVerseButton id={verse.id} />
      </div>
    </div>
  );
}