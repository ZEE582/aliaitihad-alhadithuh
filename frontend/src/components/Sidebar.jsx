import { strings as S } from "../constants/strings";
import {
  LayoutDashboard,
  Baby,
  Users,
  GraduationCap,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  StickyNote,
  FileBarChart,
  UserCircle,
  Settings,
  LogOut,
  MessageSquare,
  Star,
  ClipboardList,
  X,
} from "lucide-react";

import { useUser } from "../context/UserContext";

// ======================================================
// Navigation حسب الدور
// ======================================================

const NAV_BY_ROLE = {
  // ====================================================
  // المدير
  // ====================================================

  admin: [
    {
      key: "dashboard",
      label: S.common.dashboard,
      icon: LayoutDashboard,
    },

    {
      key: "children",
      label: S.common.children,
      icon: Baby,
    },

    {
      key: "parents",
      label: S.common.parents,
      icon: Users,
    },

    {
      key: "teachers",
      label: S.common.teachers,
      icon: GraduationCap,
    },

    {
      key: "classes",
      label: S.common.classes,
      icon: BookOpen,
    },

    {
      key: "subjects",
      label: S.common.subjects,
      icon: BookOpen,
    },

    {
      key: "sessions",
      label: S.common.sessions,
      icon: CalendarClock,
    },

    {
      key: "attendance",
      label: S.common.attendance,
      icon: ClipboardCheck,
    },

    {
      key: "notes",
      label: S.common.notes,
      icon: StickyNote,
    },

    {
      key: "messages",
      label: S.common.messages,
      icon: MessageSquare,
    },

    {
      key: "registration-requests",
      label: S.common.registrationRequests,
      icon: ClipboardList,
    },

    {
      key: "reports",
      label: S.common.reports,
      icon: FileBarChart,
    },
  ],

  // ====================================================
  // السكرتيرة
  // ====================================================

  secretary: [
    {
      key: "dashboard",
      label: S.common.dashboard,
      icon: LayoutDashboard,
    },

    {
      key: "children",
      label: S.common.children,
      icon: Baby,
    },

    {
      key: "parents",
      label: S.common.parents,
      icon: Users,
    },

    {
      key: "teachers",
      label: S.common.teachers,
      icon: GraduationCap,
    },

    {
      key: "classes",
      label: S.common.classes,
      icon: BookOpen,
    },

    {
      key: "sessions",
      label: S.sidebar.sessionsSchedule,
      icon: CalendarClock,
    },

    {
      key: "attendance",
      label: S.sidebar.attendanceAbsence,
      icon: ClipboardCheck,
    },

    {
      key: "notes",
      label: S.common.notes,
      icon: StickyNote,
    },

    {
      key: "messages",
      label: S.common.messages,
      icon: MessageSquare,
    },

    {
      key: "registration-requests",
      label: S.common.registrationRequests,
      icon: ClipboardList,
    },

    {
      key: "reports",
      label: S.common.reports,
      icon: FileBarChart,
    },
  ],

  // ====================================================
  // المعلم
  // ====================================================

  teacher: [
    {
      key: "dashboard",
      label: S.common.dashboard,
      icon: LayoutDashboard,
    },

    {
      key: "children",
      label: S.sidebar.myClassStudents,
      icon: Baby,
    },

    {
      key: "attendance",
      label: S.common.attendance,
      icon: ClipboardCheck,
    },

    {
      key: "notes",
      label: S.common.notes,
      icon: StickyNote,
    },

    {
      key: "sessions",
      label: S.sidebar.mySchedule,
      icon: CalendarClock,
    },

    {
      key: "messages",
      label: S.common.messages,
      icon: MessageSquare,
    },
  ],

  // ====================================================
  // ولي الأمر
  // ====================================================

  parent: [
    {
      key: "children",
      label: S.sidebar.myChildFile,
      icon: Baby,
    },

    {
      key: "attendance",
      label: S.sidebar.attendanceLog,
      icon: ClipboardCheck,
    },

    {
      key: "notes",
      label: S.common.notes,
      icon: StickyNote,
    },

    {
      key: "messages",
      label: S.common.messages,
      icon: MessageSquare,
    },

    {
      key: "rate-teacher",
      label: S.sidebar.rateTeacher,
      icon: Star,
    },
  ],
};

// ======================================================
// Bottom Items
// ======================================================

