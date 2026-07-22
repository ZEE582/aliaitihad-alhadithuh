import { useState } from "react";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import SessionForm from "./SessionForm";

const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

const initialSessions = [
  { id: 1, day: "الأحد", time: "9:00 - 9:45", subject: "اللغة العربية", classroom: "صف الفراشات", teacher: "أ. سارة الحاج" },
  { id: 2, day: "الأحد", time: "10:00 - 10:45", subject: "الرياضيات", classroom: "صف الفراشات", teacher: "أ. ريم عودة" },
  { id: 3, day: "الاثنين", time: "9:00 - 9:45", subject: "التربية الفنية", classroom: "صف النجوم", teacher: "أ. نور سلامة" },
  { id: 4, day: "الثلاثاء", time: "9:00 - 9:45", subject: "النشاط الحركي", classroom: "صف القمر", teacher: "أ. لينا خليل" },
];

export default function SessionsList({ onNavigate }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [activeDay, setActiveDay] = useState("الأحد");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const filtered = sessions.filter((s) => s.day === activeDay);

  const handleAddClick = () => { setEditingSession(null); setFormOpen(true); };
  const handleEditClick = (session) => { setEditingSession(session); setFormOpen(true); };

  const handleSave = (formData) => {
    if (editingSession) {
      setSessions((prev) => prev.map((s) => (s.id === editingSession.id ? { ...s, ...formData } : s)));
    } else {
      setSessions((prev) => [...prev, { id: Date.now(), ...formData }]);
    }
    setFormOpen(false);
    setEditingSession(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("متأكدة إنك بدك تحذفي هالحصة؟")) {
      setSessions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <DashboardLayout activePage="sessions" onNavigate={onNavigate} pageTitle="الحصص">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {days.map((d) => (
            <button key={d} onClick={() => setActiveDay(d)}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                backgroundColor: activeDay === d ? "#4C8577" : "#FFFFFF",
                color: activeDay === d ? "#FBF7EF" : "#4A5551",
                border: "1px solid #EDE7D9",
              }}>
              {d}
            </button>
          ))}
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: "#4C8577" }}>
          <Plus size={18} />
          إضافة حصة
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <div key={s.id} className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#FCFAF4" }}>
                <Clock size={18} style={{ color: "#4C8577" }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#2F3A36" }}>{s.subject}</p>
                <p className="text-xs mt-0.5" style={{ color: "#7A8580" }}>{s.classroom} · {s.teacher}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium" style={{ color: "#4A5551" }}>{s.time}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handleEditClick(s)} style={{ color: "#4C8577" }}><Pencil size={15} /></button>
                <button onClick={() => handleDelete(s.id)} style={{ color: "#C25B4A" }}><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm py-10" style={{ color: "#A8B0AB" }}>لا يوجد حصص بهذا اليوم</p>
        )}
      </div>

      {formOpen && (
        <SessionForm
          initialData={editingSession}
          onClose={() => { setFormOpen(false); setEditingSession(null); }}
          onSave={handleSave}
        />
      )}
    </DashboardLayout>
  );
}