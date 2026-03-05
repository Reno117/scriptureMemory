import { getVerseById } from "@/app/actions/verses";
import { notFound } from "next/navigation";
import PracticeClient from "./PracticeClient";

export default async function PracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const { mode } = await searchParams;
  const verse = await getVerseById(id);

  if (!verse) notFound();

  return <PracticeClient verse={verse} mode={mode === "full" ? "full" : "firstletter"} />;
}