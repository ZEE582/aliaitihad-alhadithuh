import { createContext, useContext, useState } from "react";

const NotesContext = createContext(null);

const initialNotes = [
  {
    id: 1,
    noteScope: "child",
    childName: "رهف يوسف",
    type: "إيجابي",
    text: "شارك ألعابه مع زملائه بشكل ممتاز خلال وقت اللعب الحر",
    author: "المعلمة نور",
    date: "14 تموز 2026",
  },
  {
    id: 2,
    noteScope: "child",
    childName: "يزن الأحمد",
    type: "ملاحظة",
    text: "بدا متعب قليلاً اليوم، يفضّل متابعة ساعات نومه",
    author: "المعلمة سارة",
    date: "13 تموز 2026",
  },
  {
    id: 3,
    noteScope: "child",
    childName: "سيلين خالد",
    type: "إيجابي",
    text: "أنهت نشاط الرسم بتركيز جيد وساعدت صديقتها بإكمال نشاطها",
    author: "المعلمة ريم",
    date: "12 تموز 2026",
  },
  {
    id: 4,
    noteScope: "child",
    childName: "زين محمود",
    type: "تنبيه",
    text: "احتاج وقت إضافي للتأقلم مع النشاط الجماعي اليوم",
    author: "المعلمة نور",
    date: "10 تموز 2026",
  },
];

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(initialNotes);

  const addNote = (formData, author = "أنتِ") => {
    const today = new Date().toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const newNote = {
      id: Date.now(),
      author,
      date: today,
      noteScope: "child",
      ...formData,
    };

    setNotes((prev) => [newNote, ...prev]);

    return newNote;
  };

  const updateNote = (id, formData) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              ...formData,
            }
          : note
      )
    );
  };

  const deleteNote = (id) => {
    setNotes((prev) =>
      prev.filter((note) => note.id !== id)
    );
  };

  const getChildNotes = (childName) => {
    return notes.filter(
      (note) =>
        note.noteScope === "child" &&
        note.childName === childName
    );
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        getChildNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error(
      "useNotes لازم تستخدم جوا NotesProvider"
    );
  }

  return context;
}