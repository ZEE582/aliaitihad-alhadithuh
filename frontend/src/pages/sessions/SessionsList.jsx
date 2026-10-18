import { useState } from "react";
import { Plus, Pencil, Trash2, CalendarClock, Clock, MapPin, User } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import SessionForm from "./SessionForm";
import ConfirmModal from "../../components/ConfirmModal";
import { useSessions } from "../../context/SessionsContext";
import { useUser } from "../../context/UserContext";
import { strings as S } from "../../constants/strings";

export default function SessionsList({ onNavigate, onLogout }) {
  const { sessionsList, addSession, updateSession, deleteSession } = useSessions();
  const { user } = useUser();
  const canWrite = user?.roleType === "admin";

  const [formOpen, setFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeDay, setActiveDay] = useState("all");

  const days = [...new Set(sessionsList.map((s) => s.day).filter(Boolean))];

  const filtered =
    activeDay === "all"
      ? sessionsList
      : sessionsList.filter((s) => s.day === activeDay);

  const handleAddClick = () => {
    setEditingSession(null);
    setFormOpen(true);
  };

  const handleEditClick = (session) => {
    setEditingSession(session);
    setFormOpen(true);
  };

  const handleSave = async (formData) => {
    const result = editingSession
      ? await updateSession(editingSession.id, formData)
      : await addSession(formData);

    if (result && !result.error) {
      setFormOpen(false);
      setEditingSession(null);
    }
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteSession(deleteTarget);
    }
    setDeleteTarget(null);
  };

  const subtitle =
    user?.roleType === "teacher"
      ? S.sessions.header.teacherSubtitle
      : S.sessions.header.adminSubtitle;

  return (
    <DashboardLayout
      activePage="sessions"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.sessions.pageTitle}
    >
      <div dir="rtl">
        <div
          className="rounded-3xl p-6 mb-5 relative overflow-hidden"
          style={{ backgroundColor: "#F4F8F7", border: "1px solid #E2ECE8" }}
        >
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#EAF2EF" }}
              >
                <CalendarClock size={25} style={{ color: "#4C8577" }} />
              </div>

              <div>
                <h2 className="text-lg font-bold" style={{ color: "#2F3A36" }}>
                  {S.sessions.header.title}
                </h2>

                <p className="text-xs mt-1" style={{ color: "#7A8580" }}>
                  {subtitle}
                </p>
              </div>
            </div>

            {canWrite && (
              <button
                type="button"
                onClick={handleAddClick}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0 hover:opacity-90"
                style={{
                  backgroundColor: "#4C8577",
                  boxShadow: "0 6px 16px rgba(76,133,119,0.14)",
                }}
              >
                <Plus size={18} />
                {S.sessions.header.addButton}
              </button>
            )}
          </div>
        </div>

        {days.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <button
              type="button"
              onClick={() => setActiveDay("all")}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold"
              style={{
                backgroundColor: activeDay === "all" ? "#4C8577" : "#FFFFFF",
                color: activeDay === "all" ? "#FFFFFF" : "#4A5551",
                border: "1px solid #E2DCCC",
              }}
            >
              {S.sessions.pageTitle}
            </button>

            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setActiveDay(day)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: activeDay === day ? "#4C8577" : "#FFFFFF",
                  color: activeDay === day ? "#FFFFFF" : "#4A5551",
                  border: "1px solid #E2DCCC",
                }}
              >
                {day}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EDE7D9",
                boxShadow: "0 6px 20px rgba(47,58,54,0.04)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#EAF2EF" }}>
                  <CalendarClock size={20} style={{ color: "#4C8577" }} />
                </div>

                {canWrite && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditClick(s)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F4F8F7]"
                      style={{ color: "#4C8577" }}
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(s.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#FCF0EE]"
                      style={{ color: "#C25B4A" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-sm font-bold mt-4" style={{ color: "#2F3A36" }}>
                {s.subjectName}
              </h3>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs" style={{ color: "#4A5551" }}>
                  <CalendarClock size={13} style={{ color: "#A8B0AB" }} />
                  <span>{`${s.day} · ${s.date}`}</span>
                </div>

                {s.period && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: "#4A5551" }}>
                    <Clock size={13} style={{ color: "#A8B0AB" }} />
                    <span>
                      {s.period}
                      {s.duration ? ` · ${s.duration}` : ""}
                    </span>
                  </div>
                )}

                {s.sectionName && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: "#4A5551" }}>
                    <MapPin size={13} style={{ color: "#A8B0AB" }} />
                    <span>
                      {s.className
                        ? `${s.sectionName} — ${s.className}`
                        : s.sectionName}
                    </span>
                  </div>
                )}

                {s.teacherName && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: "#4A5551" }}>
                    <User size={13} style={{ color: "#A8B0AB" }} />
                    <span>{s.teacherName}</span>
                  </div>
                )}
              </div>

              {s.notes && (
                <p
                  className="text-xs mt-3 rounded-xl p-3"
                  style={{ backgroundColor: "#FCFAF4", color: "#7A8580" }}
                >
                  {s.notes}
                </p>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div
              className="col-span-full rounded-2xl py-12 flex flex-col items-center justify-center"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ backgroundColor: "#F4F8F7" }}
              >
                <CalendarClock size={20} style={{ color: "#A8B0AB" }} />
              </div>

              <p className="text-sm font-medium" style={{ color: "#7A8580" }}>
                {S.sessions.dayHeader.noSessions}
              </p>
            </div>
          )}
        </div>

        {canWrite && formOpen && (
          <SessionForm
            initialData={editingSession}
            onClose={() => {
              setFormOpen(false);
              setEditingSession(null);
            }}
            onSave={handleSave}
          />
        )}
      </div>

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
