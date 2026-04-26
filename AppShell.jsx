import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AppShell({ children, searchPlaceholder, wide = false }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="min-h-screen md:pl-72">
        <Topbar searchPlaceholder={searchPlaceholder} />
        <div className={wide ? "p-6 md:p-8" : "mx-auto max-w-7xl p-6 md:p-8"}>{children}</div>
      </main>
    </div>
  );
}