const bottomItems = [
  {
    key: "profile",
    label: S.common.profile,
    icon: UserCircle,
  },

  {
    key: "settings",
    label: S.common.settings,
    icon: Settings,
  },
];

// ======================================================
// Sidebar
// ======================================================

export default function Sidebar({
  activePage = "dashboard",
  onNavigate,
  onLogout,
  isMobileOpen,
  onMobileClose,
}) {
  const { user } = useUser();

  const navItems =
    NAV_BY_ROLE[user?.roleType] ||
    NAV_BY_ROLE.admin;

  // ======================================================
  // Render Navigation Item
  // ======================================================

  const renderItem = ({
    key,
    label,
    icon: Icon,
  }) => {
    const isActive =
      activePage === key;

    return (
      <button
        key={key}
        type="button"
        onClick={() => {
          if (
            onNavigate
          ) {
            onNavigate(
              key
            );
          }
          // Dismiss the drawer after tapping a link on touch screens
          if (
            onMobileClose
          ) {
            onMobileClose();
          }
        }}
        className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 lg:py-2.5 rounded-xl text-sm font-medium transition text-right min-h-[44px] lg:min-h-0 hover:opacity-95 active:scale-[0.99]"
        style={{
          backgroundColor:
            isActive
              ? "#4C8577"
              : "transparent",

          color: isActive
            ? "#FBF7EF"
            : "#4A5551",
          boxShadow: isActive ? "0 10px 20px rgba(76, 133, 119, 0.15)" : "none",
        }}
      >
        <Icon
          size={18}
          strokeWidth={2}
          className="shrink-0"
        />

        <span className="truncate">
          {label}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          style={{
            paddingTop:
              "env(safe-area-inset-top, 0px)",
            paddingBottom:
              "env(safe-area-inset-bottom, 0px)",
          }}
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        dir="rtl"
        className={`fixed lg:relative h-screen h-[100dvh] w-[min(16rem,82vw)] lg:w-64 flex flex-col shrink-0 px-3 sm:px-4 py-4 sm:py-5 z-50 lg:z-auto transition-transform duration-300 will-change-transform ${
          isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
        style={{
          backgroundColor: "#FFFFFF",
          borderLeft: "1px solid #EDE7D9",
          boxShadow: isMobileOpen ? "0 24px 60px rgba(47, 58, 54, 0.18)" : "none",
          right: 0,
          left: "auto",
          paddingTop:
            "calc(1rem + env(safe-area-inset-top, 0px))",
          paddingBottom:
            "calc(1rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end mb-4">
          <button
            onClick={onMobileClose}
            aria-label={S.common.close}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#FCFAF4", color: "#4A5551" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ==================================================
            Logo
        ================================================== */}

        <div className="flex items-center gap-3 px-2 mb-6 sm:mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "#4C8577",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 32 32"
              fill="none"
            >
              <circle
                cx="16"
                cy="10"
                r="5"
                fill="#FBF7EF"
              />

              <path
                d="M6 27C6 20.925 10.477 16 16 16C21.523 16 26 20.925 26 27"
                stroke="#FBF7EF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <p
              className="text-sm font-bold truncate"
              style={{
                color: "#2F3A36",
              }}
            >
              {S.common.appName}
            </p>

            <p
              className="text-xs truncate"
              style={{
                color: "#A8B0AB",
              }}
            >
              {user?.role ||
                S.sidebar.adminPanelFallback}
            </p>
          </div>
        </div>

        {/* ==================================================
            Main Navigation
        ================================================== */}

        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto -mx-1 px-1 pb-2">
          {navItems.map(
            renderItem
          )}
        </nav>

        {/* ==================================================
            Bottom Navigation
        ================================================== */}

        <div
          className="flex flex-col gap-1.5 pt-4 mt-4"
          style={{
            borderTop:
              "1px solid #EDE7D9",
          }}
        >
          {bottomItems.map(
            renderItem
          )}

          {/* Logout */}

          <button
            type="button"
            onClick={() => {
              if (
                onMobileClose
              ) {
                onMobileClose();
              }
              if (
                onLogout
              ) {
                onLogout();
              }
            }}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 lg:py-2.5 rounded-xl text-sm font-medium transition text-right min-h-[44px] lg:min-h-0"
            style={{
              color: "#C25B4A",
            }}
          >
            <LogOut
              size={18}
              strokeWidth={2}
              className="shrink-0"
            />

            <span className="truncate">
              {S.common.logout}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}