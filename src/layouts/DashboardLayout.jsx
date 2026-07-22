import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({
  children,
  activePage,
  onNavigate,
  onLogout,
  pageTitle,
}) {
  return (
    <div dir="rtl" className="flex h-screen w-full" style={{ backgroundColor: "#FBF7EF" }}>
      <Sidebar activePage={activePage} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={pageTitle} onNavigate={onNavigate} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}