import { createContext, useContext, useState } from "react";

const ParentsContext = createContext(null);

const initialParents = [
  { id: 1, name: "محمد يوسف", phone: "059-1234567", childrenNames: "رهف يوسف", status: "نشط" },
  { id: 2, name: "علي الأحمد", phone: "059-7654321", childrenNames: "يزن الأحمد", status: "نشط" },
  { id: 3, name: "خالد درويش", phone: "056-2233445", childrenNames: "سيلين خالد", status: "نشط" },
  { id: 4, name: "محمود عودة", phone: "059-9988776", childrenNames: "زين محمود", status: "نشط" },
];

export function ParentsProvider({ children }) {
  const [parentsList, setParentsList] = useState(initialParents);

  const addParent = (formData) => {
    const newParent = { id: Date.now(), status: "نشط", ...formData };
    setParentsList((prev) => [...prev, newParent]);
    return newParent;
  };

  const updateParent = (id, formData) => {
    setParentsList((prev) => prev.map((p) => (p.id === id ? { ...p, ...formData } : p)));
  };

  const deleteParent = (id) => {
    setParentsList((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleParentStatus = (id) => {
    setParentsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === "نشط" ? "موقوف" : "نشط" } : p))
    );
  };

  return (
    <ParentsContext.Provider value={{ parentsList, addParent, updateParent, deleteParent, toggleParentStatus }}>
      {children}
    </ParentsContext.Provider>
  );
}

export function useParents() {
  const ctx = useContext(ParentsContext);
  if (!ctx) throw new Error("useParents لازم تستخدم جوا ParentsProvider");
  return ctx;
}