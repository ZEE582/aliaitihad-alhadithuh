import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({
  children,
  activePage,
  onNavigate,
  onLogout,
  pageTitle,
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  // Close the drawer whenever the viewport grows into desktop territory so the
  // overlay is never left stranded over the content.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handle = (e) => {
      if (e.matches) setIsMobileSidebarOpen(false);
    };
    if (mq.addEventListener) mq.addEventListener("change", handle);
    else mq.addListener(handle);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handle);
      else mq.removeListener(handle);
    };
  }, []);

  // Reset scroll to top when navigating between pages (mobile users scroll a
  // long list, then tap the next page and expect to start at the top).
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [activePage]);

  // Lock body scroll while the drawer is open on touch devices.
  useEffect(() => {
    if (!isMobileSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileSidebarOpen]);

  return (
    <div
      dir="rtl"
      className="flex h-screen h-[100dvh] w-full overflow-hidden"
      style={{ backgroundColor: "#FBF7EF" }}
    >
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />

      {/* Main Application Area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Navbar
          title={pageTitle}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobileMenuOpen={isMobileSidebarOpen}
        />

        {/* Page Content */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
          style={{
            background: "linear-gradient(180deg, #FBF7EF 0%, #F9F6EE 100%)",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="w-full max-w-[1600px] mx-auto p-3 sm:p-5 md:p-6 lg:p-7">
            <div className="animate-fadeIn min-w-0">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
