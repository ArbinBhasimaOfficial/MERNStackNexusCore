import Sidebar from "@/components/layout/Sidebar";

export default function ReportsPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font bold">Nexus Core Reports</h1>
      </main>
    </div>
  );
}
