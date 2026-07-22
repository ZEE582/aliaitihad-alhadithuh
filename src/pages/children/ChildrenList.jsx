import { useState } from "react";
import { Search, Plus, Pencil, Eye, Trash2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ChildForm from "./ChildForm";
import { useChildren } from "../../context/ChildrenContext";
import { useUser } from "../../context/UserContext";

function StatusBadge({ status, onClick, disabled }) {
  const isActive = status === "نشط";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-xs font-medium px-2.5 py-1 rounded-full disabled:cursor-default"
      style={{ backgroundColor: isActive ? "#4C857720" : "#C25B4A20", color: isActive ? "#4C8577" : "#C25B4A" }}
      title={disabled ? "" : "اضغط لتبديل الحالة"}
    >
      {status}
    </button>
  );
}

export default function ChildrenList({ onNavigate, onOpenChild }) {
  const { childrenList, addChild, updateChild, deleteChild, toggleChildStatus } = useChildren();
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);

  // فلترة حسب الدور -- المعلم يشوف بس أطفال صفه، المدير يشوف الكل
  // (ولي الأمر عنده صفحة منفصلة كلياً: MyChildPage)
  const roleFilteredChildren =
    user.roleType === "teacher"
      ? childrenList.filter((c) => c.classroom === user.classroom)
      : childrenList;

  const filtered = roleFilteredChildren.filter((c) =>
    c.name.includes(search) || c.classroom.includes(search)
  );

  // صلاحيات حسب الدور (بهاي الصفحة بس مدير ومعلم، ولي الأمر عنده صفحة منفصلة)
  const canAdd = user.roleType === "admin";
  const canEdit = user.roleType === "admin" || user.roleType === "teacher";
  const canDelete = user.roleType === "admin";
  const canToggleStatus = user.roleType === "admin" || user.roleType === "teacher";

  const pageTitle = user.roleType === "teacher" ? "طلاب صفي" : "الأطفال";

  const handleAddClick = () => { setEditingChild(null); setFormOpen(true); };
  const handleEditClick = (child) => { setEditingChild(child); setFormOpen(true); };

  const handleSave = (formData) => {
    if (editingChild) {
      updateChild(editingChild.id, formData);
    } else {
      addChild(formData);
    }
    setFormOpen(false);
    setEditingChild(null);
  };

  const handleDelete = (childId) => {
    if (window.confirm("متأكدة إنك بدك تحذفي هالطفل؟")) {
      deleteChild(childId);
    }
  };

  return (
    <DashboardLayout activePage="children" onNavigate={onNavigate} pageTitle={pageTitle}>
      <div className="flex items-center justify-between mb-5 gap-3">
        {/* ولي الأمر عادةً عنده طفل واحد بس، البحث مش ضروري إله، بس منخليه لو عنده أكتر من طفل */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: "#A8B0AB" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم الطفل أو الصف..."
            className="w-full rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none"
            style={{ border: "1px solid #E2DCCC", backgroundColor: "#FFFFFF", color: "#2F3A36" }}
          />
        </div>

        {canAdd && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0"
            style={{ backgroundColor: "#4C8577" }}
          >
            <Plus size={18} />
            إضافة طفل
          </button>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#FCFAF4", borderBottom: "1px solid #EDE7D9" }}>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>الاسم</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>الصف</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>العمر</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>ولي الأمر</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>الحالة</th>
              <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((child) => (
              <tr key={child.id} style={{ borderBottom: "1px solid #F3EFE3" }}>
                <td className="px-5 py-3 font-medium" style={{ color: "#2F3A36" }}>{child.name}</td>
                <td className="px-5 py-3" style={{ color: "#4A5551" }}>{child.classroom}</td>
                <td className="px-5 py-3" style={{ color: "#4A5551" }}>{child.age}</td>
                <td className="px-5 py-3" style={{ color: "#4A5551" }}>{child.parent}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={child.status} disabled={!canToggleStatus} onClick={() => canToggleStatus && toggleChildStatus(child.id)} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onOpenChild && onOpenChild(child)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "#6E8FB0" }}>
                      <Eye size={16} />
                    </button>
                    {canEdit && (
                      <button onClick={() => handleEditClick(child)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "#4C8577" }}>
                        <Pencil size={16} />
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={() => handleDelete(child.id)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "#C25B4A" }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center text-sm py-8" style={{ color: "#A8B0AB" }}>
            لا يوجد نتائج مطابقة للبحث
          </p>
        )}
      </div>

      {formOpen && (
        <ChildForm
          initialData={editingChild}
          onClose={() => { setFormOpen(false); setEditingChild(null); }}
          onSave={handleSave}
        />
      )}
    </DashboardLayout>
  );
}