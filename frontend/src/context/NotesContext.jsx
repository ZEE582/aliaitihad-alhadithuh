import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { strings as S } from "../constants/strings";

const NotesContext = createContext(null);

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.children.error403;
  if (err?.status === 404) return S.context.children.error404;
  if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch"))
    return S.context.children.errorNetwork;
  return err?.message || fallback;
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const normalizeNote = (note) => ({
  id: note.NoteID ?? note.id,
  noteScope: "child",
  childName: note.receiver?.fullName || note.sender?.fullName || "",
  type: note.NoteCategory || "ملاحظة",
  text: note.NoteText || "",
  author: note.sender?.fullName || "",
  date: formatDate(note.NoteDate),
  senderId: note.SenderID,
  receiverId: note.ReceiverID,
  receiverName: note.receiver?.fullName || "",
  receiverRole: note.receiver?.roleType || "",
});

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchNotesFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    setLoading(true);
    try {
      const data = await api.get("/notes");
      if (Array.isArray(data)) setNotes(data.map(normalizeNote));
    } catch (err) {
      console.error("API Fetch Notes Error:", err);
      showError(getErrorMessage(err, S.context.notes.fetchFailed));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchNotesFromApi();
  }, [fetchNotesFromApi]);

  const addNote = async (formData, author = S.context.defaultAuthor) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      try {
        const saved = await api.post("/notes", {
          NoteCategory: formData.type,
          NoteText: formData.text,
          childId: formData.childId,
        });
        const normalized = normalizeNote(saved);
        setNotes((prev) => [normalized, ...prev]);
        showSuccess(S.context.notes.addSuccess);
        return normalized;
      } catch (err) {
        console.error("API Add Note Error:", err);
        const msg = getErrorMessage(err, S.context.notes.addFailed);
        showError(msg);
        return { error: msg };
      }
    }

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

  const updateNote = async (id, formData) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      try {
        const saved = await api.put(`/notes/${id}`, {
          NoteCategory: formData.type,
          NoteText: formData.text,
        });
        const normalized = normalizeNote(saved);
        setNotes((prev) => prev.map((note) => (note.id === id ? normalized : note)));
        showSuccess(S.context.notes.updateSuccess);
        return normalized;
      } catch (err) {
        console.error("API Update Note Error:", err);
        const msg = getErrorMessage(err, S.context.notes.updateFailed);
        showError(msg);
        return { error: msg };
      }
    }

    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...formData } : note))
    );

    return { success: true };
  };

  const deleteNote = async (id) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      try {
        await api.delete(`/notes/${id}`);
        setNotes((prev) => prev.filter((note) => note.id !== id));
        showSuccess(S.context.notes.deleteSuccess);
        return { success: true };
      } catch (err) {
        console.error("API Delete Note Error:", err);
        const msg = getErrorMessage(err, S.context.notes.deleteFailed);
        showError(msg);
        return { error: msg };
      }
    }

    setNotes((prev) => prev.filter((note) => note.id !== id));
    return { success: true };
  };

  const getChildNotes = () => [];

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
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
    throw new Error("useNotes must be used within a NotesProvider");
  }

  return context;
}