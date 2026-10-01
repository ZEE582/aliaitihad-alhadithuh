import { strings as S } from "../constants/strings";
import { useState, useEffect, useRef } from "react";
import { Bell, Search, LogOut, UserCircle, Menu, X } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useMessages } from "../context/MessagesContext";
import { useChildren } from "../context/ChildrenContext";

export default function Navbar({
  title = S.common.dashboard,
  onNavigate,
  onLogout,
  onMobileMenuToggle,
  isMobileMenuOpen,
}) {
  const { user } = useUser();
  const { messages, markAsRead } = useMessages();
  const { childrenList } = useChildren();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const searchRef = useRef(null);

  const myChildIds =
    user.roleType === "teacher"
      ? childrenList.filter((c) => c.classroom === user.classroom).map((c) => c.id)
      : user.roleType === "parent"
      ? user.childIds || []
      : [];

  const oppositeRole = user.roleType === "teacher" ? "parent" : "teacher";

  const relevantNotifications = messages
    .filter((m) => myChildIds.includes(m.childId) && m.fromRole === oppositeRole && !m.read)
    .slice(-8)
    .reverse();

  const unreadCount = relevantNotifications.length;

  // Close every popover when tapping outside of it.
  useEffect(() => {
    if (!notifOpen && !menuOpen) return;
    const onDocClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [notifOpen, menuOpen]);

  return (
    <header
      dir="rtl"
      className="w-full flex items-center justify-between gap-2 px-3 sm:px-6 py-3 sm:py-4 relative shrink-0"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #EDE7D9",
        paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))",
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile / tablet menu toggle */}
        <button
          onClick={onMobileMenuToggle}
          aria-label="القائمة"
          aria-expanded={!!isMobileMenuOpen}
          className="lg:hidden w-10 h-10 shrink-0 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "#FCFAF4", color: "#4A5551" }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <h2
          className="text-sm sm:text-base md:text-lg font-bold truncate"
          style={{ color: "#2F3A36" }}
        >
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
        {/* البحث السريع مفيد بس للمدير (يدور بجداول كتير)، ما إله معنى للمعلم أو ولي الأمر حالياً */}
        {user.roleType === "admin" && (
          <>
            {/* Mobile/tablet: search collapses into an icon that expands to a
                full-width bar. Typing at 16px prevents iOS zoom. */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={S.sidebar.quickSearchPlaceholder}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#FCFAF4", color: "#4A5551" }}
            >
              <Search size={18} />
            </button>

            <div
              ref={searchRef}
              className={`${searchOpen ? "flex" : "hidden"} md:flex absolute inset-x-0 top-full z-40 px-3 pb-3 md:static md:inset-auto md:p-0`}
            >
              <div className="relative w-full md:w-56">
                <Search
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                  style={{ color: "#A8B0AB" }}
                />
                <input
                  type="text"
                  placeholder={S.sidebar.quickSearchPlaceholder}
                  className="rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none w-full"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* الإشعارات -- مبنية على الرسائل الحقيقية غير المقروءة */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setMenuOpen(false);
            }}
            aria-label={S.sidebar.notificationsTitle}
            className="relative w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#FCFAF4" }}
          >
            <Bell size={18} style={{ color: "#4A5551" }} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -left-1 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white pointer-events-none"
                style={{ backgroundColor: "#C25B4A" }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute left-0 top-12 w-[min(20rem,calc(100vw-1.5rem))] rounded-xl overflow-hidden z-50 shadow-lg animate-slideDown"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between gap-2"
                style={{ borderBottom: "1px solid #F3EFE3" }}
              >
                <p className="text-sm font-bold truncate" style={{ color: "#2F3A36" }}>
                  {S.sidebar.notificationsTitle}
                </p>
                <button
                  onClick={() => setNotifOpen(false)}
                  aria-label={S.common.close}
                  className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#FCFAF4", color: "#7A8580" }}
                >
                  <X size={16} />
                </button>
              </div>
              {relevantNotifications.length === 0 ? (
                <p className="text-sm text-center py-6" style={{ color: "#A8B0AB" }}>
                  {S.sidebar.noNotifications}
                </p>
              ) : (
                <ul className="max-h-[min(20rem,60dvh)] overflow-y-auto">
                  {relevantNotifications.map((n) => {
                    const child = childrenList.find((c) => c.id === n.childId);
                    return (
                      <li key={n.id} style={{ borderBottom: "1px solid #F3EFE3" }}>
                        <button
                          onClick={() => {
                            markAsRead(n.id);
                            setNotifOpen(false);
                            onNavigate && onNavigate("messages");
                          }}
                          className="w-full text-right px-4 py-3 text-sm"
                        >
                          <p style={{ color: "#2F3A36" }}>
                            <span className="font-semibold break-words">{n.fromName}</span>
                            {child && (
                              <span style={{ color: "#7A8580" }}> — {child.name}</span>
                            )}
                          </p>
                          <p className="mt-0.5 line-clamp-2 break-words" style={{ color: "#4A5551" }}>
                            {n.text}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "#A8B0AB" }}>
                            {n.date}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* قائمة المستخدم */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setMenuOpen((v) => !v);
              setNotifOpen(false);
            }}
            aria-label={user.name}
            className="flex items-center gap-2"
          >
            <div
              className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: "#4C8577", color: "#FBF7EF" }}
            >
              {user.name.charAt(3) || user.name.charAt(0)}
            </div>
            <span
              className="text-sm font-medium hidden md:block max-w-[10rem] truncate"
              style={{ color: "#2F3A36" }}
            >
              {user.name}
            </span>
          </button>

          {menuOpen && (
            <div
              className="absolute left-0 top-12 w-[min(12rem,calc(100vw-1.5rem))] rounded-xl overflow-hidden z-50 shadow-lg animate-slideDown"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate && onNavigate("profile");
                }}
                className="w-full flex items-center gap-2 px-4 py-3 md:py-2.5 text-sm text-right"
                style={{ color: "#4A5551" }}
              >
                <UserCircle size={16} className="shrink-0" />
                {S.common.profile}
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout && onLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-3 md:py-2.5 text-sm text-right"
                style={{ color: "#C25B4A" }}
              >
                <LogOut size={16} className="shrink-0" />
                {S.common.logout}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
