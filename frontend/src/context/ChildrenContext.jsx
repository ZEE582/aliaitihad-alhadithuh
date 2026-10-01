import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { strings as S } from "../constants/strings";

const ChildrenContext = createContext(null);

const initialChildren = [
  {
    id: 1, name: "رهف يوسف", classroom: "صف الفراشات", age: 4,
    parent: "محمد يوسف", parentPhone: "059-1234567", status: "نشط",
    notes: [{ id: 101, author: "أ. سارة الحاج", date: "14 يوليو 2026", type: "إيجابي", text: "كانت متفاعلة جدًا مع النشاط اليوم." }],
  },
  { id: 2, name: "يزن الأحمد", classroom: "صف النجوم", age: 5, parent: "علي الأحمد", parentPhone: "059-7654321", status: "نشط", notes: [] },
  { id: 3, name: "سيلين خالد", classroom: "صف النجوم", age: 4, parent: "خالد درويش", parentPhone: "056-2233445", status: "نشط", notes: [] },
  { id: 4, name: "زين محمود", classroom: "صف الفراشات", age: 3, parent: "محمود عودة", parentPhone: "059-9988776", status: "موقوف", notes: [] },
];

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.children.error403;
  if (err?.status === 404) return S.context.children.error404;
  if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch"))
    return S.context.children.errorNetwork;
  return err?.message || fallback;
};

export function ChildrenProvider({ children }) {
  const [childrenList, setChildrenList] = useState(() => {
    const saved = localStorage.getItem("app_children_list");
    return saved ? JSON.parse(saved) : initialChildren;
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    localStorage.setItem("app_children_list", JSON.stringify(childrenList));
  }, [childrenList]);

  const fetchChildrenFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token || token.startsWith("demo_token_")) return;

    setLoading(true);
    try {
      const data = await api.get("/children");
      if (Array.isArray(data)) setChildrenList(data);
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

    if (token && !token.startsWith("demo_token_")) {
      try {
        const savedApiChild = await api.post("/children", formData);
        setChildrenList((prev) => [...prev, savedApiChild]);
        showSuccess(S.context.children.addSuccess);
        return savedApiChild;
      } catch (err) {
        console.error("API Add Child Error:", err);
        const msg = getErrorMessage(err, S.context.children.addFailed);
        showError(msg);
        return { error: msg };
      }
    }

    // demo mode
    const newChild = { id: Date.now(), status: "نشط", notes: [], ...formData };
    setChildrenList((prev) => [...prev, newChild]);
    showSuccess(S.context.children.addDemoSuccess);
    return newChild;
  };

  const updateChild = async (id, formData) => {
    const token = localStorage.getItem("auth_token");

    if (token && !token.startsWith("demo_token_")) {
      try {
        await api.put(`/children/${id}`, formData);
        setChildrenList((prev) =>
          prev.map((child) => (child.id === id ? { ...child, ...formData } : child))
        );
        showSuccess(S.context.children.updateSuccess);
        return { success: true };
      } catch (err) {
        console.error("API Update Child Error:", err);
        const msg = getErrorMessage(err, S.context.children.updateFailed);
        showError(msg);
        return { error: msg };
      }
    }

    // demo mode
    setChildrenList((prev) =>
      prev.map((child) => (child.id === id ? { ...child, ...formData } : child))
    );
    showSuccess(S.context.children.updateDemoSuccess);
  };

  const deleteChild = async (id) => {
    const token = localStorage.getItem("auth_token");

    if (token && !token.startsWith("demo_token_")) {
      try {
        await api.delete(`/children/${id}`);
      } catch (err) {
        console.error("API Delete Child Error:", err);
        const msg = getErrorMessage(err, S.context.children.deleteFailed);
        showError(msg);
        return { error: msg };
      }
    }

    setChildrenList((prev) => prev.filter((child) => child.id !== id));
    showSuccess(S.context.children.deleteSuccess);
    return { success: true };
  };

  const toggleChildStatus = (id) => {
    setChildrenList((prev) =>
      prev.map((child) =>
        child.id === id
          ? { ...child, status: child.status === "نشط" ? "موقوف" : "نشط" }
          : child
      )
    );
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
      value={{ childrenList, loading, addChild, updateChild, deleteChild, toggleChildStatus, addChildNote }}
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