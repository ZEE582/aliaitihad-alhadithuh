import { createContext, useContext, useState } from "react";

const AttendanceContext = createContext(null);

// ======================================================
// سجلات الحضور
// ======================================================

const initialRecords = [
  // رهف عندها 3 غيابات حتى نجرب الغياب الرابع
  {
    id: 1,
    childId: 1,
    date: "2026-07-10",
    status: "absent_unexcused",
  },
  {
    id: 2,
    childId: 1,
    date: "2026-07-12",
    status: "absent_excused",
  },
  {
    id: 3,
    childId: 1,
    date: "2026-07-15",
    status: "absent_unexcused",
  },

  // باقي الأطفال
  {
    id: 4,
    childId: 2,
    date: "2026-07-11",
    status: "absent_excused",
  },
  {
    id: 5,
    childId: 3,
    date: "2026-07-13",
    status: "absent_unexcused",
  },
];

// ======================================================
// حضور المعلمات
// ======================================================

const initialTeacherRecords = [
  /*
    مثال:

    {
      id: 1,
      teacherName: "أ. نور سلامة",
      date: "2026-08-30",
      status: "present"
    }
  */
];

export function AttendanceProvider({ children }) {
  const [records, setRecords] = useState(initialRecords);

  const [teacherRecords, setTeacherRecords] = useState(
    initialTeacherRecords
  );

  // ====================================================
  // تسجيل حضور الأطفال
  // ====================================================

  const recordDailyAttendance = (date, attendanceMap) => {
    const childrenJustExceededThree = [];

    setRecords((prev) => {
      const childIds = Object.keys(attendanceMap).map(Number);

      // حذف تسجيل نفس اليوم حتى لا يتكرر
      const filtered = prev.filter(
        (record) =>
          !(
            childIds.includes(record.childId) &&
            record.date === date
          )
      );

      const newRecords = childIds.map((childId) => ({
        id: `${Date.now()}-${childId}`,
        childId,
        date,
        status: attendanceMap[childId].status,
        excuse: attendanceMap[childId].excuse || "",
      }));

      const updated = [...filtered, ...newRecords];

      // -----------------------------------------------
      // فحص الغياب المتكرر
      // -----------------------------------------------

      childIds.forEach((childId) => {
        const status = attendanceMap[childId].status;

        const isAbsence =
          status === "absent_excused" ||
          status === "absent_unexcused";

        if (!isAbsence) return;

        const oldAbsenceCount = prev.filter(
          (record) =>
            record.childId === childId &&
            (
              record.status === "absent_excused" ||
              record.status === "absent_unexcused"
            )
        ).length;

        const newAbsenceCount = updated.filter(
          (record) =>
            record.childId === childId &&
            (
              record.status === "absent_excused" ||
              record.status === "absent_unexcused"
            )
        ).length;

        /*
          التنبيه يظهر فقط عندما ينتقل الطفل من:
          3 → 4 غيابات

          وليس كل مرة يتم فيها حفظ الصفحة.
        */

        if (
          oldAbsenceCount <= 3 &&
          newAbsenceCount > 3
        ) {
          childrenJustExceededThree.push({
            childId,
            absenceCount: newAbsenceCount,
          });
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
    records.filter(
      (record) => record.childId === childId
    );

  // ====================================================
  // عدد غيابات طفل
  // ====================================================

  const getAbsenceCount = (childId) =>
    records.filter(
      (record) =>
        record.childId === childId &&
        (
          record.status === "absent_excused" ||
          record.status === "absent_unexcused"
        )
    ).length;

  // ====================================================
  // تسجيل حضور المعلمة
  // ====================================================

  const recordTeacherAttendance = (
    teacherName,
    date,
    status
  ) => {
    setTeacherRecords((prev) => {
      // إذا فيه تسجيل لنفس المعلمة بنفس اليوم
      // نستبدله بدل ما نكرر السجل

      const filtered = prev.filter(
        (record) =>
          !(
            record.teacherName === teacherName &&
            record.date === date
          )
      );

      return [
        ...filtered,
        {
          id: `${Date.now()}-${teacherName}`,
          teacherName,
          date,
          status,
        },
      ];
    });
  };

  // ====================================================
  // جلب حضور معلمة
  // ====================================================

  const getTeacherRecords = (teacherName) =>
    teacherRecords.filter(
      (record) =>
        record.teacherName === teacherName
    );

  // ====================================================
  // جلب حضور المعلمات في يوم معين
  // ====================================================

  const getTeacherAttendanceForDate = (date) =>
    teacherRecords.filter(
      (record) => record.date === date
    );

  // ====================================================
  // آخر تسجيل حضور للمعلمة
  // ====================================================

  const getTeacherAttendance = (
    teacherName,
    date
  ) =>
    teacherRecords.find(
      (record) =>
        record.teacherName === teacherName &&
        record.date === date
    );

  return (
    <AttendanceContext.Provider
      value={{
        records,
        teacherRecords,

        recordDailyAttendance,

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

  if (!ctx) {
    throw new Error(
      "useAttendance لازم تستخدم جوا AttendanceProvider"
    );
  }

  return ctx;
}