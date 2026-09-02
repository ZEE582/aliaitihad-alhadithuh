import { useState } from "react";
import { Bell, Search, LogOut, UserCircle } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useMessages } from "../context/MessagesContext";
import { useChildren } from "../context/ChildrenContext";

export default function Navbar({ title = "لوحة التحكم", onNavigate, onLogout }) {
  const { user } = useUser();
  const { messages, markAsRead } = useMessages();
  const { childrenList } = useChildren();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header
      dir="rtl"
      className="w-full flex items-center justify-between px-6 py-4 relative"
      style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #EDE7D9" }}
    >
      <h2 className="text-lg font-bold" style={{ color: "#2F3A36" }}>
        {title}
      </h2>

      <div className="flex items-center gap-4">
        {/* البحث السريع مفيد بس للمدير (يدور بجداول كتير)، ما إله معنى للمعلم أو ولي الأمر حالياً */}
        {user.roleType === "admin" && (
          <div className="relative hidden sm:block">
            <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: "#A8B0AB" }} />
            <input
              type="text"
              placeholder="بحث سريع..."
              className="rounded-xl py-2 pr-9 pl-3 text-sm outline-none w-56"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }}
            />
          </div>
        )}

        {/* الإشعارات -- مبنية على الرسائل الحقيقية غير المقروءة */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setMenuOpen(false); }}
            className="relative w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#FCFAF4" }}
          >
            <Bell size={18} style={{ color: "#4A5551" }} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -left-1 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: "#C25B4A" }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute left-0 top-12 w-80 rounded-xl overflow-hidden z-50 shadow-lg"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}
            >
              <div className="px-4 py-3" style={{ borderBottom: "1px solid #F3EFE3" }}>
                <p className="text-sm font-bold" style={{ color: "#2F3A36" }}>الإشعارات</p>
              </div>
              {relevantNotifications.length === 0 ? (
                <p className="text-sm text-center py-6" style={{ color: "#A8B0AB" }}>لا يوجد إشعارات جديدة</p>
              ) : (
                <ul className="max-h-80 overflow-y-auto">
                  {relevantNotifications.map((n) => {
                    const child = childrenList.find((c) => c.id === n.childId);
                    return (
                      <li key={n.id} style={{ borderBottom: "1px solid #F3EFE3" }}>
                        <button
                          onClick={() => { markAsRead(n.id); setNotifOpen(false); onNavigate && onNavigate("messages"); }}
                          className="w-full text-right px-4 py-3 text-sm"
                        >
                          <p style={{ color: "#2F3A36" }}>
                            <span className="font-semibold">{n.fromName}</span>
                            {child && <span style={{ color: "#7A8580" }}> — {child.name}</span>}
                          </p>
                          <p className="mt-0.5 truncate" style={{ color: "#4A5551" }}>{n.text}</p>
                          <p className="text-xs mt-1" style={{ color: "#A8B0AB" }}>{n.date}</p>
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
        <div className="relative">
          <button
            onClick={() => { setMenuOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-2"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: "#4C8577", color: "#FBF7EF" }}
            >
              {user.name.charAt(3) || user.name.charAt(0)}
            </div>
            <span className="text-sm font-medium hidden sm:block" style={{ color: "#2F3A36" }}>
              {user.name}
            </span>
          </button>

          {menuOpen && (
            <div
              className="absolute left-0 top-12 w-48 rounded-xl overflow-hidden z-50 shadow-lg"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}
            >
              <button
                onClick={() => { setMenuOpen(false); onNavigate && onNavigate("profile"); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-right"
                style={{ color: "#4A5551" }}
              >
                <UserCircle size={16} />
                الملف الشخصي
              </button>
              <button
                onClick={() => { setMenuOpen(false); onLogout && onLogout(); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-right"
                style={{ color: "#C25B4A" }}
              >
                <LogOut size={16} />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}