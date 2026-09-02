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
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden"
      style={{ backgroundColor: "#FBF7EF" }}
    >
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Application Area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Navbar
          title={pageTitle}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(180deg, #FBF7EF 0%, #F9F6EE 100%)",
          }}
        >
          <div className="w-full max-w-[1600px] mx-auto p-5 sm:p-6 lg:p-7">
            <div className="animate-[fadeIn_0.25s_ease-out]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}