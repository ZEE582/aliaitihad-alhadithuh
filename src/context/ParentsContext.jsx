import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { strings as S } from "../constants/strings";

const ParentsContext = createContext(null);

const initialParents = [
  { id: 1, GID: 1, name: "محمد يوسف", phone: "059-1234567", childrenNames: "رهف يوسف", status: "نشط" },
  { id: 2, GID: 2, name: "علي الأحمد", phone: "059-7654321", childrenNames: "يزن الأحمد", status: "نشط" },
  { id: 3, GID: 3, name: "خالد درويش", phone: "056-2233445", childrenNames: "سيلين خالد", status: "نشط" },
  { id: 4, GID: 4, name: "محمود عودة", phone: "059-9988776", childrenNames: "زين محمود", status: "نشط" },
];

const formatParent = (p) => {
  const childrenStr =
    Array.isArray(p.children) && p.children.length > 0
      ? p.children
          .map((c) => `${c.firstName || c.F_name || ""} ${c.lastName || c.L_name || ""}`.trim())
          .filter(Boolean)
          .join("، ")
      : p.childrenNames || "";
  return {
    id: p.GID || p.id,
    GID: p.GID || p.id,
    userId: p.userId,
    name: p.user?.fullName || `${p.G_F_name || ""} ${p.G_L_name || ""}`.trim() || p.name || "",
    phone: p.user?.phone || p.G_phone || p.phone || "",
    email: p.user?.email || p.email || "",
    childrenNames: childrenStr,
    status: p.status || "نشط",
    raw: p,
  };
};

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.children.error403;
  if (err?.status === 404) return S.context.children.error404;
  if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch"))
    return S.context.children.errorNetwork;
  return err?.message || fallback;
};

export function ParentsProvider({ children }) {
  const [parentsList, setParentsList] = useState(() => {
    const saved = localStorage.getItem("app_parents_list");
    return saved ? JSON.parse(saved) : initialParents;
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    localStorage.setItem("app_parents_list", JSON.stringify(parentsList));
  }, [parentsList]);

  const fetchParentsFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token || token.startsWith("demo_token_")) return;

    setLoading(true);
    try {
      const data = await api.get("/parents");
      const list = Array.isArray(data) ? data : data?.parents || [];
      setParentsList(list.map(formatParent));
    } catch (err) {
      console.error("API Fetch Parents Error:", err);
      showError(getErrorMessage(err, S.context.parents.fetchFailed));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchParentsFromApi();
  }, [fetchParentsFromApi]);

  // =====================
  // إضافة ولي أمر
  // =====================
  const addParent = async (formData) => {
    const token = localStorage.getItem("auth_token");
    const nameParts = (formData.name || "").trim().split(" ");
    const payload = {
      G_F_name: nameParts[0] || "ولي",
      G_L_name: nameParts.slice(1).join(" ") || "أمر",
      G_phone: formData.phone || "",
      ...(formData.userId && { userId: formData.userId }),
    };

    if (token && !token.startsWith("demo_token_")) {
      try {
        const saved = await api.post("/parents", payload);
        const formatted = formatParent(saved);
        setParentsList((prev) => [...prev, formatted]);
        showSuccess(S.context.parents.addSuccess);
        return formatted;
      } catch (err) {
        console.error("API Add Parent Error:", err);
        const msg = getErrorMessage(err, S.context.parents.addFailed);
        showError(msg);
        return { error: msg };
      }

    }

    // demo mode
    const newParent = formatParent({ GID: Date.now(), ...formData });
    setParentsList((prev) => [...prev, newParent]);
    showSuccess(S.context.parents.addDemoSuccess);
    return newParent;
  };

  // =====================
  // تعديل ولي أمر
  // =====================
  const updateParent = async (id, formData) => {
    const token = localStorage.getItem("auth_token");
    const nameParts = (formData.name || "").trim().split(" ");
    const payload = {
      ...(formData.name && {
        G_F_name: nameParts[0] || "ولي",
        G_L_name: nameParts.slice(1).join(" ") || nameParts[0] || "أمر",
      }),
      ...(formData.phone && { G_phone: formData.phone }),
    };

    if (token && !token.startsWith("demo_token_")) {
      try {
        const updated = await api.put(`/parents/${id}`, payload);
        const formatted = formatParent(updated);
        setParentsList((prev) =>
          prev.map((p) => (p.id === id || p.GID === id ? formatted : p))
        );
        showSuccess(S.context.parents.updateSuccess);
        return formatted;
      } catch (err) {
        const msg = err.message || S.context.parents.updateFailed;
        showError(msg);
        return { error: msg };
      }
    }

    // demo mode
    setParentsList((prev) =>
      prev.map((p) => (p.id === id || p.GID === id ? { ...p, ...formData } : p))
    );
    showSuccess(S.context.parents.updateDemoSuccess);
  };

  // =====================
  // حذف ولي أمر
  // =====================
  const deleteParent = async (id) => {
    const token = localStorage.getItem("auth_token");
    if (token && !token.startsWith("demo_token_")) {
      try {
        await api.delete(`/parents/${id}`);
      } catch (err) {
        const msg = err.message || S.context.parents.deleteFailed;
        showError(msg);
        return { error: msg }; // ← يوقف هنا، ما يحذف من الـ UI
      }
    }
    setParentsList((prev) => prev.filter((p) => p.id !== id && p.GID !== id));
    showSuccess(S.context.parents.deleteSuccess);
    return { success: true };
  };

  // =====================
  // تبديل الحالة (فرونت فقط)
  // =====================
  const toggleParentStatus = (id) => {
    setParentsList((prev) =>
      prev.map((p) =>
        p.id === id || p.GID === id
          ? { ...p, status: p.status === "نشط" ? "موقوف" : "نشط" }
          : p
      )
    );
  };

  return (
    <ParentsContext.Provider
      value={{
        parentsList,
        loading,
        fetchParents: fetchParentsFromApi,
        addParent,
        updateParent,
        deleteParent,
        toggleParentStatus,
      }}
    >
      {children}
    </ParentsContext.Provider>
  );
}

export function useParents() {
  const ctx = useContext(ParentsContext);
  if (!ctx) throw new Error("useParents لازم تستخدم جوا ParentsProvider");
  return ctx;
}
