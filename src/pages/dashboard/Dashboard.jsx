import {
  Baby,
  Users,
  GraduationCap,
  ClipboardCheck,
  UserPlus,
  ClipboardList,
  StickyNote,
  MessageSquare,
  Megaphone,
  CalendarClock,
  FileBarChart,
  AlertTriangle,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import { useChildren } from "../../context/ChildrenContext";
import { useParents } from "../../context/ParentsContext";
import { useTeachers } from "../../context/TeachersContext";
import { useClasses } from "../../context/ClassesContext";
import { useUser } from "../../context/UserContext";
import { useMessages } from "../../context/MessagesContext";
import { useAttendance } from "../../context/AttendanceContext";

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EDE7D9",
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{
          backgroundColor: `${color}1A`,
        }}
      >
        <Icon size={20} style={{ color }} />
      </div>

      <div>
        <p
          className="text-xl font-bold"
          style={{ color: "#2F3A36" }}
        >
          {value}
        </p>

        <p
          className="text-xs mt-0.5"
          style={{ color: "#7A8580" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EDE7D9",
      }}
    >
      <h3
        className="text-sm font-bold mb-4"
        style={{ color: "#2F3A36" }}
      >
        {title}
      </h3>

      {children}
    </div>
  );
}

// ======================================================
// Dashboard المعلم
// ======================================================

