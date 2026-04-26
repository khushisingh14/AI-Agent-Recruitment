"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, ChartColumn, ClipboardList, House, Plus, SearchCheck, Settings, UserRound } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: House, match: (pathname) => pathname === "/" },
  { href: "/candidates", label: "Candidates", icon: SearchCheck, match: (pathname) => pathname.startsWith("/candidates") },
  { href: "/jd-analysis", label: "JD Analysis", icon: ClipboardList, match: (pathname) => pathname.startsWith("/jd-analysis") },
  { href: "/analytics", label: "Analytics", icon: ChartColumn, match: (pathname) => pathname.startsWith("/analytics") },
];

function linkClasses(active) {
  return [
    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
    active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
  ].join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 md:flex">
      <Link href="/" className="mb-8 flex items-center gap-3 rounded-xl px-2 py-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
          <Brain size={22} />
        </div>
        <div>
          <p className="text-lg font-black tracking-tight text-slate-900">TalentAI</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">AI Recruitment</p>
        </div>
      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);

          return (
            <Link key={item.href} href={item.href} className={linkClasses(active)}>
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/jd-analysis"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-px hover:bg-blue-700"
      >
        <Plus size={18} />
        <span>New Search</span>
      </Link>

      <div className="mt-auto space-y-1 border-t border-slate-100 pt-6">
        <Link href="/profile" className={linkClasses(pathname.startsWith("/profile"))}>
          <UserRound size={18} />
          <span>Recruiter Profile</span>
        </Link>
        <Link href="/settings" className={linkClasses(pathname.startsWith("/settings"))}>
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
