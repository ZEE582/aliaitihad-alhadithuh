import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { strings as S } from "../constants/strings";

const ChildrenContext = createContext(null);

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.children.error403;
  if (err?.status === 404) return S.context.children.error404;
  if (err?.status === 409) return err?.message || fallback;
  if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch"))
    return S.context.children.errorNetwork;
  return err?.message || fallback;
};

const calculateAgeYears = (birthDate) => {
  if (!birthDate) return "";
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return "";
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) years -= 1;
  return years >= 0 ? years : "";
};

const toDateOnly = (value) => {
  if (value == null) return "";
  return String(value).slice(0, 10);
};

const normalizeChild = (child) => ({
  ...child,
  id: child.PersonID,
  name:
    child.person?.Name ||
    [child.F_name, child.S_name, child.Th_name, child.L_name].filter(Boolean).join(" "),
  F_name: child.F_name || "",
  S_name: child.S_name || "",
  Th_name: child.Th_name || "",
  L_name: child.L_name || "",
  gender: child.gender || "",
  birthDate: toDateOnly(child.birth_date),
  age: calculateAgeYears(child.birth_date),
  classID: child.classID ?? "",
  section_id: child.section_id ?? "",
  sectionName: child.section?.SectionName || "",
  className: child.classRoom?.className || "",
  classroom:
    [child.section?.SectionName, child.classRoom?.className].filter(Boolean).join(" — ") ||
    S.common.notSpecified,
  parent: "",
  status: S.common.statusActive,
});

const buildChildPayload = (formData) => ({
  F_name: (formData.F_name || "").trim(),
  S_name: (formData.S_name || "").trim(),
  Th_name: (formData.Th_name || "").trim(),
  L_name: (formData.L_name || "").trim(),
  gender: formData.gender,
  birth_date: formData.birth_date,
  birthplace: (formData.birthplace || "").trim(),
  classID: formData.classID === "" || formData.classID == null ? null : Number(formData.classID),
  section_id:
    formData.section_id === "" || formData.section_id == null ? null : Number(formData.section_id),
});

export function ChildrenProvider({ children }) {
  const [childrenList, setChildrenList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchChildrenFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    setLoading(true);
    try {
      const data = await api.get("/children");
      if (Array.isArray(data)) setChildrenList(data.map(normalizeChild));
    } catch (err) {
      console.error("API Fetch Children Error:", err);
      showError(getErrorMessage(err, S.context.children.fetchFailed));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchChildrenFromApi();
  }, [fetchChildrenFromApi]);

  const addChild = async (formData) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      const msg = S.context.children.errorNetwork;
      showError(msg);
      return { error: msg };
    }

    try {
      const saved = await api.post("/children", buildChildPayload(formData));

      if (formData.guardianId) {
        try {
          await api.post(`/parents/${formData.guardianId}/children`, { childId: saved.PersonID });
        } catch (linkErr) {
          console.error("API Link Guardian Error:", linkErr);
          showError(S.context.children.linkGuardianFailed);
        }
      }

      await fetchChildrenFromApi();
      showSuccess(S.context.children.addSuccess);
      return normalizeChild(saved);
    } catch (err) {
      console.error("API Add Child Error:", err);
      const msg = getErrorMessage(err, S.context.children.addFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const updateChild = async (id, formData) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      const msg = S.context.children.errorNetwork;
      showError(msg);
      return { error: msg };
    }

    try {
      await api.put(`/children/${id}`, buildChildPayload(formData));
      await fetchChildrenFromApi();
      showSuccess(S.context.children.updateSuccess);
      return { success: true };
    } catch (err) {
      console.error("API Update Child Error:", err);
      const msg = getErrorMessage(err, S.context.children.updateFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const deleteChild = async (id) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      const msg = S.context.children.errorNetwork;
      showError(msg);
      return { error: msg };
    }

    try {
      await api.delete(`/children/${id}`);
      await fetchChildrenFromApi();
      showSuccess(S.context.children.deleteSuccess);
      return { success: true };
    } catch (err) {
      console.error("API Delete Child Error:", err);
      const msg = getErrorMessage(err, S.context.children.deleteFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const addChildNote = (childId, noteData) => {
    const newNote = { id: Date.now(), ...noteData };
    setChildrenList((prev) =>
      prev.map((child) =>
        child.id === childId
          ? { ...child, notes: [newNote, ...(child.notes || [])] }
          : child
      )
    );
    return newNote;
  };

  return (
    <ChildrenContext.Provider
      value={{
        childrenList,
        loading,
        refreshChildren: fetchChildrenFromApi,
        addChild,
        updateChild,
        deleteChild,
        addChildNote,
      }}
    >
      {children}
    </ChildrenContext.Provider>
  );
}

export function useChildren() {
  const ctx = useContext(ChildrenContext);
  if (!ctx) throw new Error("useChildren لازم تستخدم جوا ChildrenProvider");
  return ctx;
}