function TeacherDashboard({ onNavigate }) {
  const { user } = useUser();
  const { childrenList } = useChildren();
  const { messages } = useMessages();

  const myStudents = childrenList.filter(
    (c) => c.classroom === user.classroom
  );

  const myStudentIds = myStudents.map(
    (c) => c.id
  );

  const incomingMessages = messages
    .filter(
      (m) =>
        myStudentIds.includes(m.childId) &&
        m.fromRole === "parent"
    )
    .slice(-5)
    .reverse();

  const unreadFromParents = messages.filter(
    (m) =>
      myStudentIds.includes(m.childId) &&
      m.fromRole === "parent" &&
      !m.read
  ).length;

  const activeStudents = myStudents.filter(
    (student) => student.status === "نشط"
  ).length;

  const stats = [
    {
      key: "students",
      label: "أطفال صفي",
      value: myStudents.length,
      icon: Baby,
      color: "#4C8577",
    },
    {
      key: "active",
      label: "أطفال نشطون",
      value: activeStudents,
      icon: ClipboardCheck,
      color: "#6E8FB0",
    },
    {
      key: "unread",
      label: "رسائل غير مقروءة",
      value: unreadFromParents,
      icon: MessageSquare,
      color: "#C25B4A",
    },
  ];

  return (
    <>
      {/* ============================================= */}
      {/* Welcome Hero */}
      {/* ============================================= */}

      <div
        className="rounded-3xl p-6 md:p-7 mb-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #EAF2EF 0%, #F7F4EA 100%)",
          border: "1px solid #DDE9E4",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-40"
          style={{ backgroundColor: "#D8E8E2" }}
        />

        <div
          className="absolute -bottom-16 right-20 w-36 h-36 rounded-full opacity-30"
          style={{ backgroundColor: "#F1DFC0" }}
        />

        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🌷</span>

              <span
                className="text-xs font-semibold"
                style={{ color: "#4C8577" }}
              >
                لوحة المعلمة
              </span>
            </div>

            <h2
              className="text-xl md:text-2xl font-bold"
              style={{ color: "#2F3A36" }}
            >
              صباح الخير، {user?.name}
            </h2>

            <p
              className="text-sm mt-2 leading-6"
              style={{ color: "#68736F" }}
            >
              أهلاً بكِ في يوم جديد مع أطفال{" "}
              <span
                className="font-semibold"
                style={{ color: "#4C8577" }}
              >
                {user?.classroom || "صفك"}
              </span>
              {" "}💚
            </p>
          </div>

          <div
            className="hidden sm:flex w-16 h-16 rounded-3xl items-center justify-center"
            style={{
              backgroundColor: "#FFFFFF90",
              border: "1px solid #FFFFFF",
            }}
          >
            <span className="text-3xl">🌱</span>
          </div>
        </div>

        {/* Small motivation */}
        <div
          className="relative mt-5 pt-4"
          style={{
            borderTop: "1px solid #DDE9E4",
          }}
        >
          <p
            className="text-xs"
            style={{ color: "#7A8580" }}
          >
            "كل يوم فرصة جديدة لزرع فكرة جميلة في قلب طفل." ✨
          </p>
        </div>
      </div>

      {/* ============================================= */}
      {/* Stats */}
      {/* ============================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard
            key={s.key}
            {...s}
          />
        ))}
      </div>

      {/* ============================================= */}
      {/* Quick Actions */}
      {/* ============================================= */}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3
              className="text-sm font-bold"
              style={{ color: "#2F3A36" }}
            >
              اختصارات سريعة
            </h3>

            <p
              className="text-xs mt-1"
              style={{ color: "#A8B0AB" }}
            >
              أهم الأشياء التي قد تحتاجينها اليوم
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate("attendance")}
            className="group rounded-2xl p-4 text-right transition-all duration-200 hover:-translate-y-1"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EDE7D9",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
              style={{
                backgroundColor: "#EAF2EF",
                color: "#4C8577",
              }}
            >
              <ClipboardList size={18} />
            </div>

            <p
              className="text-sm font-bold"
              style={{ color: "#2F3A36" }}
            >
              تسجيل الحضور
            </p>

            <p
              className="text-xs mt-1"
              style={{ color: "#A8B0AB" }}
            >
              سجلي حضور أطفال صفك اليوم
            </p>
          </button>

          <button
            onClick={() => onNavigate("notes")}
            className="group rounded-2xl p-4 text-right transition-all duration-200 hover:-translate-y-1"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EDE7D9",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
              style={{
                backgroundColor: "#FCF3DE",
                color: "#B8862F",
              }}
            >
              <StickyNote size={18} />
            </div>

            <p
              className="text-sm font-bold"
              style={{ color: "#2F3A36" }}
            >
              إضافة ملاحظة
            </p>

            <p
              className="text-xs mt-1"
              style={{ color: "#A8B0AB" }}
            >
              سجلي ملاحظة عن أحد الأطفال
            </p>
          </button>

          <button
            onClick={() => onNavigate("messages")}
            className="group rounded-2xl p-4 text-right transition-all duration-200 hover:-translate-y-1"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EDE7D9",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
              style={{
                backgroundColor: "#FBEAE7",
                color: "#C25B4A",
              }}
            >
              <MessageSquare size={18} />
            </div>

            <p
              className="text-sm font-bold"
              style={{ color: "#2F3A36" }}
            >
              رسائل الأهالي
            </p>

            <p
              className="text-xs mt-1"
              style={{ color: "#A8B0AB" }}
            >
              {unreadFromParents > 0
                ? `لديك ${unreadFromParents} رسائل تحتاج متابعة`
                : "لا توجد رسائل تحتاج متابعة"}
            </p>
          </button>
        </div>
      </div>

      {/* ============================================= */}
      {/* Main Content */}
      {/* ============================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* My Students */}
        <Card title="🌼 أطفال صفي">
          {myStudents.length === 0 ? (
            <div className="text-center py-8">
              <div
                className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
                style={{
                  backgroundColor: "#FCFAF4",
                }}
              >
                <Baby
                  size={22}
                  style={{ color: "#A8B0AB" }}
                />
              </div>

              <p
                className="text-sm mt-3"
                style={{ color: "#A8B0AB" }}
              >
                لا يوجد طلاب مسجلين بصفك بعد
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-xs"
                  style={{ color: "#A8B0AB" }}
                >
                  قائمة أطفال {user?.classroom}
                </p>

                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: "#EAF2EF",
                    color: "#4C8577",
                  }}
                >
                  {activeStudents} نشط
                </span>
              </div>

              <ul className="space-y-2.5">
                {myStudents.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between text-sm py-2 px-3 rounded-xl transition-colors"
                    style={{
                      backgroundColor: "#FCFAF4",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: "#EAF2EF",
                          color: "#4C8577",
                        }}
                      >
                        <Baby size={15} />
                      </div>

                      <span
                        className="font-medium"
                        style={{ color: "#2F3A36" }}
                      >
                        {c.name}
                      </span>
                    </div>

                    <span
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          c.status === "نشط"
                            ? "#4C857720"
                            : "#C25B4A20",

                        color:
                          c.status === "نشط"
                            ? "#4C8577"
                            : "#C25B4A",
                      }}
                    >
                      {c.status}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        {/* Messages */}
        <Card title="💌 آخر رسائل الأهالي">
          {incomingMessages.length === 0 ? (
            <div className="text-center py-8">
              <div
                className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
                style={{
                  backgroundColor: "#FCFAF4",
                }}
              >
                <MessageSquare
                  size={21}
                  style={{ color: "#A8B0AB" }}
                />
              </div>

              <p
                className="text-sm mt-3"
                style={{ color: "#A8B0AB" }}
              >
                صندوق الرسائل هادئ حالياً 🌿
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {incomingMessages.map((m) => {
                const child = childrenList.find(
                  (c) => c.id === m.childId
                );

                return (
                  <li
                    key={m.id}
                    className="text-sm py-2"
                    style={{
                      borderBottom:
                        "1px solid #F3EFE3",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="font-semibold"
                        style={{ color: "#2F3A36" }}
                      >
                        {m.fromName} — {child?.name}
                      </span>

                      {!m.read && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: "#C25B4A",
                          }}
                        />
                      )}
                    </div>

                    <p
                      className="truncate"
                      style={{ color: "#4A5551" }}
                    >
                      {m.text}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            onClick={() => onNavigate("messages")}
            className="text-sm font-semibold mt-3"
            style={{ color: "#4C8577" }}
          >
            فتح كل الرسائل ←
          </button>
        </Card>
      </div>
    </>
  );
}

// ======================================================
// Dashboard السكرتير
// ======================================================

function SecretaryDashboard({ onNavigate }) {
  const { user } = useUser();

  const { childrenList } = useChildren();
  const { parentsList } = useParents();
  const { teachersList } = useTeachers();
  const { classesList } = useClasses();
  const { messages } = useMessages();
  const { records } = useAttendance();

  const activeChildren = childrenList.filter(
    (child) => child.status === "نشط"
  );

  const unreadMessages = messages.filter(
    (message) => !message.read
  ).length;

  // الأطفال الذين لديهم أكثر من 3 غيابات
  const absenceCounts = {};

  records.forEach((record) => {
    if (
      record.status === "absent_excused" ||
      record.status === "absent_unexcused"
    ) {
      absenceCounts[record.childId] =
        (absenceCounts[record.childId] || 0) + 1;
    }
  });

  const childrenNeedFollowUp = childrenList.filter(
    (child) => (absenceCounts[child.id] || 0) > 3
  );

  const stats = [
    {
      key: "children",
      label: "الأطفال النشطون",
      value: activeChildren.length,
      icon: Baby,
      color: "#4C8577",
    },

    {
      key: "parents",
      label: "أولياء الأمور",
      value: parentsList.length,
      icon: Users,
      color: "#C25B4A",
    },

    {
      key: "teachers",
      label: "المعلمون",
      value: teachersList.length,
      icon: GraduationCap,
      color: "#6E8FB0",
    },

    {
      key: "messages",
      label: "رسائل تحتاج متابعة",
      value: unreadMessages,
      icon: MessageSquare,
      color: "#E8B24D",
    },
  ];

  return (
    <>
      {/* ترحيب */}
      <div className="mb-6">

        <h2
          className="text-lg font-bold"
          style={{ color: "#2F3A36" }}
        >
          صباح الخير، {user?.name} 🌷
        </h2>

        <p
          className="text-sm mt-1"
          style={{ color: "#7A8580" }}
        >
          إليك ملخص الأعمال التي تحتاج متابعة اليوم.
        </p>

      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            {...stat}
          />
        ))}

      </div>

      {/* إجراءات سريعة */}
      <div className="flex flex-wrap gap-3 mb-6">

        <button
          onClick={() => onNavigate("children")}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
            color: "#4C8577",
          }}
        >
          <Baby size={16} />
          إدارة الأطفال
        </button>

        <button
          onClick={() => onNavigate("attendance")}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
            color: "#4C8577",
          }}
        >
          <ClipboardCheck size={16} />
          متابعة الحضور
        </button>

        <button
          onClick={() => onNavigate("sessions")}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
            color: "#4C8577",
          }}
        >
          <CalendarClock size={16} />
          جدول الحصص
        </button>

        <button
          onClick={() => onNavigate("messages")}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
            color: "#4C8577",
          }}
        >
          <MessageSquare size={16} />
          الرسائل
        </button>

      </div>

      {/* تنبيهات */}
      {childrenNeedFollowUp.length > 0 && (
        <div
          className="rounded-2xl p-4 mb-6"
          style={{
            backgroundColor: "#FBEAE7",
            border: "1px solid #E8B9AF",
          }}
        >

          <div className="flex items-start gap-3">

            <AlertTriangle
              size={20}
              style={{
                color: "#C25B4A",
              }}
              className="shrink-0 mt-0.5"
            />

            <div>

              <p
                className="text-sm font-bold"
                style={{ color: "#C25B4A" }}
              >
                أطفال يحتاجون متابعة
              </p>

              <p
                className="text-xs mt-1"
                style={{ color: "#7A4A43" }}
              >
                يوجد {childrenNeedFollowUp.length} طفل تجاوز
                3 أيام غياب ويحتاج إلى مراجعة ولي الأمر.
              </p>

              <button
                onClick={() => onNavigate("attendance")}
                className="text-xs font-semibold mt-2"
                style={{ color: "#C25B4A" }}
              >
                مراجعة الغيابات ←
              </button>

            </div>

          </div>

        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* حالة الصفوف */}
        <Card title="🏫 حالة الصفوف">

          {classesList.length === 0 ? (
            <p
              className="text-sm"
              style={{ color: "#A8B0AB" }}
            >
              لا توجد صفوف مسجلة بعد.
            </p>
          ) : (
            <div className="space-y-4">

              {classesList.map((cls) => {

                const count = childrenList.filter(
                  (child) =>
                    child.classroom === cls.name &&
                    child.status === "نشط"
                ).length;

                const percentage =
                  cls.capacity > 0
                    ? Math.min(
                        (count / cls.capacity) * 100,
                        100
                      )
                    : 0;

                return (
                  <div key={cls.id}>

                    <div
                      className="flex justify-between text-xs mb-1.5"
                      style={{ color: "#4A5551" }}
                    >
                      <span>{cls.name}</span>

                      <span>
                        {count} / {cls.capacity}
                      </span>
                    </div>

                    <div
                      className="w-full h-2 rounded-full"
                      style={{
                        backgroundColor: "#F3EFE3",
                      }}
                    >
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            percentage >= 90
                              ? "#C25B4A"
                              : percentage >= 75
                              ? "#E8B24D"
                              : "#4C8577",
                        }}
                      />
                    </div>

                    {percentage >= 90 && (
                      <p
                        className="text-[11px] mt-1"
                        style={{ color: "#C25B4A" }}
                      >
                        الصف قريب من الطاقة الاستيعابية.
                      </p>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </Card>

        {/* مهام المتابعة */}
        <Card title="📌 يحتاج متابعة">

          <div className="space-y-3">

            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                backgroundColor: "#FCFAF4",
              }}
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#2F3A36" }}
                >
                  رسائل غير مقروءة
                </p>

                <p
                  className="text-xs mt-0.5"
                  style={{ color: "#A8B0AB" }}
                >
                  رسائل تحتاج إلى مراجعة
                </p>
              </div>

              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: "#E8B24D25",
                  color: "#B8862F",
                }}
              >
                {unreadMessages}
              </span>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                backgroundColor: "#FCFAF4",
              }}
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#2F3A36" }}
                >
                  غيابات تحتاج متابعة
                </p>

                <p
                  className="text-xs mt-0.5"
                  style={{ color: "#A8B0AB" }}
                >
                  أكثر من 3 أيام غياب
                </p>
              </div>

              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor:
                    childrenNeedFollowUp.length > 0
                      ? "#C25B4A20"
                      : "#4C857720",

                  color:
                    childrenNeedFollowUp.length > 0
                      ? "#C25B4A"
                      : "#4C8577",
                }}
              >
                {childrenNeedFollowUp.length}
              </span>
            </div>

            <button
              onClick={() => onNavigate("reports")}
              className="w-full text-right text-sm font-semibold pt-1"
              style={{ color: "#4C8577" }}
            >
              فتح التقارير ←
            </button>

          </div>

        </Card>

      </div>
    </>
  );
}

