import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import NoteForm from "./NoteForm";
import { useChildren } from "../../context/ChildrenContext";
import { useUser } from "../../context/UserContext";

const initialNotes = [
  { id: 1, childName: "رهف يوسف", type: "إيجابي", text: "شارك ألعابه مع زملائه بشكل ممتاز خلال وقت اللعب الحر", author: "المعلمة نور", date: "14 تموز 2026" },
  { id: 2, childName: "يزن الأحمد", type: "ملاحظة", text: "بدا متعب قليلاً اليوم، يفضّل متابعة ساعات نومه", author: "المعلمة سارة", date: "13 تموز 2026" },
  { id: 3, childName: "سيلين خالد", type: "إيجابي", text: "أنهت نشاط الرسم بتركيز جيد وساعدت صديقتها بإكمال نشاطها", author: "المعلمة ريم", date: "12 تموز 2026" },
  { id: 4, childName: "زين محمود", type: "تنبيه", text: "احتاج وقت إضافي للتأقلم مع النشاط الجماعي اليوم", author: "المعلمة نور", date: "10 تموز 2026" },
];

const TYPE_COLORS = {
  "إيجابي": { bg: "#4C857720", text: "#4C8577" },
  "ملاحظة": { bg: "#E8B24D25", text: "#B8862F" },
  "تنبيه": { bg: "#C25B4A20", text: "#C25B4A" },
};

function TypeBadge({ type }) {
  const c = TYPE_COLORS[type] || TYPE_COLORS["ملاحظة"];
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0" style={{ backgroundColor: c.bg, color: c.text }}>
      {type}
    </span>
  );
}

export default function NotesList({ onNavigate, onLogout }) {
  const { childrenList } = useChildren();
  const { user } = useUser();
  const [notes, setNotes] = useState(initialNotes);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // نفس منطق فلترة الأطفال حسب الدور، مطبّق هون على أسماء الأطفال المسموح رؤية ملاحظاتهم
  const allowedNames =
    user.roleType === "teacher"
      ? childrenList.filter((c) => c.classroom === user.classroom).map((c) => c.name)
      : user.roleType === "parent"
      ? childrenList.filter((c) => user.childIds?.includes(c.id)).map((c) => c.name)
      : null; // null يعني admin، يشوف الكل بدون فلترة

  const roleFilteredNotes = allowedNames ? notes.filter((n) => allowedNames.includes(n.childName)) : notes;
  const filtered = roleFilteredNotes.filter((n) => n.childName.includes(search) || n.text.includes(search));

  // ولي الأمر يقرأ بس، ما إله صلاحية إضافة/تعديل/حذف ملاحظات
  const canManage = user.roleType === "admin" || user.roleType === "teacher";

  const handleAddClick = () => { setEditingNote(null); setFormOpen(true); };
  const handleEditClick = (note) => { setEditingNote(note); setFormOpen(true); };

  const handleSave = (formData) => {
    if (editingNote) {
      setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? { ...n, ...formData } : n)));
    } else {
      const today = new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" });
      setNotes((prev) => [{ id: Date.now(), author: user.name, date: today, ...formData }, ...prev]);
    }
    setFormOpen(false);
    setEditingNote(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("متأكدة إنك بدك تحذفي هالملاحظة؟")) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <DashboardLayout activePage="notes" onNavigate={onNavigate} onLogout={onLogout} pageTitle="الملاحظات">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: "#A8B0AB" }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم الطفل أو نص الملاحظة..."
            className="w-full rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none"
            style={{ border: "1px solid #E2DCCC", backgroundColor: "#FFFFFF", color: "#2F3A36" }} />
        </div>
        {canManage && (
          <button onClick={handleAddClick} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0" style={{ backgroundColor: "#4C8577" }}>
            <Plus size={18} />
            إضافة ملاحظة
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {filtered.map((note) => (
          <li key={note.id} className="rounded-2xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#2F3A36" }}>{note.childName}</p>
                <p className="text-sm mt-1" style={{ color: "#4A5551" }}>{note.text}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <TypeBadge type={note.type} />
                {canManage && (
                  <>
                    <button onClick={() => handleEditClick(note)} style={{ color: "#4C8577" }}><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(note.id)} style={{ color: "#C25B4A" }}><Trash2 size={14} /></button>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: "#A8B0AB" }}>{note.author} · {note.date}</p>
          </li>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm py-10" style={{ color: "#A8B0AB" }}>لا يوجد ملاحظات مطابقة</p>
        )}
      </ul>

      {formOpen && (
        <NoteForm
          initialData={editingNote}
          onClose={() => { setFormOpen(false); setEditingNote(null); }}
          onSave={handleSave}
        />
      )}
    </DashboardLayout>
  );
}