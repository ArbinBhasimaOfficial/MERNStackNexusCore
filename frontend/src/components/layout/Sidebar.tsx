import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-4">
      <div className="p-4 font-bold text-xl">Nexus Core</div>
      <nav className="flex flex-col p-4 gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/companies">Companies</Link>
        <Link href="/reports">Reports</Link>
      </nav>
    </aside>
  );
}
