import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Clock,
  BookOpen,
  Calculator,
  Palette,
  Activity,
  Eye,
  LockKeyhole,
  CheckCircle2,
  Circle,
  StickyNote,
  X,
  UserRound,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import SessionForm from "./SessionForm";
import NoteForm from "../notes/NoteForm";
import ConfirmModal from "../../components/ConfirmModal";

import { useUser } from "../../context/UserContext";
import { useChildren } from "../../context/ChildrenContext";
import { useNotes } from "../../context/NotesContext";
import { useToast } from "../../context/ToastContext";

import { strings as S } from "../../constants/strings";

const days = [
  "ط§ظ„ط£ط­ط¯",
  "ط§ظ„ط§ط«ظ†ظٹظ†",
  "ط§ظ„ط«ظ„ط§ط«ط§ط،",
  "ط§ظ„ط£ط±ط¨ط¹ط§ط،",
  "ط§ظ„ط®ظ…ظٹط³",
];

const initialSessions = [
  {
    id: 1,
    day: "ط§ظ„ط£ط­ط¯",
    time: "9:00 - 9:45",
    subject: "ط§ظ„ظ„ط؛ط© ط§ظ„ط¹ط±ط¨ظٹط©",
    classroom: "طµظپ ط§ظ„ظپط±ط§ط´ط§طھ",
    teacher: "ط£. ط³ط§ط±ط© ط§ظ„ط­ط§ط¬",
    completed: false,
    note: "",
  },
  {
    id: 2,
    day: "ط§ظ„ط£ط­ط¯",
    time: "10:00 - 10:45",
    subject: "ط§ظ„ط±ظٹط§ط¶ظٹط§طھ",
    classroom: "طµظپ ط§ظ„ظپط±ط§ط´ط§طھ",
    teacher: "ط£. ط±ظٹظ… ط¹ظˆط¯ط©",
    completed: false,
    note: "",
  },
  {
    id: 3,
    day: "ط§ظ„ط§ط«ظ†ظٹظ†",
    time: "9:00 - 9:45",
    subject: "ط§ظ„طھط±ط¨ظٹط© ط§ظ„ظپظ†ظٹط©",
    classroom: "طµظپ ط§ظ„ظ†ط¬ظˆظ…",
    teacher: "ط£. ظ†ظˆط± ط³ظ„ط§ظ…ط©",
    completed: false,
    note: "",
  },
  {
    id: 4,
    day: "ط§ظ„ط«ظ„ط§ط«ط§ط،",
    time: "9:00 - 9:45",
    subject: "ط§ظ„ظ†ط´ط§ط· ط§ظ„ط­ط±ظƒظٹ",
    classroom: "طµظپ ط§ظ„ظ‚ظ…ط±",
    teacher: "ط£. ظ„ظٹظ†ط§ ط®ظ„ظٹظ„",
    completed: false,
    note: "",
  },
];

function SubjectIcon({ subject }) {
  if (subject?.includes("ط¹ط±ط¨ظٹط©")) {
    return <BookOpen size={20} />;
  }

  if (subject?.includes("ط±ظٹط§ط¶ظٹط§طھ")) {
    return <Calculator size={20} />;
  }

  if (subject?.includes("ظپظ†ظٹط©")) {
    return <Palette size={20} />;
  }

  if (subject?.includes("ط­ط±ظƒظٹ")) {
    return <Activity size={20} />;
  }

  return <Clock size={20} />;
}

