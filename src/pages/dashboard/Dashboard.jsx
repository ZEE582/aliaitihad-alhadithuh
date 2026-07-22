import { Baby, Users, GraduationCap, ClipboardCheck, UserPlus, ClipboardList, StickyNote, MessageSquare, Megaphone } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useChildren } from "../../context/ChildrenContext";
import { useParents } from "../../context/ParentsContext";
import { useTeachers } from "../../context/TeachersContext";
import { useClasses } from "../../context/ClassesContext";
import { useUser } from "../../context/UserContext";
import { useMessages } from "../../context/MessagesContext";

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}1A` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-bold" style={{ color: "#2F3A36" }}>{value}</p>
        <p className="text-xs mt-0.5" style={{ color: "#7A8580" }}>{label}</p>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
      <h3 className="text-sm font-bold mb-4" style={{ color: "#2F3A36" }}>{title}</h3>
      {children}
    </div>
  );
}

// ============ داشبورد المعلم ============
function TeacherDashboard({ onNavigate }) {
  const { user } = useUser();
  const { childrenList } = useChildren();
  const { messages } = useMessages();

  const myStudents = childrenList.filter((c) => c.classroom === user.classroom);
  const myStudentIds = myStudents.map((c) => c.id);

  // آخر الرسائل الموجهة له (من أهالي طلابه)
  const incomingMessages = messages
    .filter((m) => myStudentIds.includes(m.childId) && m.fromRole === "parent")
    .slice(-5)
    .reverse();

  const unreadFromParents = messages.filter(
    (m) => myStudentIds.includes(m.childId) && m.fromRole === "parent" && !m.read
  ).length;

  const stats = [
    { key: "students", label: "طلاب صفي", value: myStudents.length, icon: Baby, color: "#4C8577" },
    { key: "unread", label: "رسائل غير مقروءة", value: unreadFromParents, icon: MessageSquare, color: "#C25B4A" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.key} {...s} />
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => onNavigate("attendance")} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9", color: "#4C8577" }}>
          <ClipboardList size={16} />
          تسجيل حضور اليوم
        </button>
        <button onClick={() => onNavigate("notes")} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9", color: "#4C8577" }}>
          <StickyNote size={16} />
          إضافة ملاحظة
        </button>
        <button onClick={() => onNavigate("messages")} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9", color: "#4C8577" }}>
          <Megaphone size={16} />
          إعلان لكل الصف
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="طلاب صفي">
          {myStudents.length === 0 ? (
            <p className="text-sm" style={{ color: "#A8B0AB" }}>لا يوجد طلاب مسجلين بصفك بعد</p>
          ) : (
            <ul className="space-y-2.5">
              {myStudents.map((c) => (
                <li key={c.id} className="flex items-center justify-between text-sm py-1.5">
                  <span style={{ color: "#2F3A36" }}>{c.name}</span>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: c.status === "نشط" ? "#4C857720" : "#C25B4A20", color: c.status === "نشط" ? "#4C8577" : "#C25B4A" }}
                  >
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="آخر رسائل من الأهالي">
          {incomingMessages.length === 0 ? (
            <p className="text-sm" style={{ color: "#A8B0AB" }}>لا يوجد رسائل جديدة</p>
          ) : (
            <ul className="space-y-3">
              {incomingMessages.map((m) => {
                const child = childrenList.find((c) => c.id === m.childId);
                return (
                  <li key={m.id} className="text-sm py-2" style={{ borderBottom: "1px solid #F3EFE3" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold" style={{ color: "#2F3A36" }}>{m.fromName} — {child?.name}</span>
                      {!m.read && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#C25B4A" }} />}
                    </div>
                    <p className="truncate" style={{ color: "#4A5551" }}>{m.text}</p>
                  </li>
                );
              })}
            </ul>
          )}
          <button onClick={() => onNavigate("messages")} className="text-sm font-semibold mt-3" style={{ color: "#4C8577" }}>
            فتح كل الرسائل ←
          </button>
        </Card>
      </div>
    </>
  );
}

// ============ داشبورد المدير (الأصلي) ============
function AdminDashboard({ onNavigate }) {
  const { childrenList } = useChildren();
  const { parentsList } = useParents();
  const { teachersList } = useTeachers();
  const { classesList } = useClasses();

  const activeChildrenCount = childrenList.filter((c) => c.status === "نشط").length;

  const stats = [
    { key: "children", label: "إجمالي الأطفال", value: childrenList.length, icon: Baby, color: "#4C8577" },
    { key: "activeChildren", label: "الأطفال النشطون", value: activeChildrenCount, icon: ClipboardCheck, color: "#E8B24D" },
    { key: "teachers", label: "عدد المعلمين", value: teachersList.length, icon: GraduationCap, color: "#6E8FB0" },
    { key: "parents", label: "أولياء الأمور", value: parentsList.length, icon: Users, color: "#C25B4A" },
  ];

  const classDistribution = classesList.map((cls) => ({
    classroom: cls.name,
    count: childrenList.filter((c) => c.classroom === cls.name).length,
    total: cls.capacity,
  }));

  const recentActivity = [
    { id: 1, text: "تم تسجيل غياب لـ رهف يوسف (صف الفراشات)", time: "قبل 20 دقيقة" },
    { id: 2, text: "أضافت المعلمة نور ملاحظة جديدة لـ يزن الأحمد", time: "قبل ساعة" },
    { id: 3, text: "تم إضافة طفل جديد: سيلين خالد (صف النجوم)", time: "اليوم، 9:15 ص" },
    { id: 4, text: "تحديث بيانات ولي الأمر: أ. محمد درويش", time: "أمس" },
  ];

  const quickActions = [
    { key: "attendance", label: "تسجيل حضور اليوم", icon: ClipboardList },
    { key: "children", label: "إضافة طفل", icon: UserPlus },
    { key: "notes", label: "إضافة ملاحظة", icon: StickyNote },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.key} {...s} />
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {quickActions.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => onNavigate(key)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9", color: "#4C8577" }}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <Card title="توزيع الأطفال حسب الصفوف">
          {classDistribution.length === 0 ? (
            <p className="text-sm" style={{ color: "#A8B0AB" }}>لا يوجد صفوف مسجلة بعد</p>
          ) : (
            <div className="space-y-3">
              {classDistribution.map((c) => (
                <div key={c.classroom}>
                  <div className="flex justify-between text-xs mb-1" style={{ color: "#4A5551" }}>
                    <span>{c.classroom}</span>
                    <span>{c.count}/{c.total}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#F3EFE3" }}>
                    <div className="h-2 rounded-full" style={{ width: `${Math.min((c.count / c.total) * 100, 100)}%`, backgroundColor: "#4C8577" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="غيابات اليوم">
          <p className="text-xs mb-3" style={{ color: "#A8B0AB" }}>سيتم عرضها هون تلقائياً بمجرد تسجيل الحضور اليومي</p>
          <button onClick={() => onNavigate("attendance")} className="text-sm font-semibold" style={{ color: "#4C8577" }}>الذهاب لتسجيل الحضور ←</button>
        </Card>

        <Card title="آخر الملاحظات">
          <button onClick={() => onNavigate("notes")} className="text-sm font-semibold" style={{ color: "#4C8577" }}>عرض كل الملاحظات ←</button>
        </Card>
      </div>

      <Card title="آخر الأنشطة">
        <ul className="space-y-3">
          {recentActivity.map((a) => (
            <li key={a.id} className="flex items-center justify-between text-sm py-2" style={{ borderBottom: "1px solid #F3EFE3" }}>
              <span style={{ color: "#4A5551" }}>{a.text}</span>
              <span className="text-xs shrink-0 mr-4" style={{ color: "#A8B0AB" }}>{a.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

// ============ نقطة الدخول: تقرر أي داشبورد تعرض حسب الدور ============
export default function Dashboard({ onNavigate, onLogout }) {
  const { user } = useUser();

  return (
    <DashboardLayout activePage="dashboard" onNavigate={onNavigate} onLogout={onLogout} pageTitle="لوحة التحكم">
      {user.roleType === "teacher" ? (
        <TeacherDashboard onNavigate={onNavigate} />
      ) : (
        <AdminDashboard onNavigate={onNavigate} />
      )}
    </DashboardLayout>
  );
}