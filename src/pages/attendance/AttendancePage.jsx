import { useState, useMemo } from "react";

import {
  Check,
  X as XIcon,
  Clock3,
  Save,
  CheckCircle2,
  AlertTriangle,
  Phone,
  FileText,
  ShieldCheck,
  CalendarDays,
  GraduationCap,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import { strings as S } from "../../constants/strings";

import { useChildren } from "../../context/ChildrenContext";
import { useAttendance } from "../../context/AttendanceContext";
import { useParents } from "../../context/ParentsContext";
import { useTeachers } from "../../context/TeachersContext";
import { useUser } from "../../context/UserContext";

// ======================================================
// حالات حضور الأطفال
// ======================================================

const STATUS_OPTIONS = [
  {
    key: "present",
    label: S.attendance.statusPresent,
    icon: Check,
    color: "#4C8577",
  },
  {
    key: "absent",
    label: S.attendance.statusAbsent,
    icon: XIcon,
    color: "#C25B4A",
  },
  {
    key: "late",
    label: S.attendance.statusLate,
    icon: Clock3,
    color: "#E8B24D",
  },
];

// ======================================================
// حالات حضور المعلمة
// ======================================================

const TEACHER_STATUS_OPTIONS = [
  {
    key: "present",
    label: S.attendance.teacherStatusPresent,
    icon: Check,
    color: "#4C8577",
  },
  {
    key: "absent",
    label: S.attendance.teacherStatusAbsent,
    icon: XIcon,
    color: "#C25B4A",
  },
  {
    key: "late",
    label: S.attendance.teacherStatusLate,
    icon: Clock3,
    color: "#E8B24D",
  },
];

export default function AttendancePage({
  onNavigate,
  onLogout,
}) {
  const { user } = useUser();

  const { childrenList } = useChildren();

  const { parentsList } = useParents();

  const { teachersList } = useTeachers();

  const {
    records,
    recordDailyAttendance,
    getAbsenceCount,

    recordTeacherAttendance,
    getTeacherAttendance,
  } = useAttendance();

  // ====================================================
  // الصلاحيات
  // ====================================================

  const isParent =
    user?.roleType === "parent";

  const isTeacher =
    user?.roleType === "teacher";

  const isAdmin =
    user?.roleType === "admin";

  const isSecretary =
    user?.roleType === "secretary";

  const canEditAttendance =
    isAdmin || isTeacher;

  const canManageTeacherAttendance =
    isAdmin || isSecretary;

  // ====================================================
  // الأطفال الذين يستطيع المستخدم رؤيتهم
  // ====================================================

  const visibleChildren = useMemo(() => {
    if (isParent) {
      return childrenList.filter((child) =>
        user.childIds?.includes(child.id)
      );
    }

    if (isTeacher) {
      return childrenList.filter(
        (child) =>
          child.classroom === user.classroom
      );
    }

    return childrenList;
  }, [
    childrenList,
    user,
    isParent,
    isTeacher,
  ]);

  // ====================================================
  // الصفوف
  // ====================================================

  const classrooms = useMemo(() => {
    if (isParent || isTeacher) {
      return [];
    }

    return [
      ...new Set(
        visibleChildren.map(
          (child) => child.classroom
        )
      ),
    ];
  }, [
    visibleChildren,
    isParent,
    isTeacher,
  ]);

  const [activeClass, setActiveClass] =
    useState("");

  // ====================================================
  // حالات الأطفال
  // ====================================================

  const [attendance, setAttendance] =
    useState({});

  const [savedMessage, setSavedMessage] =
    useState(false);

  const [alertChildren, setAlertChildren] =
    useState([]);

  // ====================================================
  // حالة حضور المعلمة
  // ====================================================

  const [teacherStatus, setTeacherStatus] =
    useState("");

  const [teacherSavedMessage, setTeacherSavedMessage] =
    useState(false);

  // ====================================================
  // الصف الافتراضي
  // ====================================================

  const selectedClass =
    activeClass ||
    classrooms[0] ||
    "";

  // ====================================================
  // الأطفال المعروضون
  // ====================================================

  const children = useMemo(() => {
    if (isParent || isTeacher) {
      return visibleChildren;
    }

    return visibleChildren.filter(
      (child) =>
        child.classroom === selectedClass
    );
  }, [
    visibleChildren,
    selectedClass,
    isParent,
    isTeacher,
  ]);

  // ====================================================
  // التاريخ
  // ====================================================

  const todayISO = new Date()
    .toISOString()
    .slice(0, 10);

  const today = new Date().toLocaleDateString(
    "ar-EG",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // ====================================================
  // حضور المعلمة المسجل اليوم
  // ====================================================

  const currentTeacherAttendance =
    isTeacher
      ? getTeacherAttendance(
          user.name,
          todayISO
        )
      : null;

  // ====================================================
  // تغيير حالة طفل
  // ====================================================

  const setStatus = (
    childId,
    status
  ) => {
    if (!canEditAttendance) return;

    setAttendance((prev) => ({
      ...prev,
      [childId]: {
        status,
        excuse:
          status === "absent"
            ? prev[childId]?.excuse || ""
            : "",
      },
    }));

    setSavedMessage(false);
  };

  // ====================================================
  // سبب الغياب
  // ====================================================

  const setExcuse = (
    childId,
    excuse
  ) => {
    if (!canEditAttendance) return;

    setAttendance((prev) => ({
      ...prev,
      [childId]: {
        ...(prev[childId] || {
          status: "absent",
        }),
        excuse,
      },
    }));
  };

  // ====================================================
  // حفظ حضور الأطفال
  // ====================================================

  const handleSaveAttendance = () => {
    if (!canEditAttendance) return;

    const attendanceMap = {};

    children.forEach((child) => {
      const data =
        attendance[child.id] || {
          status: "present",
          excuse: "",
        };

      let finalStatus = "present";

      if (data.status === "absent") {
        finalStatus =
          data.excuse?.trim()
            ? "absent_excused"
            : "absent_unexcused";
      }

      if (data.status === "late") {
        finalStatus = "late";
      }

      attendanceMap[child.id] = {
        status: finalStatus,
        excuse: data.excuse || "",
      };
    });

    const newAlerts =
      recordDailyAttendance(
        todayISO,
        attendanceMap
      );

    // -----------------------------------------------
    // بناء التنبيهات
    // -----------------------------------------------

    const alerts = newAlerts
      .map((item) => {
        const child =
          childrenList.find(
            (c) =>
              c.id === item.childId
          );

        if (!child) return null;

        const parent =
          parentsList.find(
            (p) =>
              p.name === child.parent
          );

        return {
          childId: child.id,
          childName: child.name,
          absenceCount:
            item.absenceCount,

          parentName:
            parent?.name ||
            child.parent ||
            S.attendance.parentRoleFallback,

          parentPhone:
            parent?.phone ||
            child.parentPhone ||
            "",
        };
      })
      .filter(Boolean);

    setAlertChildren(alerts);

    setSavedMessage(true);

    setTimeout(() => {
      setSavedMessage(false);
    }, 3000);
  };

  // ====================================================
  // حفظ حضور المعلمة
  // ====================================================

  const handleSaveTeacherAttendance = () => {
    if (!isTeacher) return;

    if (!teacherStatus) return;

    recordTeacherAttendance(
      user.name,
      todayISO,
      teacherStatus
    );

    setTeacherSavedMessage(true);

    setTimeout(() => {
      setTeacherSavedMessage(false);
    }, 3000);
  };

  // ====================================================
  // الغياب اليوم
  // ====================================================

  const todayAbsences = children.filter(
    (child) => {
      const record = records.find(
        (r) =>
          r.childId === child.id &&
          r.date === todayISO
      );

      return (
        record?.status ===
          "absent_excused" ||
        record?.status ===
          "absent_unexcused"
      );
    }
  ).length;

  // ====================================================
  // إذا لا يوجد أطفال
  // ====================================================

  if (
    children.length === 0 &&
    !isSecretary
  ) {
    return (
      <DashboardLayout
        activePage="attendance"
        onNavigate={onNavigate}
        onLogout={onLogout}
        pageTitle={S.attendance.emptyChildrenTitle}
      >
        <div
          className="rounded-2xl bg-white p-10 text-center"
          style={{
            border:
              "1px solid #EDE7D9",
          }}
        >
          <CalendarDays
            size={34}
            className="mx-auto mb-3"
            style={{
              color: "#A8B0AB",
            }}
          />

          <p
            className="text-sm"
            style={{
              color: "#A8B0AB",
            }}
          >
            {S.attendance.emptyChildrenMessage}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activePage="attendance"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={
        isParent
          ? S.attendance.pageTitleParent
          : S.attendance.pageTitleDefault
      }
    >
      {/* ==================================================
          رأس الصفحة
      ================================================== */}

      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays
              size={18}
              style={{
                color: "#4C8577",
              }}
            />

            <p
              className="text-sm font-semibold"
              style={{
                color: "#2F3A36",
              }}
            >
              {today}
            </p>
          </div>

          <p
            className="text-xs mt-1"
            style={{
              color: "#A8B0AB",
            }}
          >
            {isParent
              ? S.attendance.headerSubtitleParent
              : isTeacher
              ? S.attendance.headerSubtitleTeacher(user.classroom)
              : isSecretary
              ? S.attendance.headerSubtitleSecretary
              : S.attendance.headerSubtitleAdmin}
          </p>
        </div>

        <div
          className="rounded-xl px-4 py-2.5 flex items-center gap-2"
          style={{
            backgroundColor: "#FFFFFF",
            border:
              "1px solid #EDE7D9",
          }}
        >
          <span
            className="text-sm font-bold"
            style={{
              color: "#C25B4A",
            }}
          >
            {todayAbsences}
          </span>

          <span
            className="text-xs"
            style={{
              color: "#7A8580",
            }}
          >
{S.attendance.todayAbsenceCountLabel}
          </span>
        </div>
      </div>

      {/* ==================================================
          حضور المعلمة
      ================================================== */}

      {!isParent && (
        <div
          className="rounded-2xl p-5 mb-5"
          style={{
            backgroundColor: "#FFFFFF",
            border:
              "1px solid #EDE7D9",
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor:
                    "#EAF2EF",
                  color: "#4C8577",
                }}
              >
                <GraduationCap
                  size={21}
                />
              </div>

              <div>
                <h3
                  className="text-sm font-bold"
                  style={{
                    color: "#2F3A36",
                  }}
                >
                  {S.attendance.teacherSectionTitle}
                </h3>

                <p
                  className="text-xs mt-1"
                  style={{
                    color: "#A8B0AB",
                  }}
                >
                  {S.attendance.teacherSectionSubtitle}
                </p>
              </div>
            </div>

            {isTeacher && (
              <span
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  backgroundColor:
                    "#FCFAF4",
                  color: "#7A8580",
                }}
              >
                {user.name}
              </span>
            )}
          </div>

          {/* ==========================================
              المعلمة تسجل حضورها
          ========================================== */}

          {isTeacher && (
            <div className="mt-5">
              <div className="flex flex-wrap gap-2">
                {TEACHER_STATUS_OPTIONS.map(
                  ({
                    key,
                    label,
                    icon: Icon,
                    color,
                  }) => {
                    const isActive =
                      teacherStatus ===
                      key ||
                      currentTeacherAttendance?.status ===
                        key;

                    return (
                      <button
                        key={key}
                        onClick={() =>
                          setTeacherStatus(
                            key
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
                        style={{
                          backgroundColor:
                            isActive
                              ? `${color}20`
                              : "#FFFFFF",

                          color: isActive
                            ? color
                            : "#7A8580",

                          border: `1px solid ${
                            isActive
                              ? color
                              : "#EDE7D9"
                          }`,
                        }}
                      >
                        <Icon
                          size={15}
                        />

                        {label}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={
                    handleSaveTeacherAttendance
                  }
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white"
                  style={{
                    backgroundColor:
                      "#4C8577",
                  }}
                >
                  <Save size={15} />
                  {S.attendance.saveTeacherAttendanceBtn}
                </button>

                {teacherSavedMessage && (
                  <span
                    className="flex items-center gap-1.5 text-xs font-medium"
                    style={{
                      color: "#4C8577",
                    }}
                  >
                    <CheckCircle2
                      size={15}
                    />
                    {S.attendance.teacherSavedMessage}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              المدير والسكرتيرة يشوفوا حالة المعلمات
          ========================================== */}

          {canManageTeacherAttendance && (
            <div className="mt-5">
              {teachersList.length === 0 ? (
                <p
                  className="text-xs"
                  style={{
                    color: "#A8B0AB",
                  }}
                >
                  {S.attendance.noTeachersRegistered}
                </p>
              ) : (
                <div className="space-y-2">
                  {teachersList.map(
                    (teacher) => {
                      const record =
                        getTeacherAttendance(
                          teacher.name,
                          todayISO
                        );

                      return (
                        <div
                          key={
                            teacher.id ||
                            teacher.name
                          }
                          className="flex items-center justify-between gap-3 p-3 rounded-xl"
                          style={{
                            backgroundColor:
                              "#FCFAF4",
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor:
                                  "#EAF2EF",
                                color:
                                  "#4C8577",
                              }}
                            >
                              <GraduationCap
                                size={15}
                              />
                            </div>

                            <div>
                              <p
                                className="text-sm font-semibold"
                                style={{
                                  color:
                                    "#2F3A36",
                                }}
                              >
                                {
                                  teacher.name
                                }
                              </p>

                              <p
                                className="text-[11px]"
                                style={{
                                  color:
                                    "#A8B0AB",
                                }}
                              >
                                {teacher.classroom ||
                                  S.attendance.teacherRoleFallback}
                              </p>
                            </div>
                          </div>

                          <span
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                            style={{
                              backgroundColor:
                                !record
                                  ? "#F3EFE3"
                                  : record.status ===
                                    "present"
                                  ? "#EAF2EF"
                                  : record.status ===
                                    "late"
                                  ? "#FFF7E6"
                                  : "#FBEAE7",

                              color:
                                !record
                                  ? "#A8B0AB"
                                  : record.status ===
                                    "present"
                                  ? "#4C8577"
                                  : record.status ===
                                    "late"
                                  ? "#B27A19"
                                  : "#C25B4A",
                            }}
                          >
                            {!record
                              ? S.attendance.teacherStatusNotRecorded
                              : record.status ===
                                "present"
                              ? S.attendance.teacherStatusPresent
                              : record.status ===
                                "late"
                              ? S.attendance.teacherStatusLate
                              : S.attendance.teacherStatusAbsent}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================
          رسالة ولي الأمر
      ================================================== */}

      {isParent && (
        <div
          className="rounded-2xl p-4 mb-5 flex items-start gap-3"
          style={{
            backgroundColor: "#EEF6F3",
            border:
              "1px solid #D5E8E2",
          }}
        >
          <ShieldCheck
            size={20}
            style={{
              color: "#4C8577",
              marginTop: 2,
            }}
          />

          <div>
            <p
              className="text-sm font-semibold"
              style={{
                color: "#2F3A36",
              }}
            >
              {S.attendance.parentNoticeTitle}
            </p>

            <p
              className="text-xs mt-1"
              style={{
                color: "#7A8580",
              }}
            >
              {S.attendance.parentNoticeBody}
            </p>
          </div>
        </div>
      )}

      {/* ==================================================
          تنبيه الغياب المتكرر
      ================================================== */}

      {alertChildren.length > 0 && (
        <div
          className="rounded-2xl p-5 mb-5"
          style={{
            backgroundColor: "#FBEAE7",
            border:
              "1px solid #E8B9AF",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor:
                  "#C25B4A20",
              }}
            >
              <AlertTriangle
                size={20}
                style={{
                  color: "#C25B4A",
                }}
              />
            </div>

            <div className="flex-1">
              <h3
                className="text-sm font-bold"
                style={{
                  color: "#C25B4A",
                }}
              >
                {S.attendance.alertTitle}
              </h3>

              <p
                className="text-xs mt-1"
                style={{
                  color: "#7A8580",
                }}
              >
                {S.attendance.alertBody}
              </p>

              <div className="space-y-3 mt-4">
                {alertChildren.map(
                  (child) => (
                    <div
                      key={child.childId}
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor:
                          "#FFFFFF",
                        border:
                          "1px solid #E8B9AF",
                      }}
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <p
                            className="text-sm font-bold"
                            style={{
                              color:
                                "#2F3A36",
                            }}
                          >
                            {
                              child.childName
                            }
                          </p>

                          <p
                            className="text-xs mt-1"
                            style={{
                              color:
                                "#C25B4A",
                            }}
                          >
                            {S.attendance.alertAbsenceCount(
                              child.absenceCount
                            )}
                          </p>
                        </div>

                        {child.parentPhone && (
                          <a
                            href={`tel:${child.parentPhone}`}
                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white"
                            style={{
                              backgroundColor:
                                "#C25B4A",
                            }}
                          >
                            <Phone
                              size={15}
                            />
                            {S.attendance.alertContactBtn}
                          </a>
                        )}
                      </div>

                      <div
                        className="mt-3 pt-3"
                        style={{
                          borderTop:
                            "1px solid #F3EFE3",
                        }}
                      >
                        <p
                          className="text-xs"
                          style={{
                            color:
                              "#7A8580",
                          }}
                        >
                          {S.attendance.alertParentLabel}{" "}
                          <strong
                            style={{
                              color:
                                "#2F3A36",
                            }}
                          >
                            {
                              child.parentName
                            }
                          </strong>
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          اختيار الصف للمدير
      ================================================== */}

      {!isParent &&
        !isTeacher &&
        classrooms.length > 0 && (
          <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
            <div className="flex gap-2 flex-wrap">
              {classrooms.map(
                (classroom) => (
                  <button
                    key={classroom}
                    onClick={() =>
                      setActiveClass(
                        classroom
                      )
                    }
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{
                      backgroundColor:
                        selectedClass ===
                        classroom
                          ? "#4C8577"
                          : "#FFFFFF",

                      color:
                        selectedClass ===
                        classroom
                          ? "#FBF7EF"
                          : "#4A5551",

                      border:
                        "1px solid #EDE7D9",
                    }}
                  >
                    {classroom}
                  </button>
                )
              )}
            </div>
          </div>
        )}

      {/* ==================================================
          زر حفظ حضور الأطفال
      ================================================== */}

      {canEditAttendance && (
        <div className="flex items-center justify-end mb-5">
          <div className="flex items-center gap-3">
            {savedMessage && (
              <span
                className="flex items-center gap-1.5 text-sm font-medium"
                style={{
                  color: "#4C8577",
                }}
              >
                <CheckCircle2
                  size={16}
                />
                {S.attendance.childrenSavedMessage}
              </span>
            )}

            <button
              onClick={
                handleSaveAttendance
              }
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
              style={{
                backgroundColor:
                  "#4C8577",
              }}
            >
              <Save size={16} />
              {S.attendance.saveChildrenAttendanceBtn}
            </button>
          </div>
        </div>
      )}

      {/* ==================================================
          قائمة الأطفال
      ================================================== */}

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          border:
            "1px solid #EDE7D9",
        }}
      >
        {children.map(
          (child, index) => {
            const current =
              attendance[child.id]
                ?.status || "present";

            const excuse =
              attendance[child.id]
                ?.excuse || "";

            const absenceCount =
              getAbsenceCount(child.id);

            const latestRecord =
              records
                .filter(
                  (record) =>
                    record.childId ===
                    child.id
                )
                .sort((a, b) =>
                  b.date.localeCompare(
                    a.date
                  )
                )[0];

            return (
              <div
                key={child.id}
                className="px-5 py-4"
                style={{
                  borderBottom:
                    index <
                    children.length - 1
                      ? "1px solid #F3EFE3"
                      : "none",
                }}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                      style={{
                        backgroundColor:
                          "#EEF6F3",
                        color:
                          "#4C8577",
                      }}
                    >
                      {child.name.charAt(
                        0
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-bold"
                          style={{
                            color:
                              "#2F3A36",
                          }}
                        >
                          {child.name}
                        </span>

                        {absenceCount >
                          0 && (
                          <span
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor:
                                absenceCount >
                                3
                                  ? "#FBEAE7"
                                  : "#FCFAF4",

                              color:
                                absenceCount >
                                3
                                  ? "#C25B4A"
                                  : "#7A8580",
                            }}
                          >
                            {S.attendance.absenceBadge(
                              absenceCount
                            )}
                          </span>
                        )}
                      </div>

                      <p
                        className="text-[11px] mt-1"
                        style={{
                          color:
                            "#A8B0AB",
                        }}
                      >
                        {isParent
                          ? child.classroom
                          : S.attendance.lastRecordLabel(
                              latestRecord?.date
                            )}
                      </p>
                    </div>
                  </div>

                  {/* ==================================
                      ولي الأمر - قراءة فقط
                  ================================== */}

                  {isParent ? (
                    <div className="flex items-center gap-2">
                      {latestRecord ? (
                        <span
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                          style={{
                            backgroundColor:
                              latestRecord.status ===
                              "present"
                                ? "#EEF6F3"
                                : latestRecord.status ===
                                  "late"
                                ? "#FFF7E6"
                                : "#FBEAE7",

                            color:
                              latestRecord.status ===
                              "present"
                                ? "#4C8577"
                                : latestRecord.status ===
                                  "late"
                                ? "#B27A19"
                                : "#C25B4A",
                          }}
                        >
                          {latestRecord.status ===
                          "present"
                            ? S.attendance.latestStatusPresent
                            : latestRecord.status ===
                              "late"
                            ? S.attendance.latestStatusLate
                            : latestRecord.status ===
                              "absent_excused"
                            ? S.attendance.latestStatusExcused
                            : S.attendance.latestStatusUnexcused}
                        </span>
                      ) : (
                        <span
                          className="text-xs"
                          style={{
                            color:
                              "#A8B0AB",
                          }}
                        >
                          {S.attendance.noRecordMessage}
                        </span>
                      )}
                    </div>
                  ) : (
                    /* ==================================
                       المعلمة / المدير
                    ================================== */

                    <div className="flex items-center gap-2">
                      {STATUS_OPTIONS.map(
                        ({
                          key,
                          label,
                          icon: Icon,
                          color,
                        }) => {
                          const isActive =
                            current ===
                            key;

                          return (
                            <button
                              key={key}
                              onClick={() =>
                                setStatus(
                                  child.id,
                                  key
                                )
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                              style={{
                                backgroundColor:
                                  isActive
                                    ? `${color}20`
                                    : "transparent",

                                color:
                                  isActive
                                    ? color
                                    : "#A8B0AB",

                                border: `1px solid ${
                                  isActive
                                    ? color
                                    : "#EDE7D9"
                                }`,
                              }}
                            >
                              <Icon
                                size={13}
                              />

                              {label}
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>

                {/* ====================================
                    سبب الغياب
                ==================================== */}

                {!isParent &&
                  current ===
                    "absent" && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <FileText
                          size={14}
                          style={{
                            color:
                              "#A8B0AB",
                          }}
                        />

                        <label
                          className="text-xs font-medium"
                          style={{
                            color:
                              "#7A8580",
                          }}
                        >
                          {S.attendance.excuseLabel}
                        </label>
                      </div>

                      <input
                        type="text"
                        value={excuse}
                        onChange={(e) =>
                          setExcuse(
                            child.id,
                            e.target.value
                          )
                        }
                        placeholder={S.attendance.excusePlaceholder}
                        className="w-full rounded-xl py-2.5 px-3 text-xs outline-none"
                        style={{
                          border:
                            "1px solid #E2DCCC",
                          backgroundColor:
                            "#FCFAF4",
                          color:
                            "#2F3A36",
                        }}
                      />

                      <p
                        className="text-[11px] mt-1.5"
                        style={{
                          color:
                            "#A8B0AB",
                        }}
                      >
                        {S.attendance.excuseHint}
                      </p>
                    </div>
                  )}
              </div>
            );
          }
        )}
      </div>
    </DashboardLayout>
  );
}