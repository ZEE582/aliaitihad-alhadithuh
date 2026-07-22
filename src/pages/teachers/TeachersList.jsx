import { useState } from "react";
import { Search, Plus, Pencil, Eye, Trash2, Phone } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import TeacherForm from "./TeacherForm";
import DetailsModal from "../../components/DetailsModal";
import { useTeachers } from "../../context/TeachersContext";

function StatusBadge({ status, onClick }) {
  const isActive = status === "نشط";
  return (
    <button
      onClick={onClick}
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ backgroundColor: isActive ? "#4C857720" : "#E8B24D25", color: isActive ? "#4C8577" : "#B8862F" }}
      title="اضغط لتبديل الحالة"
    >
      {status}
    </button>
  );
}

export default function TeachersList({ onNavigate, onLogout }) {
  const { teachersList, addTeacher, updateTeacher, deleteTeacher, toggleTeacherStatus } = useTeachers();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);

  const filtered = teachersList.filter((t) => t.name.includes(search) || t.subject.includes(search));

  const handleAddClick = () => { setEditingTeacher(null); setFormOpen(true); };
  const handleEditClick = (teacher) => { setEditingTeacher(teacher); setFormOpen(true); };

  const handleSave = (formData) => {
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      addTeacher(formData);
    }
    setFormOpen(false);
    setEditingTeacher(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("متأكدة إنك بدك تحذفي هالمعلم/ة؟")) {
      deleteTeacher(id);
    }
  };

  return (
    <DashboardLayout activePage="teachers" onNavigate={onNavigate} onLogout={onLogout} pageTitle="المعلمون">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: "#A8B0AB" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم المعلم أو المادة..."
            className="w-full rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none"
            style={{ border: "1px solid #E2DCCC", backgroundColor: "#FFFFFF", color: "#2F3A36" }}
          />
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0" style={{ backgroundColor: "#4C8577" }}>
          <Plus size={18} />
          إضافة معلم
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#FCFAF4", borderBottom: "1px solid #EDE7D9" }}>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>الاسم</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>المادة</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>الصف</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>رقم التواصل</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>الحالة</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #F3EFE3" }}>
                <td className="px-5 py-3 font-medium" style={{ color: "#2F3A36" }}>{t.name}</td>
                <td className="px-5 py-3" style={{ color: "#4A5551" }}>{t.subject}</td>
                <td className="px-5 py-3" style={{ color: "#4A5551" }}>{t.classroom}</td>
                <td className="px-5 py-3" style={{ color: "#4A5551" }}>
                  <span className="flex items-center gap-1.5"><Phone size={13} style={{ color: "#A8B0AB" }} />{t.phone}</span>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={t.status} onClick={() => toggleTeacherStatus(t.id)} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewingTeacher(t)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "#6E8FB0" }}><Eye size={16} /></button>
                    <button onClick={() => handleEditClick(t)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "#4C8577" }}><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "#C25B4A" }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm py-8" style={{ color: "#A8B0AB" }}>لا يوجد نتائج مطابقة للبحث</p>
        )}
      </div>

      {formOpen && (
        <TeacherForm
          initialData={editingTeacher}
          onClose={() => { setFormOpen(false); setEditingTeacher(null); }}
          onSave={handleSave}
        />
      )}

      {viewingTeacher && (
        <DetailsModal
          title={viewingTeacher.name}
          subtitle="معلم/ة"
          initials={viewingTeacher.name.charAt(3) || viewingTeacher.name.charAt(0)}
          fields={[
            { label: "المادة", value: viewingTeacher.subject },
            { label: "الصف", value: viewingTeacher.classroom },
            { label: "رقم الهاتف", value: viewingTeacher.phone },
            { label: "الحالة", value: viewingTeacher.status },
          ]}
          onClose={() => setViewingTeacher(null)}
        />
      )}
    </DashboardLayout>
  );
}