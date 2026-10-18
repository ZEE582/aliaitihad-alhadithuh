import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { useUser } from "./UserContext";
import { strings as S } from "../constants/strings";

const ClassesContext = createContext(null);

const teacherName = (teacher) => {
  if (!teacher) return "";
  if (teacher.person?.Name) return teacher.person.Name;
  return [teacher.F_name, teacher.S_name, teacher.Th_name, teacher.L_name]
    .filter(Boolean)
    .join(" ");
};

const normalizeClass = (item) => ({
  ...item,
  id: item.classID,
  classID: item.classID,
  name: item.className,
});

const normalizeSection = (item) => ({
  ...item,
  id: item.section_id,
  name: item.SectionName,
  nameLevel: item.Name_level,
  level: item.Level,
  capacity: item.Capacity,
  classID: item.classID,
  className: item.classRoom?.className || "",
  teacherId: item.assigned_teacher_id,
  teacherName: teacherName(item.assignedTeacher),
  childCount: Array.isArray(item.children) ? item.children.length : 0,
});

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.classes.error403;
  if (err?.status === 404) return S.context.classes.error404;
  if (err?.status === 409) return err?.message || fallback;
  const message = err?.message?.toLowerCase() || "";
  if (message.includes("network") || message.includes("fetch")) {
    return S.context.classes.errorNetwork;
  }
  return err?.message || fallback;
};

export function ClassesProvider({ children }) {
  const [classesList, setClassesList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = useToast();
  const { user } = useUser();

  const roleType = user?.roleType;
  const canRead = roleType === "admin" || roleType === "secretary" || roleType === "teacher";

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token || !canRead) return;

    setLoading(true);
    try {
      const [classes, sections] = await Promise.all([
        api.get("/classes"),
        api.get("/sections"),
      ]);

      if (Array.isArray(classes)) {
        setClassesList(classes.map(normalizeClass));
      }
      if (Array.isArray(sections)) {
        setSectionsList(sections.map(normalizeSection));
      }
    } catch (err) {
      console.error("API Fetch Classes/Sections Error:", err);
      showError(getErrorMessage(err, S.context.classes.fetchFailed));
    } finally {
      setLoading(false);
    }
  }, [canRead, showError]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addClass = async (formData) => {
    try {
      await api.post("/classes", { className: formData.name });
      await fetchAll();
      showSuccess(S.context.classes.saveSuccess);
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, S.context.classes.saveFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const updateClass = async (id, formData) => {
    try {
      await api.put(`/classes/${id}`, { className: formData.name });
      await fetchAll();
      showSuccess(S.context.classes.saveSuccess);
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, S.context.classes.saveFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const deleteClass = async (id) => {
    try {
      await api.delete(`/classes/${id}`);
      await fetchAll();
      showSuccess(S.context.classes.deleteSuccess);
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, S.context.classes.deleteFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const addSection = async (formData) => {
    try {
      await api.post("/sections", formData);
      await fetchAll();
      showSuccess(S.context.classes.saveSuccess);
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, S.context.classes.saveFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const updateSection = async (id, formData) => {
    try {
      await api.put(`/sections/${id}`, formData);
      await fetchAll();
      showSuccess(S.context.classes.saveSuccess);
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, S.context.classes.saveFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const deleteSection = async (id) => {
    try {
      await api.delete(`/sections/${id}`);
      await fetchAll();
      showSuccess(S.context.classes.deleteSuccess);
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, S.context.classes.deleteFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const placeChild = async (childId, sectionId) => {
    try {
      await api.put(`/children/${childId}/placement`, {
        section_id: sectionId === "" || sectionId === undefined ? null : Number(sectionId),
      });
      await fetchAll();
      showSuccess(S.context.classes.placeSuccess);
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, S.context.classes.placeFailed);
      showError(msg);
      return { error: msg };
    }
  };

  return (
    <ClassesContext.Provider
      value={{
        classesList,
        sectionsList,
        loading,
        refresh: fetchAll,
        addClass,
        updateClass,
        deleteClass,
        addSection,
        updateSection,
        deleteSection,
        placeChild,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
}

export function useClasses() {
  const ctx = useContext(ClassesContext);
  if (!ctx) throw new Error("useClasses لازم تستخدم جوا ClassesProvider");
  return ctx;
}
