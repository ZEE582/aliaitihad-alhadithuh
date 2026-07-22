import { GraduationCap, Phone, MessageSquare, User } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useChildren } from "../../context/ChildrenContext";
import { useTeachers } from "../../context/TeachersContext";
import { useUser } from "../../context/UserContext";

export default function MyChildPage({ onNavigate, onLogout, onOpenChild }) {
  const { user } = useUser();
  const { childrenList } = useChildren();
  const { teachersList } = useTeachers();

  const myChildren = childrenList.filter((c) => user.childIds?.includes(c.id));

  if (myChildren.length === 0) {
    return (
      <DashboardLayout activePage="children" onNavigate={onNavigate} onLogout={onLogout} pageTitle="ملف طفلي">
        <p className="text-sm text-center py-10" style={{ color: "#A8B0AB" }}>
          لا يوجد طفل مسجل ببياناتك حالياً. تواصلي مع إدارة الروضة.
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="children" onNavigate={onNavigate} onLogout={onLogout} pageTitle="ملف طفلي">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {myChildren.map((child) => {
          const teacher = teachersList.find((t) => t.classroom === child.classroom);
          return (
            <div key={child.id} className="rounded-2xl p-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ backgroundColor: "#4C8577", color: "#FBF7EF" }}
                >
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: "#2F3A36" }}>{child.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "#7A8580" }}>{child.classroom}</p>
                </div>
              </div>

              <div className="rounded-xl px-3 py-3 mb-4" style={{ backgroundColor: "#FCFAF4", border: "1px solid #F3EFE3" }}>
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap size={14} style={{ color: "#4C8577" }} />
                  <span className="text-xs font-medium" style={{ color: "#7A8580" }}>معلمة الصف</span>
                </div>
                <p className="text-sm font-semibold" style={{ color: "#2F3A36" }}>{teacher?.name || "غير محدد"}</p>
                {teacher?.phone && (
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#A8B0AB" }}>
                    <Phone size={11} /> {teacher.phone}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onOpenChild && onOpenChild(child)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-white"
                  style={{ backgroundColor: "#4C8577" }}
                >
                  <User size={15} />
                  عرض الملف الكامل
                </button>
                <button
                  onClick={() => onNavigate && onNavigate("messages")}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold"
                  style={{ border: "1px solid #E2DCCC", color: "#4A5551" }}
                >
                  <MessageSquare size={15} />
                  تواصل مع المعلمة
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}