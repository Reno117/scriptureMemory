import { getVerseById } from "@/app/actions/verses";
import { notFound } from "next/navigation";
import PracticeClient from "../[id]/PracticeClient";

export default async function GroupPracticePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string; mode?: string }>;
}) {
  const { ids, mode } = await searchParams;

  if (!ids) notFound();

  const idList = ids.split(",").filter(Boolean);
  const verses = await Promise.all(idList.map((id) => getVerseById(id)));

  if (verses.some((v) => !v)) notFound();

  return (
    <PracticeClient
      verse={verses[0]!}
      verses={verses as any}
      mode={mode === "full" ? "full" : "firstletter"}
    />
  );
}