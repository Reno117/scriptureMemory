"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function VerseControls({
  search, sort, pageSize
}: {
  search: string;
  sort: string;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => params.set(key, value));
    params.set("page", "1"); // reset to page 1 on any change
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handlePageSize = (value: string) => {
    document.cookie = `pageSize=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
    updateParams({ pageSize: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        placeholder="Search verses..."
        defaultValue={search}
        onChange={(e) => updateParams({ search: e.target.value })}
        className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
      />
      <select
        value={sort}
        onChange={(e) => updateParams({ sort: e.target.value })}
        className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-300"
      >
        <option value="book">Sort by Book</option>
        <option value="recent">Sort by Recently Added</option>
        <option value="memorized">Sort by Memorized</option>
      </select>
      <select
        value={pageSize}
        onChange={(e) => handlePageSize(e.target.value)}
        className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-300"
      >
        <option value="5">5 per page</option>
        <option value="10">10 per page</option>
        <option value="20">20 per page</option>
        <option value="50">50 per page</option>
      </select>
    </div>
  );
}