export default function SessionsList({
  onNavigate,
  onLogout,
}) {
  const { user } = useUser();
  const { childrenList } = useChildren();
  const { addNote } = useNotes();
  const { showWarning, showError } = useToast();

  const [sessions, setSessions] =
    useState(initialSessions);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [activeDay, setActiveDay] =
    useState("ط§ظ„ط£ط­ط¯");

  // Session Form
  const [formOpen, setFormOpen] =
    useState(false);

  const [editingSession, setEditingSession] =
    useState(null);

  // ط§ط®طھظٹط§ط± ظ†ظˆط¹ ط§ظ„ظ…ظ„ط§ط­ط¸ط©
  const [noteChoiceSession, setNoteChoiceSession] =
    useState(null);

  // ظ…ظ„ط§ط­ط¸ط© ط§ظ„ط­طµط©
  const [lessonNoteSession, setLessonNoteSession] =
    useState(null);

  const [lessonNoteText, setLessonNoteText] =
    useState("");

  // ظ…ظ„ط§ط­ط¸ط© ط§ظ„ط·ظپظ„
  const [childNoteSession, setChildNoteSession] =
    useState(null);

  const [selectedChildId, setSelectedChildId] =
    useState("");

  const [childNoteFormOpen, setChildNoteFormOpen] =
    useState(false);

  // ==========================================
  // ط§ظ„طµظ„ط§ط­ظٹط§طھ
  // ==========================================

  const roleType =
    user?.roleType?.toLowerCase();

  const canManageSessions =
    roleType === "admin" ||
    roleType === "secretary";

  const isTeacher =
    roleType === "teacher";

  /*
    ط§ظ„ظ…ط¹ظ„ظ…ط© ظ…ط³ظ…ظˆط­ ظ„ظ‡ط§ طھطھط¹ط§ظ…ظ„ ظپظ‚ط· ظ…ط¹ ط§ظ„ط­طµطµ
    ط§ظ„طھظٹ ظ‡ظٹ ط§ظ„ظ…ط¹ظ„ظ…ط© ط§ظ„ظ…ط³ط¤ظˆظ„ط© ط¹ظ†ظ‡ط§.

    ظ†ط¹طھظ…ط¯ ط¹ظ„ظ‰ ط§ط³ظ… ط§ظ„ظ…ط¹ظ„ظ…ط© ط§ظ„ظ…ظˆط¬ظˆط¯ ظپظٹ ط§ظ„ط­طµط©
    ظˆظ†ظ‚ط§ط±ظ†ظ‡ ط¨ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ط­ط§ظ„ظٹ.
  */
  const isMySession = (session) => {
    if (!isTeacher) return false;

    return (
      session.teacher === user?.name
    );
  };

  // ==========================================
  // ط£ط·ظپط§ظ„ طµظپ ط§ظ„ظ…ط¹ظ„ظ…ط© ظپظ‚ط·
  // ==========================================

  const teacherChildren =
    isTeacher
      ? childrenList.filter(
          (child) =>
            child.classroom ===
            user?.classroom
        )
      : [];

  // ==========================================
  // ط§ظ„ط­طµطµ ط­ط³ط¨ ط§ظ„ظٹظˆظ…
  // ==========================================

  const filtered = sessions.filter(
    (session) =>
      session.day === activeDay
  );

  // ==========================================
  // ط¥ط¯ط§ط±ط© ط§ظ„ط­طµطµ
  // ==========================================

  const handleAddClick = () => {
    if (!canManageSessions) return;

    setEditingSession(null);
    setFormOpen(true);
  };

  const handleEditClick = (session) => {
    if (!canManageSessions) return;

    setEditingSession(session);
    setFormOpen(true);
  };

  const handleSave = (formData) => {
    if (!canManageSessions) return;

    if (editingSession) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === editingSession.id
            ? {
                ...session,
                ...formData,
              }
            : session
        )
      );
    } else {
      setSessions((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...formData,
          completed: false,
          note: "",
        },
      ]);
    }

    setFormOpen(false);
    setEditingSession(null);
  };

  const handleDelete = (id) => {
    if (!canManageSessions) return;

    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setSessions((prev) =>
        prev.filter(
          (session) => session.id !== deleteTarget
        )
      );
    }

    setDeleteTarget(null);
  };

  // ==========================================
  // ط§ظ„ظ…ط¹ظ„ظ…ط© طھط¤ظƒط¯ طھظ†ظپظٹط° ط­طµطھظ‡ط§ ظپظ‚ط·
  // ==========================================

  const handleToggleCompleted = (session) => {
    if (!isTeacher) return;

    // ط­ظ…ط§ظٹط© ط¥ط¶ط§ظپظٹط©:
    // ظ„ط§ طھط³ظ…ط­ظٹ ظ„ظ„ظ…ط¹ظ„ظ…ط© ط¨طھط¹ط¯ظٹظ„ ط­طµط© ط؛ظٹط±ظ‡ط§
    if (!isMySession(session)) return;

    setSessions((prev) =>
      prev.map((item) =>
        item.id === session.id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item
      )
    );
  };

  // ==========================================
  // ظپطھط­ ط§ط®طھظٹط§ط± ظ†ظˆط¹ ط§ظ„ظ…ظ„ط§ط­ط¸ط©
  // ==========================================

  const handleOpenNoteOptions = (session) => {
    if (!isTeacher) return;

    // ط§ظ„ظ…ط¹ظ„ظ…ط© ظ„ط§ طھط³طھط·ظٹط¹ ط¥ط¶ط§ظپط© ظ…ظ„ط§ط­ط¸ط©
    // ط¹ظ„ظ‰ ط­طµط© ظ„ظٹط³طھ ظ„ظ‡ط§
    if (!isMySession(session)) return;

    setNoteChoiceSession(session);
  };

  // ==========================================
  // ط¥ط؛ظ„ط§ظ‚ ط§ط®طھظٹط§ط± ظ†ظˆط¹ ط§ظ„ظ…ظ„ط§ط­ط¸ط©
  // ==========================================

  const handleCloseNoteOptions = () => {
    setNoteChoiceSession(null);
  };

  // ==========================================
  // ط§ط®طھظٹط§ط± "ظ…ظ„ط§ط­ط¸ط© ط¹ظ† ط§ظ„ط­طµط©"
  // ==========================================

  const handleChooseLessonNote = () => {
    if (!noteChoiceSession) return;

    if (!isMySession(noteChoiceSession)) {
      setNoteChoiceSession(null);
      return;
    }

    const session =
      noteChoiceSession;

    setNoteChoiceSession(null);

    setLessonNoteSession(session);
    setLessonNoteText(
      session.note || ""
    );
  };

  // ==========================================
  // ط¥ط؛ظ„ط§ظ‚ ظ…ظ„ط§ط­ط¸ط© ط§ظ„ط­طµط©
  // ==========================================

  const handleCloseLessonNote = () => {
    setLessonNoteSession(null);
    setLessonNoteText("");
  };

  // ==========================================
  // ط­ظپط¸ ظ…ظ„ط§ط­ط¸ط© ط§ظ„ط­طµط©
  // ==========================================

  const handleSaveLessonNote = () => {
    if (!lessonNoteSession) return;

    // ط­ظ…ط§ظٹط©:
    // ظ„ط§ ظٹظ…ظƒظ† ط­ظپط¸ ظ…ظ„ط§ط­ط¸ط© ظ„ط­طµط© ظ„ظٹط³طھ ظ„ظ„ظ…ط¹ظ„ظ…ط©
    if (!isMySession(lessonNoteSession)) {
      handleCloseLessonNote();
      return;
    }

    setSessions((prev) =>
      prev.map((session) =>
        session.id ===
        lessonNoteSession.id
          ? {
              ...session,
              note: lessonNoteText.trim(),
            }
          : session
      )
    );

    handleCloseLessonNote();
  };

  // ==========================================
  // ط§ط®طھظٹط§ط± "ظ…ظ„ط§ط­ط¸ط© ط¹ظ† ط·ظپظ„"
  // ==========================================

  const handleChooseChildNote = () => {
    if (!noteChoiceSession) return;

    if (!isMySession(noteChoiceSession)) {
      setNoteChoiceSession(null);
      return;
    }

    setChildNoteSession(
      noteChoiceSession
    );

    setSelectedChildId("");

    setNoteChoiceSession(null);
  };

  // ==========================================
  // ط¥ط؛ظ„ط§ظ‚ ط§ط®طھظٹط§ط± ط§ظ„ط·ظپظ„
  // ==========================================

  const handleCloseChildSelector = () => {
    setChildNoteSession(null);
    setSelectedChildId("");
  };

  // ==========================================
  // ظپطھط­ NoteForm ط¨ط¹ط¯ ط§ط®طھظٹط§ط± ط§ظ„ط·ظپظ„
  // ==========================================

  const handleContinueToChildNote = () => {
    if (!childNoteSession) return;

    if (!isMySession(childNoteSession)) {
      handleCloseChildSelector();
      return;
    }

    if (!selectedChildId) {
      showWarning(
        S.sessions.toast.selectChildFirst
      );
      return;
    }

    const selectedChild =
      teacherChildren.find(
        (child) =>
          String(child.id) ===
          String(selectedChildId)
      );

    if (!selectedChild) {
      showError(
        S.sessions.toast.childNotInClass
      );
      return;
    }

    setChildNoteFormOpen(true);
  };

  // ==========================================
  // ط­ظپط¸ ظ…ظ„ط§ط­ط¸ط© ط§ظ„ط·ظپظ„
  // ==========================================

  const handleSaveChildNote = (formData) => {
    if (!childNoteSession) return;

    if (!isMySession(childNoteSession)) {
      setChildNoteFormOpen(false);
      setChildNoteSession(null);
      return;
    }

    /*
      ظ†طھط­ظ‚ظ‚ ظ…ط±ط© ط«ط§ظ†ظٹط© ظ…ظ† ط§ظ„ط·ظپظ„ ظ‚ط¨ظ„ ط§ظ„ط­ظپط¸.
      ط­طھظ‰ ظ„ظˆ ط­ط§ظˆظ„ ط£ط­ط¯ طھط؛ظٹظٹط± ط§ظ„ظ‚ظٹظ…ط© ظ…ظ† ط§ظ„ظپظˆط±ظ…طŒ
      ظ„ظ† طھظڈط­ظپط¸ ظ…ظ„ط§ط­ط¸ط© ظ„ط·ظپظ„ ط®ط§ط±ط¬ طµظپ ط§ظ„ظ…ط¹ظ„ظ…ط©.
    */

    const allowedChild =
      teacherChildren.find(
        (child) =>
          child.name ===
          formData.childName
      );

    if (!allowedChild) {
      showError(
        S.sessions.toast.noteOnlyForOwnClass
      );
      return;
    }

    addNote(
      {
        ...formData,

        // ظ…ط¹ظ„ظˆظ…ط§طھ ط¥ط¶ط§ظپظٹط© طھط±ط¨ط· ط§ظ„ظ…ظ„ط§ط­ط¸ط©
        // ط¨ط§ظ„ظ…ط¹ظ„ظ…ط© ظˆط§ظ„ط­طµط© ط§ظ„طھظٹ ط¬ط§ط،طھ ظ…ظ†ظ‡ط§
        sessionId:
          childNoteSession.id,

        sessionSubject:
          childNoteSession.subject,

        sessionClassroom:
          childNoteSession.classroom,
      },
      user?.name ||
        S.sessions.lessonNoteModal.fallbackUserName
    );

    setChildNoteFormOpen(false);
    setChildNoteSession(null);
    setSelectedChildId("");
  };

  return (
    <DashboardLayout
      activePage="sessions"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.sessions.pageTitle}
    >
      {/* ========================================== */}
      {/* Header */}
      {/* ========================================== */}

      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: isTeacher
                    ? "#EAF2EF"
                    : "#FCF3DE",
                  color: isTeacher
                    ? "#4C8577"
                    : "#B8862F",
                }}
              >
                {isTeacher
                  ? S.sessions.header.roleBadgeTeacher
                  : S.sessions.header.roleBadgeManager}
              </span>
            </div>

            <h2
              className="text-xl font-bold"
              style={{
                color: "#2F3A36",
              }}
            >
              {S.sessions.header.title}
            </h2>

            <p
              className="text-sm mt-1"
              style={{
                color: "#7A8580",
              }}
            >
              {isTeacher
                ? S.sessions.header.teacherSubtitle
                : S.sessions.header.adminSubtitle}
            </p>
          </div>

          {canManageSessions && (
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{
                backgroundColor: "#4C8577",
              }}
            >
              <Plus size={18} />
              {S.sessions.header.addButton}
            </button>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* Teacher Information */}
      {/* ========================================== */}

      {isTeacher && (
        <div
          className="rounded-2xl p-4 mb-5 flex items-start gap-3"
          style={{
            backgroundColor: "#F4F8F7",
            border: "1px solid #E2ECE8",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "#EAF2EF",
              color: "#4C8577",
            }}
          >
            <Eye size={18} />
          </div>

          <div>
            <p
              className="text-sm font-bold"
              style={{
                color: "#2F3A36",
              }}
            >
              {S.sessions.teacherInfoCard.title}
            </p>

            <p
              className="text-xs mt-1 leading-5"
              style={{
                color: "#7A8580",
              }}
            >
              {S.sessions.teacherInfoCard.description}
            </p>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* Days */}
      {/* ========================================== */}

      <div
        className="rounded-2xl p-3 mb-5 overflow-x-auto"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EDE7D9",
        }}
      >
        <div className="flex gap-2 min-w-max">
          {days.map((day) => {
            const count =
              sessions.filter(
                (session) =>
                  session.day === day
              ).length;

            const isActive =
              activeDay === day;

            return (
              <button
                key={day}
                onClick={() =>
                  setActiveDay(day)
                }
                className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor:
                    isActive
                      ? "#4C8577"
                      : "#FCFAF4",
                  color: isActive
                    ? "#FBF7EF"
                    : "#4A5551",
                  border: isActive
                    ? "1px solid #4C8577"
                    : "1px solid #EDE7D9",
                }}
              >
                <span>{day}</span>

                <span
                  className="mr-2 text-[10px] rounded-full px-1.5 py-0.5"
                  style={{
                    backgroundColor:
                      isActive
                        ? "#FFFFFF25"
                        : "#EDE7D9",
                    color: isActive
                      ? "#FFFFFF"
                      : "#7A8580",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* Current Day */}
      {/* ========================================== */}

      <div className="flex items-center justify-between mb-3">
        <div>
          <h3
            className="text-base font-bold"
            style={{
              color: "#2F3A36",
            }}
          >
            {S.sessions.dayHeader.daySessionsTitle(activeDay)}
          </h3>

          <p
            className="text-xs mt-1"
            style={{
              color: "#A8B0AB",
            }}
          >
            {filtered.length === 0
              ? S.sessions.dayHeader.noSessions
              : S.sessions.dayHeader.sessionsCount(filtered.length)}
          </p>
        </div>

        {isTeacher && (
          <div
            className="hidden sm:flex items-center gap-1.5 text-xs"
            style={{
              color: "#A8B0AB",
            }}
          >
            <LockKeyhole size={13} />
            <span>
              {S.sessions.dayHeader.teacherOnlyHint}
            </span>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* Sessions */}
      {/* ========================================== */}

      <div className="space-y-3">
        {filtered.map((session) => {
          const mySession =
            isMySession(session);

          return (
            <div
              key={session.id}
              className="rounded-2xl p-4 md:p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: "#FFFFFF",
                border:
                  session.completed &&
                  mySession
                    ? "1px solid #CFE1DA"
                    : "1px solid #EDE7D9",
              }}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor:
                      "#EAF2EF",
                    color: "#4C8577",
                  }}
                >
                  {session.completed &&
                  mySession ? (
                    <CheckCircle2
                      size={21}
                    />
                  ) : (
                    <SubjectIcon
                      subject={
                        session.subject
                      }
                    />
                  )}
                </div>

                {/* Info */}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className="text-sm font-bold truncate"
                          style={{
                            color:
                              "#2F3A36",
                          }}
                        >
                          {session.subject}
                        </p>

                        {isTeacher &&
                          mySession &&
                          session.completed && (
                            <span
                              className="text-[10px] font-semibold px-2 py-1 rounded-full"
                              style={{
                                backgroundColor:
                                  "#EAF2EF",
                                color:
                                  "#4C8577",
                              }}
                            >
                              {S.sessions.sessionCard.completedBadge}
                            </span>
                          )}
                      </div>

                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                        <span
                          className="text-xs"
                          style={{
                            color:
                              "#7A8580",
                          }}
                        >
                          {S.sessions.sessionCard.classroomPrefix(
                            session.classroom
                          )}
                        </span>

                        <span
                          className="text-xs"
                          style={{
                            color:
                              "#7A8580",
                          }}
                        >
                          {S.sessions.sessionCard.teacherPrefix(
                            session.teacher
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Time */}

                    <div
                      className="shrink-0 rounded-xl px-3 py-2 text-center"
                      style={{
                        backgroundColor:
                          "#FCFAF4",
                        border:
                          "1px solid #F3EFE3",
                      }}
                    >
                      <Clock
                        size={13}
                        className="mx-auto mb-1"
                        style={{
                          color:
                            "#4C8577",
                        }}
                      />

                      <span
                        className="text-xs font-bold whitespace-nowrap"
                        style={{
                          color:
                            "#4A5551",
                        }}
                      >
                        {session.time}
                      </span>
                    </div>
                  </div>

                  {/* ========================================== */}
                  {/* Teacher Actions */}
                  {/* ظپظ‚ط· ظ„ظ„ط­طµط© ط§ظ„طھظٹ طھط¯ط±ط³ظ‡ط§ ط§ظ„ظ…ط¹ظ„ظ…ط© */}
                  {/* ========================================== */}

                  {isTeacher &&
                    mySession && (
                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        {/* طھظ… طھظ†ظپظٹط° ط§ظ„ط­طµط© */}

                        <button
                          onClick={() =>
                            handleToggleCompleted(
                              session
                            )
                          }
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5"
                          style={{
                            backgroundColor:
                              session.completed
                                ? "#EAF2EF"
                                : "#4C8577",
                            color:
                              session.completed
                                ? "#4C8577"
                                : "#FFFFFF",
                            border:
                              session.completed
                                ? "1px solid #CFE1DA"
                                : "1px solid #4C8577",
                          }}
                        >
                          {session.completed ? (
                            <>
                              <CheckCircle2
                                size={14}
                              />
                              {S.sessions.sessionCard.markCompletedButton}
                            </>
                          ) : (
                            <>
                              <Circle
                                size={14}
                              />
                              {S.sessions.sessionCard.markCompletedButton}
                            </>
                          )}
                        </button>

                        {/* ط§ظ„ظ…ظ„ط§ط­ط¸ط§طھ */}

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenNoteOptions(
                              session
                            )
                          }
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all hover:opacity-70"
                          style={{
                            color:
                              "#B8862F",
                            backgroundColor:
                              "#FCF3DE",
                          }}
                        >
                          <StickyNote
                            size={14}
                          />

                          {session.note
                            ? S.sessions.sessionCard.noteButtonEdit
                            : S.sessions.sessionCard.noteButtonAdd}
                        </button>
                      </div>
                    )}

                  {/* ========================================== */}
                  {/* Existing Lesson Note */}
                  {/* ظپظ‚ط· ظ…ظ„ط§ط­ط¸ط© ط§ظ„ط­طµط© */}
                  {/* ========================================== */}

                  {isTeacher &&
                    mySession &&
                    session.note && (
                      <div
                        className="mt-3 rounded-xl p-3"
                        style={{
                          backgroundColor:
                            "#FCFAF4",
                          border:
                            "1px solid #F3EFE3",
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <StickyNote
                            size={14}
                            className="shrink-0 mt-0.5"
                            style={{
                              color:
                                "#B8862F",
                            }}
                          />

                          <div>
                            <p
                              className="text-[11px] font-semibold mb-1"
                              style={{
                                color:
                                  "#B8862F",
                              }}
                            >
                              {S.sessions.sessionCard.lessonNoteHeading}
                            </p>

                            <p
                              className="text-xs leading-5"
                              style={{
                                color:
                                  "#68736F",
                              }}
                            >
                              {session.note}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* ========================================== */}
                  {/* Admin Actions */}
                  {/* ========================================== */}

                  {canManageSessions && (
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() =>
                          handleEditClick(
                            session
                          )
                        }
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:opacity-70"
                        style={{
                          color:
                            "#4C8577",
                        }}
                      >
                        <Pencil
                          size={14}
                        />
                        {S.sessions.sessionCard.editButton}
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            session.id
                          )
                        }
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:opacity-70"
                        style={{
                          color:
                            "#C25B4A",
                        }}
                      >
                        <Trash2
                          size={14}
                        />
                        {S.sessions.sessionCard.deleteButton}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty */}

        {filtered.length === 0 && (
          <div
            className="rounded-2xl py-14 text-center"
            style={{
              backgroundColor:
                "#FFFFFF",
              border:
                "1px solid #EDE7D9",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
              style={{
                backgroundColor:
                  "#FCFAF4",
              }}
            >
              <Clock
                size={24}
                style={{
                  color:
                    "#A8B0AB",
                }}
              />
            </div>

            <p
              className="text-sm font-semibold mt-4"
              style={{
                color:
                  "#4A5551",
              }}
            >
              {S.sessions.dayHeader.emptyStateTitle}
            </p>

            <p
              className="text-xs mt-1"
              style={{
                color:
                  "#A8B0AB",
              }}
            >
              {S.sessions.dayHeader.emptyStateSubtitle}
            </p>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* Session Form */}
      {/* ========================================== */}

      {formOpen &&
        canManageSessions && (
          <SessionForm
            initialData={
              editingSession
            }
            onClose={() => {
              setFormOpen(false);
              setEditingSession(null);
            }}
            onSave={handleSave}
          />
        )}

      {/* ========================================== */}
      {/* Note Type Choice Modal */}
      {/* ظ…ظ„ط§ط­ط¸ط© ط¹ظ† ط§ظ„ط­طµط© / ظ…ظ„ط§ط­ط¸ط© ط¹ظ† ط·ظپظ„ */}
      {/* ========================================== */}

      {noteChoiceSession &&
        isTeacher &&
        isMySession(
          noteChoiceSession
        ) && (
          <div
            dir="rtl"
            className="modal-root"
            style={{
              backgroundColor:
                "#00000040",
            }}
          >
            <div
              className="w-full max-w-md rounded-3xl overflow-hidden"
              style={{
                backgroundColor:
                  "#FFFFFF",
                boxShadow:
                  "0 20px 60px rgba(47,58,54,0.15)",
              }}
            >
              {/* Header */}

              <div
                className="p-5"
                style={{
                  backgroundColor:
                    "#FCFAF4",
                  borderBottom:
                    "1px solid #EDE7D9",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3
                      className="text-base font-bold break-words"
                      style={{
                        color:
                          "#2F3A36",
                      }}
                    >
                      {S.sessions.noteTypeModal.title}
                    </h3>

                    <p
                      className="text-xs mt-1 break-words"
                      style={{
                        color:
                          "#7A8580",
                      }}
                    >
                      {S.sessions.noteTypeModal.subjectClassSubtitle(
                        noteChoiceSession.subject,
                        noteChoiceSession.classroom
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleCloseNoteOptions
                    }
                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-70"
                    style={{
                      color:
                        "#A8B0AB",
                      backgroundColor:
                        "#FFFFFF",
                    }}
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Options */}

              <div className="p-5 space-y-3">
                <button
                  type="button"
                  onClick={
                    handleChooseLessonNote
                  }
                  className="w-full text-right rounded-2xl p-4 transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor:
                      "#F4F8F7",
                    border:
                      "1px solid #E2ECE8",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor:
                          "#EAF2EF",
                        color:
                          "#4C8577",
                      }}
                    >
                      <StickyNote
                        size={20}
                      />
                    </div>

                    <div>
                      <p
                        className="text-sm font-bold"
                        style={{
                          color:
                            "#2F3A36",
                        }}
                      >
                        {S.sessions.noteTypeModal.lessonNoteOption}
                      </p>

                      <p
                        className="text-xs mt-1"
                        style={{
                          color:
                            "#7A8580",
                        }}
                      >
                        {S.sessions.noteTypeModal.lessonNoteDesc}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={
                    handleChooseChildNote
                  }
                  className="w-full text-right rounded-2xl p-4 transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor:
                      "#FCFAF4",
                    border:
                      "1px solid #EDE7D9",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor:
                          "#FCF3DE",
                        color:
                          "#B8862F",
                      }}
                    >
                      <UserRound
                        size={20}
                      />
                    </div>

                    <div>
                      <p
                        className="text-sm font-bold"
                        style={{
                          color:
                            "#2F3A36",
                        }}
                      >
                        {S.sessions.noteTypeModal.childNoteOption}
                      </p>

                      <p
                        className="text-xs mt-1"
                        style={{
                          color:
                            "#7A8580",
                        }}
                      >
                        {S.sessions.noteTypeModal.childNoteDesc}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ========================================== */}
      {/* Lesson Note Modal */}
      {/* ========================================== */}

      {lessonNoteSession &&
        isTeacher &&
        isMySession(
          lessonNoteSession
        ) && (
          <div
            dir="rtl"
            className="modal-root"
            style={{
              backgroundColor:
                "#00000040",
            }}
          >
            <div
              className="w-full max-w-md rounded-3xl overflow-hidden"
              style={{
                backgroundColor:
                  "#FFFFFF",
                boxShadow:
                  "0 20px 60px rgba(47,58,54,0.15)",
              }}
            >
              {/* Header */}

              <div
                className="p-5"
                style={{
                  backgroundColor:
                    "#FCFAF4",
                  borderBottom:
                    "1px solid #EDE7D9",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor:
                          "#FCF3DE",
                        color:
                          "#B8862F",
                      }}
                    >
                      <StickyNote
                        size={20}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="text-base font-bold break-words"
                        style={{
                          color:
                            "#2F3A36",
                        }}
                      >
                        {S.sessions.lessonNoteModal.title}
                      </h3>

                      <p
                        className="text-xs mt-1 break-words"
                        style={{
                          color:
                            "#7A8580",
                        }}
                      >
                        {S.sessions.noteTypeModal.subjectClassSubtitle(
                          lessonNoteSession.subject,
                          lessonNoteSession.classroom
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleCloseLessonNote
                    }
                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-70"
                    style={{
                      color:
                        "#A8B0AB",
                      backgroundColor:
                        "#FFFFFF",
                    }}
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Body */}

              <div className="p-5">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color:
                      "#2F3A36",
                  }}
                >
                  {S.sessions.lessonNoteModal.label}
                </label>

                <textarea
                  autoFocus
                  value={
                    lessonNoteText
                  }
                  onChange={(e) =>
                    setLessonNoteText(
                      e.target.value
                    )
                  }
                  rows={5}
                  placeholder={S.sessions.lessonNoteModal.placeholder}
                  className="w-full rounded-2xl p-3 text-sm outline-none resize-none"
                  style={{
                    border:
                      "1px solid #E2DCCC",
                    backgroundColor:
                      "#FCFAF4",
                    color:
                      "#2F3A36",
                  }}
                />

                <p
                  className="text-[11px] mt-2"
                  style={{
                    color:
                      "#A8B0AB",
                  }}
                >
                  {S.sessions.lessonNoteModal.hint}
                </p>

                <div className="flex gap-3 pt-5">
                  <button
                    type="button"
                    onClick={
                      handleCloseLessonNote
                    }
                    className="flex-1 rounded-xl py-3 text-sm font-semibold hover:opacity-80"
                    style={{
                      border:
                        "1px solid #E2DCCC",
                      color:
                        "#4A5551",
                      backgroundColor:
                        "#FFFFFF",
                    }}
                  >
                    {S.sessions.lessonNoteModal.cancelButton}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSaveLessonNote
                    }
                    className="flex-1 rounded-xl py-3 text-sm font-semibold text-white hover:opacity-90"
                    style={{
                      backgroundColor:
                        "#4C8577",
                    }}
                  >
                    {S.sessions.lessonNoteModal.saveButton}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* ========================================== */}
      {/* Child Selector */}
      {/* ========================================== */}

      {childNoteSession &&
        isTeacher &&
        isMySession(
          childNoteSession
        ) &&
        !childNoteFormOpen && (
          <div
            dir="rtl"
            className="modal-root"
            style={{
              backgroundColor:
                "#00000040",
            }}
          >
            <div
              className="w-full max-w-md rounded-3xl overflow-hidden"
              style={{
                backgroundColor:
                  "#FFFFFF",
                boxShadow:
                  "0 20px 60px rgba(47,58,54,0.15)",
              }}
            >
              {/* Header */}

              <div
                className="p-5"
                style={{
                  backgroundColor:
                    "#FCFAF4",
                  borderBottom:
                    "1px solid #EDE7D9",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor:
                          "#FCF3DE",
                        color:
                          "#B8862F",
                      }}
                    >
                      <UserRound
                        size={20}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="text-base font-bold break-words"
                        style={{
                          color:
                            "#2F3A36",
                        }}
                      >
                        {S.sessions.childSelector.title}
                      </h3>

                      <p
                        className="text-xs mt-1 break-words"
                        style={{
                          color:
                            "#7A8580",
                        }}
                      >
                        {S.sessions.noteTypeModal.subjectClassSubtitle(
                          childNoteSession.subject,
                          childNoteSession.classroom
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleCloseChildSelector
                    }
                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-70"
                    style={{
                      color:
                        "#A8B0AB",
                      backgroundColor:
                        "#FFFFFF",
                    }}
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Body */}

              <div className="p-5">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color:
                      "#2F3A36",
                  }}
                >
                  {S.sessions.childSelector.label}
                </label>

                {teacherChildren.length ===
                0 ? (
                  <div
                    className="rounded-xl p-4 text-center"
                    style={{
                      backgroundColor:
                        "#FDF5F3",
                      color:
                        "#C25B4A",
                    }}
                  >
                    <p className="text-xs">
                      {S.sessions.childSelector.emptyMessage}
                    </p>
                  </div>
                ) : (
                  <select
                    value={
                      selectedChildId
                    }
                    onChange={(e) =>
                      setSelectedChildId(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                    style={{
                      border:
                        "1px solid #E2DCCC",
                      backgroundColor:
                        "#FCFAF4",
                      color:
                        "#2F3A36",
                    }}
                  >
                    <option value="">
                      {S.sessions.childSelector.placeholderOption}
                    </option>

                    {teacherChildren.map(
                      (child) => (
                        <option
                          key={child.id}
                          value={child.id}
                        >
                          {child.name}
                        </option>
                      )
                    )}
                  </select>
                )}

                <p
                  className="text-[11px] mt-2 leading-5"
                  style={{
                    color:
                      "#A8B0AB",
                  }}
                >
                  {S.sessions.childSelector.hint}
                </p>

                <div className="flex gap-3 pt-5">
                  <button
                    type="button"
                    onClick={
                      handleCloseChildSelector
                    }
                    className="flex-1 rounded-xl py-3 text-sm font-semibold hover:opacity-80"
                    style={{
                      border:
                        "1px solid #E2DCCC",
                      color:
                        "#4A5551",
                      backgroundColor:
                        "#FFFFFF",
                    }}
                  >
                    {S.sessions.childSelector.cancelButton}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleContinueToChildNote
                    }
                    disabled={
                      !selectedChildId ||
                      teacherChildren.length ===
                        0
                    }
                    className="flex-1 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50"
                    style={{
                      backgroundColor:
                        "#4C8577",
                    }}
                  >
                    {S.sessions.childSelector.continueButton}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* ========================================== */}
      {/* Child Note Form */}
      {/* NoteForm ط§ظ„ظ…ظˆط¬ظˆط¯ ط¹ظ†ط¯ظƒ */}
      {/* ========================================== */}

      {childNoteFormOpen &&
        childNoteSession &&
        isTeacher &&
        isMySession(
          childNoteSession
        ) && (
          <NoteForm
            initialData={{
              childName:
                teacherChildren.find(
                  (child) =>
                    String(child.id) ===
                    String(
                      selectedChildId
                    )
                )?.name || "",
            }}
            onClose={() => {
              setChildNoteFormOpen(
                false
              );
              setChildNoteSession(null);
              setSelectedChildId("");
            }}
            onSave={
              handleSaveChildNote
            }
          />
        )}

        <ConfirmModal
          isOpen={!!deleteTarget}
          title={S.sessions.deleteConfirm.title}
          message={S.sessions.deleteConfirm.message}
          confirmLabel={S.sessions.deleteConfirm.confirmLabel}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
    </DashboardLayout>
  );
}