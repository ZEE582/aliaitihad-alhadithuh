import {
  GraduationCap,
  Phone,
  MessageSquare,
  User,
  CalendarCheck2,
  ChevronLeft,
  Sparkles,
  Heart,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useChildren } from "../../context/ChildrenContext";
import { useTeachers } from "../../context/TeachersContext";
import { useUser } from "../../context/UserContext";
import { useAttendance } from "../../context/AttendanceContext";
import { strings as S } from "../../constants/strings";

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
}

export default function MyChildPage({
  onNavigate,
  onLogout,
  onOpenChild,
}) {
  const { user } = useUser();
  const { childrenList } = useChildren();
  const { teachersList } = useTeachers();
  const { getAbsenceCount } = useAttendance();

  const myChildren = childrenList.filter((child) =>
    user.childIds?.includes(child.id)
  );

  if (myChildren.length === 0) {
    return (
      <DashboardLayout
        activePage="children"
        onNavigate={onNavigate}
        onLogout={onLogout}
        pageTitle={S.myChild.pageTitle}
      >
        <div className="max-w-xl mx-auto text-center py-16">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{
              backgroundColor: "#EEF6F3",
            }}
          >
            <User
              size={28}
              style={{ color: "#4C8577" }}
            />
          </div>

          <h2
            className="text-lg font-bold"
            style={{ color: "#2F3A36" }}
          >
            {S.myChild.noChildTitle}
          </h2>

          <p
            className="text-sm mt-2"
            style={{ color: "#7A8580" }}
          >
            {S.myChild.noChildMessage}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activePage="children"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.myChild.pageTitle}
    >
      {/* =========================
          الترحيب
      ========================= */}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles
            size={17}
            style={{ color: "#E8B24D" }}
          />

          <span
            className="text-xs font-semibold"
            style={{ color: "#B27A19" }}
          >
            {S.myChild.familyPortalBadge}
          </span>
        </div>

        <h1
          className="text-2xl font-bold"
          style={{ color: "#2F3A36" }}
        >
          {S.myChild.welcomeMessage(user.name?.split(" ")[0])}
        </h1>

        <p
          className="text-sm mt-1"
          style={{ color: "#7A8580" }}
        >
          {S.myChild.welcomeSubtitle}
        </p>
      </div>

      {/* =========================
          بطاقات الأطفال
      ========================= */}

      <div
        className={`grid gap-5 ${
          myChildren.length > 1
            ? "grid-cols-1 xl:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {myChildren.map((child) => {
          const teacher = teachersList.find(
            (teacherItem) =>
              teacherItem.classroom ===
              child.classroom
          );

          const absenceCount =
            getAbsenceCount(child.id);

          return (
            <div
              key={child.id}
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EDE7D9",
              }}
            >
              {/* =====================
                  الجزء العلوي الجميل
              ===================== */}

              <div
                className="p-6"
                style={{
                  background:
                    "linear-gradient(135deg, #EEF6F3 0%, #FCFAF4 100%)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 shadow-sm"
                      style={{
                        backgroundColor: "#4C8577",
                        color: "#FBF7EF",
                      }}
                    >
                      {getInitials(child.name)}
                    </div>

                    <div>
                      <p
                        className="text-xs mb-1"
                        style={{
                          color: "#7A8580",
                        }}
                      >
                        {S.myChild.childProfileLabel}
                      </p>

                      <h2
                        className="text-xl font-bold"
                        style={{
                          color: "#2F3A36",
                        }}
                      >
                        {child.name}
                      </h2>

                      <p
                        className="text-sm mt-1"
                        style={{
                          color: "#4C8577",
                        }}
                      >
                        {child.classroom}
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        child.status === "نشط"
                          ? "#FFFFFF"
                          : "#FBEAE7",
                      color:
                        child.status === "نشط"
                          ? "#4C8577"
                          : "#C25B4A",
                    }}
                  >
                    {child.status}
                  </span>
                </div>

                {/* معلومات سريعة */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div
                    className="rounded-2xl p-3"
                    style={{
                      backgroundColor:
                        "#FFFFFFAA",
                      border:
                        "1px solid #FFFFFF",
                    }}
                  >
                    <p
                      className="text-[11px]"
                      style={{
                        color: "#A8B0AB",
                      }}
                    >
                      {S.myChild.ageLabel}
                    </p>

                    <p
                      className="text-sm font-bold mt-1"
                      style={{
                        color: "#2F3A36",
                      }}
                    >
                      {S.myChild.ageValue(child.age)}
                    </p>
                  </div>

                  <div
                    className="rounded-2xl p-3"
                    style={{
                      backgroundColor:
                        "#FFFFFFAA",
                      border:
                        "1px solid #FFFFFF",
                    }}
                  >
                    <p
                      className="text-[11px]"
                      style={{
                        color: "#A8B0AB",
                      }}
                    >
                      {S.myChild.absencesLabel}
                    </p>

                    <p
                      className="text-sm font-bold mt-1"
                      style={{
                        color:
                          absenceCount > 3
                            ? "#C25B4A"
                            : "#2F3A36",
                      }}
                    >
                      {S.myChild.absencesValue(absenceCount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* =====================
                  معلومات المعلمة
              ===================== */}

              <div className="p-5">
                <div
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: "#FCFAF4",
                    border:
                      "1px solid #F3EFE3",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor:
                            "#E8B24D20",
                        }}
                      >
                        <GraduationCap
                          size={18}
                          style={{
                            color: "#B27A19",
                          }}
                        />
                      </div>

                      <div>
                        <p
                          className="text-[11px]"
                          style={{
                            color: "#A8B0AB",
                          }}
                        >
                          {S.myChild.teacherLabel}
                        </p>

                        <p
                          className="text-sm font-bold mt-0.5"
                          style={{
                            color: "#2F3A36",
                          }}
                        >
                          {teacher?.name ||
                            S.myChild.teacherFallback}
                        </p>
                      </div>
                    </div>

                    {teacher?.phone && (
                      <a
                        href={`tel:${teacher.phone}`}
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor:
                            "#EEF6F3",
                          color: "#4C8577",
                        }}
                        title={S.myChild.callTeacherTitle}
                      >
                        <Phone size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* =====================
                    ملاحظة لطيفة
                ===================== */}

                <div className="flex items-center gap-2 mt-4 px-1">
                  <Heart
                    size={14}
                    fill="#E8B24D"
                    style={{
                      color: "#E8B24D",
                    }}
                  />

                  <p
                    className="text-xs"
                    style={{
                      color: "#7A8580",
                    }}
                  >
                    {S.myChild.caregiverNote}
                  </p>
                </div>

                {/* =====================
                    الأزرار
                ===================== */}

                <div className="grid grid-cols-2 gap-2 mt-5">
                  <button
                    onClick={() =>
                      onNavigate &&
                      onNavigate("attendance")
                    }
                    className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"
                    style={{
                      backgroundColor: "#EEF6F3",
                      color: "#4C8577",
                    }}
                  >
                    <CalendarCheck2
                      size={16}
                    />
                    {S.myChild.attendanceButton}
                  </button>

                  <button
                    onClick={() =>
                      onNavigate &&
                      onNavigate("messages")
                    }
                    className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"
                    style={{
                      backgroundColor: "#FCFAF4",
                      color: "#4A5551",
                      border:
                        "1px solid #E2DCCC",
                    }}
                  >
                    <MessageSquare
                      size={16}
                    />
                    {S.myChild.contactTeacherButton}
                  </button>
                </div>

                <button
                  onClick={() =>
                    onOpenChild &&
                    onOpenChild(child)
                  }
                  className="w-full flex items-center justify-center gap-2 mt-2 py-2.5 text-xs font-semibold"
                  style={{
                    color: "#7A8580",
                  }}
                >
                  <User size={14} />
                  {S.myChild.viewFullProfile}
                  <ChevronLeft size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================
          أسفل الصفحة
      ========================= */}

      <div
        className="rounded-2xl p-4 mt-5 flex items-center gap-3"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EDE7D9",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "#EEF6F3",
          }}
        >
          <Heart
            size={16}
            style={{ color: "#4C8577" }}
          />
        </div>

        <div>
          <p
            className="text-xs font-semibold"
            style={{ color: "#2F3A36" }}
          >
            {S.myChild.footerTitle}
          </p>

          <p
            className="text-[11px] mt-0.5"
            style={{ color: "#A8B0AB" }}
          >
            {S.myChild.footerMessage}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}