// ======================================================
// Dashboard المدير
// ======================================================

function AdminDashboard({ onNavigate }) {
  const { childrenList } = useChildren();
  const { parentsList } = useParents();
  const { teachersList } = useTeachers();
  const { classesList } = useClasses();

  const activeChildrenCount = childrenList.filter(
    (c) => c.status === "نشط"
  ).length;

  const stats = [
    {
      key: "children",
      label: "إجمالي الأطفال",
      value: childrenList.length,
      icon: Baby,
      color: "#4C8577",
    },

    {
      key: "activeChildren",
      label: "الأطفال النشطون",
      value: activeChildrenCount,
      icon: ClipboardCheck,
      color: "#E8B24D",
    },

    {
      key: "teachers",
      label: "عدد المعلمين",
      value: teachersList.length,
      icon: GraduationCap,
      color: "#6E8FB0",
    },

    {
      key: "parents",
      label: "أولياء الأمور",
      value: parentsList.length,
      icon: Users,
      color: "#C25B4A",
    },
  ];

  const classDistribution = classesList.map((cls) => ({
    classroom: cls.name,

    count: childrenList.filter(
      (c) => c.classroom === cls.name
    ).length,

    total: cls.capacity,
  }));

  const recentActivity = [
    {
      id: 1,
      text: "تم تسجيل غياب لـ رهف يوسف (صف الفراشات)",
      time: "قبل 20 دقيقة",
    },

    {
      id: 2,
      text: "أضافت المعلمة نور ملاحظة جديدة لـ يزن الأحمد",
      time: "قبل ساعة",
    },

    {
      id: 3,
      text: "تم إضافة طفل جديد: سيلين خالد (صف النجوم)",
      time: "اليوم، 9:15 ص",
    },

    {
      id: 4,
      text: "تحديث بيانات ولي الأمر: أ. محمد درويش",
      time: "أمس",
    },
  ];

  const quickActions = [
    {
      key: "attendance",
      label: "تسجيل حضور اليوم",
      icon: ClipboardList,
    },

    {
      key: "children",
      label: "إضافة طفل",
      icon: UserPlus,
    },

    {
      key: "notes",
      label: "إضافة ملاحظة",
      icon: StickyNote,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {stats.map((s) => (
          <StatCard
            key={s.key}
            {...s}
          />
        ))}

      </div>

      <div className="flex flex-wrap gap-3 mb-6">

        {quickActions.map(
          ({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EDE7D9",
                color: "#4C8577",
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        )}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

        <Card title="توزيع الأطفال حسب الصفوف">

          {classDistribution.length === 0 ? (
            <p
              className="text-sm"
              style={{ color: "#A8B0AB" }}
            >
              لا يوجد صفوف مسجلة بعد
            </p>
          ) : (
            <div className="space-y-3">

              {classDistribution.map((c) => (
                <div key={c.classroom}>

                  <div
                    className="flex justify-between text-xs mb-1"
                    style={{ color: "#4A5551" }}
                  >
                    <span>{c.classroom}</span>

                    <span>
                      {c.count}/{c.total}
                    </span>
                  </div>

                  <div
                    className="w-full h-2 rounded-full"
                    style={{
                      backgroundColor: "#F3EFE3",
                    }}
                  >
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (c.count / c.total) * 100,
                          100
                        )}%`,
                        backgroundColor: "#4C8577",
                      }}
                    />
                  </div>

                </div>
              ))}

            </div>
          )}

        </Card>

        <Card title="غيابات اليوم">

          <p
            className="text-xs mb-3"
            style={{ color: "#A8B0AB" }}
          >
            سيتم عرضها هون تلقائياً بمجرد تسجيل الحضور اليومي
          </p>

          <button
            onClick={() => onNavigate("attendance")}
            className="text-sm font-semibold"
            style={{ color: "#4C8577" }}
          >
            الذهاب لتسجيل الحضور ←
          </button>

        </Card>

        <Card title="آخر الملاحظات">

          <button
            onClick={() => onNavigate("notes")}
            className="text-sm font-semibold"
            style={{ color: "#4C8577" }}
          >
            عرض كل الملاحظات ←
          </button>

        </Card>

      </div>

      <Card title="آخر الأنشطة">

        <ul className="space-y-3">

          {recentActivity.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between text-sm py-2"
              style={{
                borderBottom:
                  "1px solid #F3EFE3",
              }}
            >
              <span style={{ color: "#4A5551" }}>
                {a.text}
              </span>

              <span
                className="text-xs shrink-0 mr-4"
                style={{ color: "#A8B0AB" }}
              >
                {a.time}
              </span>
            </li>
          ))}

        </ul>

      </Card>
    </>
  );
}

// ======================================================
// Dashboard الرئيسي
// ======================================================

export default function Dashboard({
  onNavigate,
  onLogout,
}) {
  const { user } = useUser();

  return (
    <DashboardLayout
      activePage="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle="لوحة التحكم"
    >
      {user.roleType === "teacher" ? (
        <TeacherDashboard
          onNavigate={onNavigate}
        />
      ) : user.roleType === "secretary" ? (
        <SecretaryDashboard
          onNavigate={onNavigate}
        />
      ) : (
        <AdminDashboard
          onNavigate={onNavigate}
        />
      )}
    </DashboardLayout>
  );
}