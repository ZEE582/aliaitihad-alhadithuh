import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { useUser } from "./UserContext";
import { strings as S } from "../constants/strings";

const SessionsContext = createContext(null);

const teacherNameOf = (t) => {
  if (!t) return "";
  if (t.person?.Name) return t.person.Name;
  return [t.F_name, t.S_name, t.Th_name, t.L_name].filter(Boolean).join(" ");
};

const normalizeSession = (item) => ({
  id: item.SessionID,
  SessionID: item.SessionID,
  date: item.Date || "",
  day: item.day || "",
  period: item.Period || "",
  duration: item.Duration || "",
  notes: item.Notes || "",
  subjectId: item.SubjectID,
  subjectName: item.subject?.Subject_name || "",
  level: item.subject?.level || "",
  semester: item.subject?.semester || "",
  sectionId: item.section_id,
  sectionName: item.section?.SectionName || "",
  className: item.section?.classRoom?.className || "",
  teacherId: item.teacher_PersonID,
  teacherName:
    teacherNameOf(item.sessionTeacher) ||
    teacherNameOf(item.section?.assignedTeacher),
  raw: item,
});

const sortSessions = (list) =>
  [...list].sort((a, b) => {
    const d = String(a.date).localeCompare(String(b.date));
    if (d !== 0) return d;
    return String(a.period).localeCompare(String(b.period));
  });

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.children.error403;
  if (err?.status === 404) return S.context.children.error404;
  if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch"))
    return S.context.children.errorNetwork;
  return err?.message || fallback;
};

export function SessionsProvider({ children }) {
  const [sessionsList, setSessionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const { user } = useUser();

  const fetchSessionsFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token || !user?.roleType) return;

    setLoading(true);
    try {
      const data = await api.get("/sessions");
      const list = Array.isArray(data) ? data : data?.sessions || [];
      setSessionsList(sortSessions(list.map(normalizeSession)));
    } catch (err) {
      console.error("API Fetch Sessions Error:", err);
      showError(getErrorMessage(err, S.context.sessions.fetchFailed));
    } finally {
      setLoading(false);
    }
  }, [showError, user?.roleType]);

  useEffect(() => {
    fetchSessionsFromApi();
  }, [fetchSessionsFromApi]);

  const addSession = async (formData) => {
    try {
      const saved = await api.post("/sessions", formData);
      const formatted = normalizeSession(saved);
      setSessionsList((prev) => sortSessions([...prev, formatted]));
      showSuccess(S.context.sessions.addSuccess);
      return formatted;
    } catch (err) {
      const msg = getErrorMessage(err, S.context.sessions.addFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const updateSession = async (id, formData) => {
    try {
      const updated = await api.put(`/sessions/${id}`, formData);
      const formatted = normalizeSession(updated);
      setSessionsList((prev) =>
        sortSessions(prev.map((s) => (s.id === id ? formatted : s)))
      );
      showSuccess(S.context.sessions.updateSuccess);
      return formatted;
    } catch (err) {
      const msg = getErrorMessage(err, S.context.sessions.updateFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const deleteSession = async (id) => {
    try {
      await api.delete(`/sessions/${id}`);
    } catch (err) {
      const msg = getErrorMessage(err, S.context.sessions.deleteFailed);
      showError(msg);
      return { error: msg };
    }
    setSessionsList((prev) => prev.filter((s) => s.id !== id));
    showSuccess(S.context.sessions.deleteSuccess);
    return { success: true };
  };

  return (
    <SessionsContext.Provider
      value={{
        sessionsList,
        loading,
        fetchSessions: fetchSessionsFromApi,
        addSession,
        updateSession,
        deleteSession,
      }}
    >
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  const ctx = useContext(SessionsContext);
  if (!ctx) throw new Error("useSessions لازم تستخدم جوا SessionsProvider");
  return ctx;
}
