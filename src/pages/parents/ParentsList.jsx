import { useState } from "react";
import { Search, Plus, Pencil, Eye, Trash2, Phone } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ParentForm from "./ParentForm";
import DetailsModal from "../../components/DetailsModal";
import { useParents } from "../../context/ParentsContext";

function StatusBadge({ status, onClick }) {
  const isActive = status === "نشط";
  return (
    <button
      onClick={onClick}
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ backgroundColor: isActive ? "#4C857720" : "#C25B4A20", color: isActive ? "#4C8577" : "#C25B4A" }}
      title="اضغط لتبديل الحالة"
    >
      {status}
    </button>
  );
}

export default function ParentsList({ onNavigate, onLogout }) {
  const { parentsList, addParent, updateParent, deleteParent, toggleParentStatus } = useParents();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [viewingParent, setViewingParent] = useState(null);

  const filtered = parentsList.filter((p) => p.name.includes(search) || p.childrenNames.includes(search));

  const handleAddClick = () => { setEditingParent(null); setFormOpen(true); };
  const handleEditClick = (parent) => { setEditingParent(parent); setFormOpen(true); };

  const handleSave = (formData) => {
    if (editingParent) {
      updateParent(editingParent.id, formData);
    } else {
      addParent(formData);
    }
    setFormOpen(false);
    setEditingParent(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("متأكدة إنك بدك تحذفي ولي الأمر هذا؟")) {
      deleteParent(id);
    }
  };

  return (
    <DashboardLayout activePage="parents" onNavigate={onNavigate} onLogout={onLogout} pageTitle="أولياء الأمور">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: "#A8B0AB" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم ولي الأمر أو الطفل..."
            className="w-full rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none"
            style={{ border: "1px solid #E2DCCC", backgroundColor: "#FFFFFF", color: "#2F3A36" }}
          />
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0"
          style={{ backgroundColor: "#4C8577" }}
        >
          <Plus size={18} />
          إضافة ولي أمر
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#FCFAF4", borderBottom: "1px solid #EDE7D9" }}>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>الاسم</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>رقم التواصل</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>الأبناء</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>الحالة</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #F3EFE3" }}>
                <td className="px-5 py-3 font-medium" style={{ color: "#2F3A36" }}>{p.name}</td>
                <td className="px-5 py-3" style={{ color: "#4A5551" }}>
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} style={{ color: "#A8B0AB" }} />
                    {p.phone}
                  </span>
                </td>
                <td className="px-5 py-3" style={{ color: "#4A5551" }}>{p.childrenNames}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={p.status} onClick={() => toggleParentStatus(p.id)} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewingParent(p)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "#6E8FB0" }}><Eye size={16} /></button>
                    <button onClick={() => handleEditClick(p)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "#4C8577" }}><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "#C25B4A" }}><Trash2 size={16} /></button>
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
        <ParentForm
          initialData={editingParent}
          onClose={() => { setFormOpen(false); setEditingParent(null); }}
          onSave={handleSave}
        />
      )}

      {viewingParent && (
        <DetailsModal
          title={viewingParent.name}
          subtitle="ولي أمر"
          initials={viewingParent.name.charAt(0)}
          fields={[
            { label: "رقم الهاتف", value: viewingParent.phone },
            { label: "الأبناء", value: viewingParent.childrenNames },
            { label: "الحالة", value: viewingParent.status },
          ]}
          onClose={() => setViewingParent(null)}
        />
      )}
    </DashboardLayout>
  );
}