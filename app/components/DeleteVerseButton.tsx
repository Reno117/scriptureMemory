"use client";

import { deleteVerse } from "@/app/actions/verses";

export default function DeleteVerseButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this verse?")) return;
    await deleteVerse(id);
  };

  return (
    <button
      onClick={handleDelete}
      className="text-sm px-5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
    >
      Delete Verse
    </button>
  );
}