import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { useUser } from "./UserContext";
import { strings as S } from "../constants/strings";

const AttendanceContext = createContext(null);

const initialRecords = [
  { id: 1, childId: 1, date: "2026-07-10", status: "absent_unexcused" },
  { id: 2, childId: 1, date: "2026-07-12", status: "absent_excused" },
  { id: 3, childId: 1, date: "2026-07-15", status: "absent_unexcused" },
  { id: 4, childId: 2, date: "2026-07-11", status: "absent_excused" },
  { id: 5, childId: 3, date: "2026-07-13", status: "absent_unexcused" },
];

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.children.error403;
  if (err?.status === 404) return S.context.children.error404;
  if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch"))
    return S.context.children.errorNetwork;
  return err?.message || fallback;
};

const toDateOnly = (value) => {
  if (value == null) return "";
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(value).slice(0, 10);
};

const toChildStatusKey = (status, reason) => {
  if (status === "Late") return "late";
  if (status === "Excused") return "absent_excused";
  if (status === "Absent") return reason ? "absent_excused" : "absent_unexcused";
  return "present";
};

const normalizeAttendance = (record) => ({
  ...record,
  id: record.AttendanceID ?? record.id,
  childId: record.child_PersonID ?? record.childId,
  date: toDateOnly(record.AttendanceDate),
  status: toChildStatusKey(record.Status, record.Reason),
  excuse: record.Reason || "",
});

const toTeacherStatusKey = (status) => {
  if (status === "Late") return "late";
  if (status === "Absent") return "absent";
  if (status === "Excused") return "excused";
  return "present";
};

const normalizeTeacherAttendance = (record) => ({
  id: record.AttendanceID ?? record.id,
  teacherId: record.TeacherID,
  teacherName: record.teacher
    ? [record.teacher.F_name, record.teacher.S_name].filter(Boolean).join(" ")
    : "",
  date: toDateOnly(record.Date),
  status: toTeacherStatusKey(record.Status),
  excuse: record.Excuse || "",
});

