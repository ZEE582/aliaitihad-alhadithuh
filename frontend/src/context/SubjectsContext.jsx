import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { useUser } from "./UserContext";
import { strings as S } from "../constants/strings";

const SubjectsContext = createContext(null);

const normalizeSubject = (item) => ({
  id: item.SubjectID,
  SubjectID: item.SubjectID,
  name: item.Subject_name || "",
  Subject_name: item.Subject_name || "",
  level: item.level || "",
  semester: item.semester || "",
  teachersCount: Array.isArray(item.teachers) ? item.teachers.length : 0,
  sessionsCount: Array.isArray(item.sessions) ? item.sessions.length : 0,
  raw: item,
});

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.children.error403;
  if (err?.status === 404) return S.context.children.error404;
  if (err?.status === 409) return err?.message || fallback;
  if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch"))
    return S.context.children.errorNetwork;
  return err?.message || fallback;
};

export function SubjectsProvider({ children }) {
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const { user } = useUser();

  const fetchSubjectsFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token || !user?.roleType) return;

    setLoading(true);
    try {
      const data = await api.get("/subjects");
      const list = Array.isArray(data) ? data : data?.subjects || [];
      setSubjectsList(list.map(normalizeSubject));
    } catch (err) {
      console.error("API Fetch Subjects Error:", err);
      showError(getErrorMessage(err, S.context.subjects.fetchFailed));
    } finally {
      setLoading(false);
    }
  }, [showError, user?.roleType]);

  useEffect(() => {
    fetchSubjectsFromApi();
  }, [fetchSubjectsFromApi]);

  const addSubject = async (formData) => {
    try {
      const saved = await api.post("/subjects", {
        Subject_name: formData.Subject_name,
        level: formData.level,
        semester: formData.semester,
      });
      const formatted = normalizeSubject(saved);
      setSubjectsList((prev) => [...prev, formatted]);
      showSuccess(S.context.subjects.addSuccess);
      return formatted;
    } catch (err) {
      const msg = getErrorMessage(err, S.context.subjects.addFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const updateSubject = async (id, formData) => {
    try {
      const updated = await api.put(`/subjects/${id}`, {
        Subject_name: formData.Subject_name,
        level: formData.level,
        semester: formData.semester,
      });
      const formatted = normalizeSubject(updated);
      setSubjectsList((prev) => prev.map((s) => (s.id === id ? formatted : s)));
      showSuccess(S.context.subjects.updateSuccess);
      return formatted;
    } catch (err) {
      const msg = getErrorMessage(err, S.context.subjects.updateFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const deleteSubject = async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
    } catch (err) {
      const msg =
        err?.status === 409
          ? S.context.subjects.deleteBlocked
          : getErrorMessage(err, S.context.subjects.deleteFailed);
      showError(msg);
      return { error: msg };
    }
    setSubjectsList((prev) => prev.filter((s) => s.id !== id));
    showSuccess(S.context.subjects.deleteSuccess);
    return { success: true };
  };

  return (
    <SubjectsContext.Provider
      value={{
        subjectsList,
        loading,
        fetchSubjects: fetchSubjectsFromApi,
        addSubject,
        updateSubject,
        deleteSubject,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const ctx = useContext(SubjectsContext);
  if (!ctx) throw new Error("useSubjects لازم تستخدم جوا SubjectsProvider");
  return ctx;
}
