"use client";

import { authClient } from "@/lib/auth-client"; // your better-auth client hook
import { addVerse } from "@/app/actions/verses";
import { addLocalVerse } from "@/lib/verseStorage";

export function useAddVerse() {
  const { data: session } = authClient.useSession();

  const add = async (data: {
    reference: string;
    book: string;
    chapter: number;
    verse: number;
    text: string;
    translation: string;
  }) => {
    if (session?.user) {
      return await addVerse(data); // hits the DB
    } else {
      return addLocalVerse(data); // hits localStorage
    }
  };

  return { addVerse: add };
}