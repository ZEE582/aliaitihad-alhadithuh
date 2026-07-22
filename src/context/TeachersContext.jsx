import { createContext, useContext, useState } from "react";

const TeachersContext = createContext(null);

const initialTeachers = [
  { id: 1, name: "أ. نور سلامة", phone: "059-1112223", subject: "التربية الفنية", classroom: "صف الفراشات", status: "نشط" },
  { id: 2, name: "أ. سارة الحاج", phone: "059-4445556", subject: "اللغة العربية", classroom: "صف النجوم", status: "نشط" },
  { id: 3, name: "أ. ريم عودة", phone: "056-7778889", subject: "الرياضيات", classroom: "صف القمر", status: "إجازة" },
];

export function TeachersProvider({ children }) {
  const [teachersList, setTeachersList] = useState(initialTeachers);

  const addTeacher = (formData) => {
    const newTeacher = { id: Date.now(), status: "نشط", ...formData };
    setTeachersList((prev) => [...prev, newTeacher]);
    return newTeacher;
  };

  const updateTeacher = (id, formData) => {
    setTeachersList((prev) => prev.map((t) => (t.id === id ? { ...t, ...formData } : t)));
  };

  const deleteTeacher = (id) => {
    setTeachersList((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTeacherStatus = (id) => {
    setTeachersList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "نشط" ? "إجازة" : "نشط" } : t))
    );
  };

  return (
    <TeachersContext.Provider value={{ teachersList, addTeacher, updateTeacher, deleteTeacher, toggleTeacherStatus }}>
      {children}
    </TeachersContext.Provider>
  );
}

export function useTeachers() {
  const ctx = useContext(TeachersContext);
  if (!ctx) throw new Error("useTeachers لازم تستخدم جوا TeachersProvider");
  return ctx;
}