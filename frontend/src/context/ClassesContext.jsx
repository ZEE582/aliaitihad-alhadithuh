import { createContext, useContext, useState } from "react";

const ClassesContext = createContext(null);

const initialClasses = [
  { id: 1, name: "صف الفراشات", teacher: "أ. نور سلامة", capacity: 30 },
  { id: 2, name: "صف النجوم", teacher: "أ. سارة الحاج", capacity: 30 },
  { id: 3, name: "صف القمر", teacher: "أ. ريم عودة", capacity: 25 },
  { id: 4, name: "صف الشمس", teacher: "أ. لينا خليل", capacity: 25 },
];

export function ClassesProvider({ children }) {
  const [classesList, setClassesList] = useState(initialClasses);

  const addClass = (formData) => {
    const newClass = { id: Date.now(), ...formData };
    setClassesList((prev) => [...prev, newClass]);
    return newClass;
  };

  const updateClass = (id, formData) => {
    setClassesList((prev) => prev.map((c) => (c.id === id ? { ...c, ...formData } : c)));
  };

  const deleteClass = (id) => {
    setClassesList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ClassesContext.Provider value={{ classesList, addClass, updateClass, deleteClass }}>
      {children}
    </ClassesContext.Provider>
  );
}

export function useClasses() {
  const ctx = useContext(ClassesContext);
  if (!ctx) throw new Error("useClasses لازم تستخدم جوا ClassesProvider");
  return ctx;
}