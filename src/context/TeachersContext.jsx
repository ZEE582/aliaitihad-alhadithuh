import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { strings as S } from "../constants/strings";

const TeachersContext = createContext(null);

const initialTeachers = [
  { id: 1, name: "أ. نور سلامة", phone: "059-1112223", subject: "التربية الفنية", classroom: "صف الفراشات", status: "نشط" },
  { id: 2, name: "أ. سارة الحاج", phone: "059-4445556", subject: "اللغة العربية", classroom: "صف النجوم", status: "نشط" },
  { id: 3, name: "أ. ريم عودة", phone: "056-7778889", subject: "الرياضيات", classroom: "صف القمر", status: "إجازة" },
];

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.children.error403;
  if (err?.status === 404) return S.context.children.error404;
  if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch"))
    return S.context.children.errorNetwork;
  return err?.message || fallback;
};

export function TeachersProvider({ children }) {
  const [teachersList, setTeachersList] = useState(() => {
    const saved = localStorage.getItem("app_teachers_list");
    return saved ? JSON.parse(saved) : initialTeachers;
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    localStorage.setItem("app_teachers_list", JSON.stringify(teachersList));
  }, [teachersList]);

  const fetchTeachersFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token || token.startsWith("demo_token_")) return;

    setLoading(true);
    try {
      const data = await api.get("/teachers");
      if (Array.isArray(data)) setTeachersList(data);
    } catch (err) {
      console.error("API Fetch Teachers Error:", err);
      showError(getErrorMessage(err, S.context.teachers.fetchFailed));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchTeachersFromApi();
  }, [fetchTeachersFromApi]);

  const addTeacher = async (formData) => {
    const token = localStorage.getItem("auth_token");

    if (token && !token.startsWith("demo_token_")) {
      try {
        const saved = await api.post("/teachers", formData);
        setTeachersList((prev) => [...prev, saved]);
        showSuccess(S.context.teachers.addSuccess);
        return saved;
      } catch (err) {
        console.error("API Add Teacher Error:", err);
        const msg = getErrorMessage(err, S.context.teachers.addFailed);
        showError(msg);
        return { error: msg };
      }
    }

    // demo mode
    const newTeacher = { id: Date.now(), status: "نشط", ...formData };
    setTeachersList((prev) => [...prev, newTeacher]);
    showSuccess(S.context.teachers.addDemoSuccess);
    return newTeacher;
  };

  const updateTeacher = async (id, formData) => {
    const token = localStorage.getItem("auth_token");

    if (token && !token.startsWith("demo_token_")) {
      try {
        await api.put(`/teachers/${id}`, formData);
        setTeachersList((prev) => prev.map((t) => (t.id === id ? { ...t, ...formData } : t)));
        showSuccess(S.context.teachers.updateSuccess);
        return { success: true };
      } catch (err) {
        console.error("API Update Teacher Error:", err);
        const msg = getErrorMessage(err, S.context.teachers.updateFailed);
        showError(msg);
        return { error: msg };
      }
    }

    // demo mode
    setTeachersList((prev) => prev.map((t) => (t.id === id ? { ...t, ...formData } : t)));
    showSuccess(S.context.teachers.updateDemoSuccess);
  };

  const deleteTeacher = async (id) => {
    const token = localStorage.getItem("auth_token");

    if (token && !token.startsWith("demo_token_")) {
      try {
        await api.delete(`/teachers/${id}`);
      } catch (err) {
        console.error("API Delete Teacher Error:", err);
        const msg = getErrorMessage(err, S.context.teachers.deleteFailed);
        showError(msg);
        return { error: msg };
      }
    }

    setTeachersList((prev) => prev.filter((t) => t.id !== id));
    showSuccess(S.context.teachers.deleteSuccess);
    return { success: true };
  };

  const toggleTeacherStatus = (id) => {
    setTeachersList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "نشط" ? "إجازة" : "نشط" } : t))
    );
  };

  return (
    <TeachersContext.Provider value={{ teachersList, loading, addTeacher, updateTeacher, deleteTeacher, toggleTeacherStatus }}>
      {children}
    </TeachersContext.Provider>
  );
}

export function useTeachers() {
  const ctx = useContext(TeachersContext);
  if (!ctx) throw new Error("useTeachers لازم تستخدم جوا TeachersProvider");
  return ctx;
}