export function AttendanceProvider({ children }) {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("app_attendance_records");
    return saved ? JSON.parse(saved) : initialRecords;
  });

  const [teacherRecords, setTeacherRecords] = useState([]);

  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const { user } = useUser();

  useEffect(() => {
    localStorage.setItem("app_attendance_records", JSON.stringify(records));
  }, [records]);

  const fetchAttendanceFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    setLoading(true);
    try {
      const data = await api.get("/attendance");
      if (Array.isArray(data)) setRecords(data.map(normalizeAttendance));
    } catch (err) {
      console.error("API Fetch Attendance Error:", err);
      showError(getErrorMessage(err, S.context.attendance.fetchFailed));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchTeacherAttendanceFromApi = useCallback(async () => {
    if (user?.roleType !== "admin") return;
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const data = await api.get("/attendance/teachers/all");
      if (Array.isArray(data)) setTeacherRecords(data.map(normalizeTeacherAttendance));
    } catch (err) {
      if (err?.status !== 403) {
        console.error("API Fetch Teacher Attendance Error:", err);
        showError(getErrorMessage(err, S.context.attendance.fetchFailed));
      }
    }
  }, [showError, user?.roleType]);

  useEffect(() => {
    Promise.all([fetchAttendanceFromApi(), fetchTeacherAttendanceFromApi()]);
  }, [fetchAttendanceFromApi, fetchTeacherAttendanceFromApi]);

  // ====================================================
  // تسجيل حضور الأطفال
  // ====================================================

  const recordDailyAttendance = (date, attendanceMap) => {
    const childrenJustExceededThree = [];

    setRecords((prev) => {
      const childIds = Object.keys(attendanceMap).map(Number);

      const filtered = prev.filter(
        (record) => !(childIds.includes(record.childId) && record.date === date)
      );

      const newRecords = childIds.map((childId) => ({
        id: `${Date.now()}-${childId}`,
        childId,
        date,
        status: attendanceMap[childId].status,
        excuse: attendanceMap[childId].excuse || "",
      }));

      const updated = [...filtered, ...newRecords];

      childIds.forEach((childId) => {
        const status = attendanceMap[childId].status;
        const isAbsence = status === "absent_excused" || status === "absent_unexcused";
        if (!isAbsence) return;

        const oldAbsenceCount = prev.filter(
          (record) =>
            record.childId === childId &&
            (record.status === "absent_excused" || record.status === "absent_unexcused")
        ).length;

        const newAbsenceCount = updated.filter(
          (record) =>
            record.childId === childId &&
            (record.status === "absent_excused" || record.status === "absent_unexcused")
        ).length;

        if (oldAbsenceCount <= 3 && newAbsenceCount > 3) {
          childrenJustExceededThree.push({ childId, absenceCount: newAbsenceCount });
        }
      });

      return updated;
    });

    return childrenJustExceededThree;
  };

  // ====================================================
  // سجلات طفل
  // ====================================================

  const getRecordsForChild = (childId) =>
    records.filter((record) => record.childId === childId);

  // ====================================================
  // عدد غيابات طفل
  // ====================================================

  const getAbsenceCount = (childId) =>
    records.filter(
      (record) =>
        record.childId === childId &&
        (record.status === "absent_excused" || record.status === "absent_unexcused")
    ).length;

  // ====================================================
  // تسجيل حضور المعلمة (للمدير فقط عبر API)
  // ====================================================

  const recordTeacherAttendance = async (teacherId, date, status) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      const msg = S.context.attendance.saveFailed;
      showError(msg);
      return { error: msg };
    }

    const statusMap = { present: "Present", late: "Late", absent: "Absent", excused: "Excused" };

    try {
      await api.post("/attendance/teachers", {
        TeacherID: teacherId,
        Date: date,
        Status: statusMap[status] || "Present",
      });
      await fetchTeacherAttendanceFromApi();
      showSuccess(S.context.attendance.saveSuccess);
      return { success: true };
    } catch (err) {
      console.error("API Save Teacher Attendance Error:", err);
      const msg = getErrorMessage(err, S.context.attendance.saveFailed);
      showError(msg);
      return { error: msg };
    }
  };

  // ====================================================
  // جلب حضور معلمة
  // ====================================================

  const matchesTeacher = (record, teacherIdOrName) =>
    record.teacherId === teacherIdOrName || record.teacherName === teacherIdOrName;

  const getTeacherRecords = (teacherIdOrName) =>
    teacherRecords.filter((record) => matchesTeacher(record, teacherIdOrName));

  // ====================================================
  // جلب حضور المعلمات في يوم معين
  // ====================================================

  const getTeacherAttendanceForDate = (date) =>
    teacherRecords.filter((record) => record.date === date);

  // ====================================================
  // آخر تسجيل حضور للمعلمة
  // ====================================================

  const getTeacherAttendance = (teacherIdOrName, date) =>
    teacherRecords.find(
      (record) => matchesTeacher(record, teacherIdOrName) && record.date === date
    );

  // ====================================================
  // حفظ الحضور اليومي عبر API
  // ====================================================

  const saveAttendanceToApi = async (date, attendanceMap) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return { success: true };

    const childIds = Object.keys(attendanceMap).map(Number);
    if (childIds.length === 0) return { success: true };

    const statusMap = {
      present: "Present",
      late: "Late",
      absent: "Absent",
      absent_excused: "Excused",
      absent_unexcused: "Absent",
    };

    try {
      await Promise.all(
        childIds.map((childId) => {
          const entry = attendanceMap[childId] || {};
          const statusKey = entry.status || "present";
          return api.post("/attendance", {
            child_PersonID: childId,
            AttendanceDate: date,
            Status: statusMap[statusKey] || "Present",
            Reason: entry.excuse || "",
          });
        })
      );

      const data = await api.get("/attendance");
      if (Array.isArray(data)) setRecords(data.map(normalizeAttendance));

      showSuccess(S.context.attendance.saveSuccess);
      return { success: true };
    } catch (err) {
      console.error("API Save Attendance Error:", err);
      const msg = getErrorMessage(err, S.context.attendance.saveFailed);
      showError(msg);
      return { error: msg };
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        records,
        teacherRecords,
        loading,
        recordDailyAttendance,
        saveAttendanceToApi,
        getRecordsForChild,
        getAbsenceCount,
        recordTeacherAttendance,
        getTeacherRecords,
        getTeacherAttendanceForDate,
        getTeacherAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error("useAttendance لازم تستخدم جوا AttendanceProvider");
  return ctx;
}