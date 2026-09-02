import { createContext, useContext, useState } from "react";

const ChildrenContext = createContext(null);

const initialChildren = [
  {
    id: 1,
    name: "رهف يوسف",
    classroom: "صف الفراشات",
    age: 4,
    parent: "محمد يوسف",
    parentPhone: "059-1234567",
    status: "نشط",
    notes: [
      {
        id: 101,
        author: "أ. سارة الحاج",
        date: "14 يوليو 2026",
        type: "إيجابي",
        text: "كانت متفاعلة جدًا مع النشاط اليوم.",
      },
    ],
  },

  {
    id: 2,
    name: "يزن الأحمد",
    classroom: "صف النجوم",
    age: 5,
    parent: "علي الأحمد",
    parentPhone: "059-7654321",
    status: "نشط",
    notes: [],
  },

  {
    id: 3,
    name: "سيلين خالد",
    classroom: "صف النجوم",
    age: 4,
    parent: "خالد درويش",
    parentPhone: "056-2233445",
    status: "نشط",
    notes: [],
  },

  {
    id: 4,
    name: "زين محمود",
    classroom: "صف الفراشات",
    age: 3,
    parent: "محمود عودة",
    parentPhone: "059-9988776",
    status: "موقوف",
    notes: [],
  },
];

export function ChildrenProvider({ children }) {
  const [childrenList, setChildrenList] =
    useState(initialChildren);

  const addChild = (formData) => {
    const newChild = {
      id: Date.now(),
      status: "نشط",
      notes: [],
      ...formData,
    };

    setChildrenList((prev) => [
      ...prev,
      newChild,
    ]);

    return newChild;
  };

  const updateChild = (id, formData) => {
    setChildrenList((prev) =>
      prev.map((child) =>
        child.id === id
          ? {
              ...child,
              ...formData,
            }
          : child
      )
    );
  };

  const deleteChild = (id) => {
    setChildrenList((prev) =>
      prev.filter((child) => child.id !== id)
    );
  };

  const toggleChildStatus = (id) => {
    setChildrenList((prev) =>
      prev.map((child) =>
        child.id === id
          ? {
              ...child,
              status:
                child.status === "نشط"
                  ? "موقوف"
                  : "نشط",
            }
          : child
      )
    );
  };

  // إضافة ملاحظة مباشرة إلى ملف الطفل
  const addChildNote = (childId, noteData) => {
    const newNote = {
      id: Date.now(),
      ...noteData,
    };

    setChildrenList((prev) =>
      prev.map((child) =>
        child.id === childId
          ? {
              ...child,
              notes: [
                newNote,
                ...(child.notes || []),
              ],
            }
          : child
      )
    );

    return newNote;
  };

  return (
    <ChildrenContext.Provider
      value={{
        childrenList,
        addChild,
        updateChild,
        deleteChild,
        toggleChildStatus,
        addChildNote,
      }}
    >
      {children}
    </ChildrenContext.Provider>
  );
}

export function useChildren() {
  const ctx = useContext(ChildrenContext);

  if (!ctx) {
    throw new Error(
      "useChildren لازم تستخدم جوا ChildrenProvider"
    );
  }

  return ctx;
}