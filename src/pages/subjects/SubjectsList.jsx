import { useState } from "react";
import { Search, Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import SubjectForm from "./SubjectForm";

const initialSubjects = [
  { id: 1, name: "اللغة العربية", teachersCount: 3, color: "#4C8577" },
  { id: 2, name: "الرياضيات", teachersCount: 2, color: "#6E8FB0" },
  { id: 3, name: "التربية الفنية", teachersCount: 1, color: "#E8B24D" },
  { id: 4, name: "النشاط الحركي", teachersCount: 2, color: "#C25B4A" },
];

export default function SubjectsList({ onNavigate, onLogout }) {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const filtered = subjects.filter((s) => s.name.includes(search));

  const handleAddClick = () => { setEditingSubject(null); setFormOpen(true); };
  const handleEditClick = (subject) => { setEditingSubject(subject); setFormOpen(true); };

  const handleSave = (formData) => {
    if (editingSubject) {
      setSubjects((prev) => prev.map((s) => (s.id === editingSubject.id ? { ...s, ...formData } : s)));
    } else {
      setSubjects((prev) => [...prev, { id: Date.now(), teachersCount: 0, color: "#4C8577", ...formData }]);
    }
    setFormOpen(false);
    setEditingSubject(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("متأكدة إنك بدك تحذفي هالمادة؟")) {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <DashboardLayout activePage="subjects" onNavigate={onNavigate} onLogout={onLogout} pageTitle="المواد">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: "#A8B0AB" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم المادة..."
            className="w-full rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none"
            style={{ border: "1px solid #E2DCCC", backgroundColor: "#FFFFFF", color: "#2F3A36" }}
          />
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0" style={{ backgroundColor: "#4C8577" }}>
          <Plus size={18} />
          إضافة مادة
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="rounded-2xl p-5 flex items-center gap-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}1A` }}>
              <BookOpen size={20} style={{ color: s.color }} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold" style={{ color: "#2F3A36" }}>{s.name}</h3>
              <p className="text-xs mt-0.5" style={{ color: "#A8B0AB" }}>{s.teachersCount} معلمين</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => handleEditClick(s)} style={{ color: "#4C8577" }}><Pencil size={15} /></button>
              <button onClick={() => handleDelete(s.id)} style={{ color: "#C25B4A" }}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm py-10 col-span-full" style={{ color: "#A8B0AB" }}>لا يوجد نتائج مطابقة للبحث</p>
        )}
      </div>

      {formOpen && (
        <SubjectForm
          initialData={editingSubject}
          onClose={() => { setFormOpen(false); setEditingSubject(null); }}
          onSave={handleSave}
        />
      )}
    </DashboardLayout>
  );
}