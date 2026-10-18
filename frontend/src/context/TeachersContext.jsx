import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { strings as S } from "../constants/strings";

const TeachersContext = createContext(null);

const normalizeTeacher = (teacher) => {
  const fullName =
    teacher.person?.Name ||
    [teacher.F_name, teacher.S_name, teacher.Th_name, teacher.L_name]
      .filter(Boolean)
      .join(" ");

  const section = teacher.assignedSection?.SectionName || "";
  const className = teacher.assignedSection?.classRoom?.className || "";

  return {
    ...teacher,
    PersonID: teacher.PersonID,
    name: fullName,
    phone: teacher.user?.phone || "",
    email: teacher.user?.email || "",
    subjectId: teacher.subject_id ?? "",
    subjectName: teacher.subject?.Subject_name || "",
    specialty: teacher.specialty || "",
    tNumber: teacher.T_Number || "",
    yearsOfExperience: teacher.years_of_experience ?? "",
    section,
    className,
    classroom: section || className,
  };
};

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.children.error403;
  if (err?.status === 404) return S.context.children.error404;
  if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch"))
    return S.context.children.errorNetwork;
  return err?.message || fallback;
};

const EDITABLE_FIELDS = [
  "F_name",
  "S_name",
  "Th_name",
  "L_name",
  "T_Number",
  "specialty",
  "years_of_experience",
  "subject_id",
];

export function TeachersProvider({ children }) {
  const [teachersList, setTeachersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchTeachersFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    setLoading(true);
    try {
      const data = await api.get("/teachers");
      if (Array.isArray(data)) setTeachersList(data.map(normalizeTeacher));
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

  const updateTeacher = async (personId, formData) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return { error: S.context.teachers.updateFailed };

    const payload = {};
    EDITABLE_FIELDS.forEach((field) => {
      if (formData[field] !== undefined) payload[field] = formData[field];
    });

    try {
      await api.put(`/teachers/${personId}`, payload);
      await fetchTeachersFromApi();
      showSuccess(S.context.teachers.updateSuccess);
      return { success: true };
    } catch (err) {
      console.error("API Update Teacher Error:", err);
      const msg = getErrorMessage(err, S.context.teachers.updateFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const deleteTeacher = async (personId) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return { error: S.context.teachers.deleteFailed };

    try {
      await api.delete(`/teachers/${personId}`);
      setTeachersList((prev) => prev.filter((t) => t.PersonID !== personId));
      showSuccess(S.context.teachers.deleteSuccess);
      return { success: true };
    } catch (err) {
      console.error("API Delete Teacher Error:", err);
      const msg =
        err?.status === 409
          ? S.context.teachers.deleteBlockedAssigned
          : getErrorMessage(err, S.context.teachers.deleteFailed);
      showError(msg);
      return { error: msg };
    }
  };

  return (
    <TeachersContext.Provider
      value={{ teachersList, loading, refreshTeachers: fetchTeachersFromApi, updateTeacher, deleteTeacher }}
    >
      {children}
    </TeachersContext.Provider>
  );
}

export function useTeachers() {
  const ctx = useContext(TeachersContext);
  if (!ctx) throw new Error("useTeachers لازم تستخدم جوا TeachersProvider");
  return ctx;
}
