"use client";

import { addVerse } from "@/app/actions/verses";

export function useAddVerse() {
  const add = async (data: {
    reference: string;
    book: string;
    chapter: number;
    verse: number;
    text: string;
    translation: string;
  }) => {
    return await addVerse(data);
  };

  return { addVerse: add };
}