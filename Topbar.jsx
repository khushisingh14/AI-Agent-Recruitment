"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Search, Settings } from "lucide-react";

export default function Topbar({ searchPlaceholder = "Search candidates, jobs..." }) {
  const { data: session } = useSession();
  const displayName = session?.user?.name || "Recruiter";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-8">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-72 rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder={searchPlaceholder}
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>

          <Link
            href="/settings"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Open settings"
          >
            <Settings size={18} />
          </Link>

          <Link href="/profile" className="overflow-hidden rounded-full border border-slate-200">
            <div
              className="flex h-10 w-10 items-center justify-center bg-slate-200 text-xs font-bold text-slate-700"
              title={displayName}
            >
              {initials || "TA"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
