export type LocalVerse = {
  id: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  isMemorized: boolean;
  isSeed: false;
};

const STORAGE_KEY = "guest_verses";

export function getLocalVerses(): LocalVerse[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addLocalVerse(data: Omit<LocalVerse, "id" | "isMemorized" | "isSeed">): LocalVerse {
  const verses = getLocalVerses();
  const newVerse: LocalVerse = {
    ...data,
    id: crypto.randomUUID(),
    isMemorized: false,
    isSeed: false,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...verses, newVerse]));
  return newVerse;
}