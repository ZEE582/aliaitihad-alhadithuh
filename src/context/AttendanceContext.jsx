import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { strings as S } from "../constants/strings";

const AttendanceContext = createContext(null);

const initialRecords = [
  { id: 1, childId: 1, date: "2026-07-10", status: "absent_unexcused" },
  { id: 2, childId: 1, date: "2026-07-12", status: "absent_excused" },
  { id: 3, childId: 1, date: "2026-07-15", status: "absent_unexcused" },
  { id: 4, childId: 2, date: "2026-07-11", status: "absent_excused" },
  { id: 5, childId: 3, date: "2026-07-13", status: "absent_unexcused" },
];

const initialTeacherRecords = [];

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.children.error403;
  if (err?.status === 404) return S.context.children.error404;
  if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch"))
    return S.context.children.errorNetwork;
  return err?.message || fallback;
};

export function AttendanceProvider({ children }) {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("app_attendance_records");
    return saved ? JSON.parse(saved) : initialRecords;
  });

  const [teacherRecords, setTeacherRecords] = useState(() => {
    const saved = localStorage.getItem("app_teacher_attendance_records");
    return saved ? JSON.parse(saved) : initialTeacherRecords;
  });

  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    localStorage.setItem("app_attendance_records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("app_teacher_attendance_records", JSON.stringify(teacherRecords));
  }, [teacherRecords]);

  const fetchAttendanceFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token || token.startsWith("demo_token_")) return;

    setLoading(true);
    try {
      const data = await api.get("/attendance");
      if (Array.isArray(data)) setRecords(data);
    } catch (err) {
      console.error("API Fetch Attendance Error:", err);
      showError(getErrorMessage(err, S.context.attendance.fetchFailed));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchAttendanceFromApi();
  }, [fetchAttendanceFromApi]);

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
  // تسجيل حضور المعلمة
  // ====================================================

  const recordTeacherAttendance = (teacherName, date, status) => {
    setTeacherRecords((prev) => {
      const filtered = prev.filter(
        (record) => !(record.teacherName === teacherName && record.date === date)
      );
      return [...filtered, { id: `${Date.now()}-${teacherName}`, teacherName, date, status }];
    });
  };

  // ====================================================
  // جلب حضور معلمة
  // ====================================================

  const getTeacherRecords = (teacherName) =>
    teacherRecords.filter((record) => record.teacherName === teacherName);

  // ====================================================
  // جلب حضور المعلمات في يوم معين
  // ====================================================

  const getTeacherAttendanceForDate = (date) =>
    teacherRecords.filter((record) => record.date === date);

  // ====================================================
  // آخر تسجيل حضور للمعلمة
  // ====================================================

  const getTeacherAttendance = (teacherName, date) =>
    teacherRecords.find(
      (record) => record.teacherName === teacherName && record.date === date
    );

  // ====================================================
  // حفظ الحضور اليومي عبر API
  // ====================================================

  const saveAttendanceToApi = async (date, attendanceMap) => {
    const token = localStorage.getItem("auth_token");
    if (!token || token.startsWith("demo_token_")) return { success: true };

    try {
      await api.post("/attendance", { date, records: attendanceMap });
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