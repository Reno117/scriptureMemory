import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  return await prisma.user.findUnique({
    where: { id: session.user.id },
  });
}