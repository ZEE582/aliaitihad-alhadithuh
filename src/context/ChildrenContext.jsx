import { createContext, useContext, useState } from "react";

const ChildrenContext = createContext(null);

const initialChildren = [
  { id: 1, name: "رهف يوسف", classroom: "صف الفراشات", age: 4, parent: "محمد يوسف", parentPhone: "059-1234567", status: "نشط" },
  { id: 2, name: "يزن الأحمد", classroom: "صف النجوم", age: 5, parent: "علي الأحمد", parentPhone: "059-7654321", status: "نشط" },
  { id: 3, name: "سيلين خالد", classroom: "صف النجوم", age: 4, parent: "خالد درويش", parentPhone: "056-2233445", status: "نشط" },
  { id: 4, name: "زين محمود", classroom: "صف الفراشات", age: 3, parent: "محمود عودة", parentPhone: "059-9988776", status: "موقوف" },
];

// أي صفحة بالتطبيق بدها تتعامل مع بيانات الأطفال (تعرض، تضيف، تعدل، تحذف)
// لازم تمر من هون، مش تعمل نسخة بيانات لحالها. هيك بنضمن إنه كل الصفحات
// (الأطفال، الملاحظات، الحضور، التقارير...) شايفين نفس القائمة بالضبط.
export function ChildrenProvider({ children }) {
  const [childrenList, setChildrenList] = useState(initialChildren);

  const addChild = (formData) => {
    const newChild = { id: Date.now(), status: "نشط", ...formData };
    setChildrenList((prev) => [...prev, newChild]);
    return newChild;
  };

  const updateChild = (id, formData) => {
    setChildrenList((prev) => prev.map((c) => (c.id === id ? { ...c, ...formData } : c)));
  };

  const deleteChild = (id) => {
    setChildrenList((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleChildStatus = (id) => {
    setChildrenList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "نشط" ? "موقوف" : "نشط" } : c))
    );
  };

  return (
    <ChildrenContext.Provider
      value={{ childrenList, addChild, updateChild, deleteChild, toggleChildStatus }}
    >
      {children}
    </ChildrenContext.Provider>
  );
}

// أي مكون بدو يوصل لبيانات الأطفال بينده هاد الهوك بدل ما يعمل useState لحاله
export function useChildren() {
  const ctx = useContext(ChildrenContext);
  if (!ctx) {
    throw new Error("useChildren لازم تستخدم جوا ChildrenProvider");
  }
  return ctx;
}