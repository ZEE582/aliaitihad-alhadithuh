import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Eye,
  Trash2,
  Phone,
  BookOpen,
  School,
  CalendarDays,
} from "lucide-react";

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
      style={{
        backgroundColor: isActive ? "#4C857720" : "#E8B24D25",
        color: isActive ? "#4C8577" : "#B8862F",
      }}
      title="اضغط لتبديل الحالة"
    >
      {status}
    </button>
  );
}

export default function TeachersList({ onNavigate, onLogout }) {
  const {
    teachersList,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    toggleTeacherStatus,
  } = useTeachers();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);

  const filtered = teachersList.filter((teacher) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      teacher.name?.toLowerCase().includes(query) ||
      teacher.subject?.toLowerCase().includes(query) ||
      teacher.classroom?.toLowerCase().includes(query) ||
      teacher.phone?.includes(query)
    );
  });

  const handleAddClick = () => {
    setEditingTeacher(null);
    setFormOpen(true);
  };

  const handleEditClick = (teacher) => {
    setEditingTeacher(teacher);
    setFormOpen(true);
  };

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
    <DashboardLayout
      activePage="teachers"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle="المعلمون"
    >
      {/* Top section */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute top-1/2 -translate-y-1/2 right-3"
            style={{ color: "#A8B0AB" }}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم المعلم، المادة أو الصف..."
            className="w-full rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none"
            style={{
              border: "1px solid #E2DCCC",
              backgroundColor: "#FFFFFF",
              color: "#2F3A36",
            }}
          />
        </div>

        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0"
          style={{ backgroundColor: "#4C8577" }}
        >
          <Plus size={18} />
          إضافة معلم
        </button>
      </div>

      {/* Teachers table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EDE7D9",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  backgroundColor: "#FCFAF4",
                  borderBottom: "1px solid #EDE7D9",
                }}
              >
                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  المعلم
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  المواد
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  الصفوف
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  الحصص الأسبوعية
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  الحالة
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  إجراءات
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((teacher) => (
                <tr
                  key={teacher.id}
                  style={{ borderBottom: "1px solid #F3EFE3" }}
                >
                  {/* Teacher */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          backgroundColor: "#4C857720",
                          color: "#4C8577",
                        }}
                      >
                        {teacher.name?.charAt(0) || "م"}
                      </div>

                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: "#2F3A36" }}
                        >
                          {teacher.name}
                        </p>

                        <span
                          className="flex items-center gap-1 mt-1 text-xs"
                          style={{ color: "#A8B0AB" }}
                        >
                          <Phone size={11} />
                          {teacher.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Subjects */}
                  <td
                    className="px-5 py-4"
                    style={{ color: "#4A5551" }}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen
                        size={14}
                        style={{ color: "#6E8FB0" }}
                      />
                      <span>{teacher.subject}</span>
                    </div>
                  </td>

                  {/* Classrooms */}
                  <td
                    className="px-5 py-4"
                    style={{ color: "#4A5551" }}
                  >
                    <div className="flex items-center gap-2">
                      <School
                        size={14}
                        style={{ color: "#E8B24D" }}
                      />
                      <span>{teacher.classroom}</span>
                    </div>
                  </td>

                  {/* Weekly lessons */}
                  <td
                    className="px-5 py-4"
                    style={{ color: "#4A5551" }}
                  >
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={14}
                        style={{ color: "#4C8577" }}
                      />

                      <span>
                        {teacher.weeklyLessons ?? 0} حصة
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge
                      status={teacher.status || "نشط"}
                      onClick={() => toggleTeacherStatus(teacher.id)}
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingTeacher(teacher)}
                        className="p-1.5 rounded-lg hover:opacity-70"
                        style={{ color: "#6E8FB0" }}
                        title="عرض التفاصيل"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => handleEditClick(teacher)}
                        className="p-1.5 rounded-lg hover:opacity-70"
                        style={{ color: "#4C8577" }}
                        title="تعديل"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="p-1.5 rounded-lg hover:opacity-70"
                        style={{ color: "#C25B4A" }}
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div
              className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
              style={{ backgroundColor: "#FCFAF4" }}
            >
              <Search size={20} style={{ color: "#A8B0AB" }} />
            </div>

            <p
              className="text-sm mt-3"
              style={{ color: "#A8B0AB" }}
            >
              لا يوجد معلمون مطابقون للبحث
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit */}
      {formOpen && (
        <TeacherForm
          initialData={editingTeacher}
          onClose={() => {
            setFormOpen(false);
            setEditingTeacher(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Details */}
      {viewingTeacher && (
        <DetailsModal
          title={viewingTeacher.name}
          subtitle="معلم/ة"
          initials={viewingTeacher.name?.charAt(0) || "م"}
          fields={[
            {
              label: "المواد التي يدرّسها",
              value: viewingTeacher.subject || "غير محدد",
            },
            {
              label: "الصفوف",
              value: viewingTeacher.classroom || "غير محدد",
            },
            {
              label: "رقم الهاتف",
              value: viewingTeacher.phone || "غير محدد",
            },
            {
              label: "الحصص الأسبوعية",
              value: `${viewingTeacher.weeklyLessons ?? 0} حصة`,
            },
            {
              label: "الحالة",
              value: viewingTeacher.status || "نشط",
            },
          ]}
          onClose={() => setViewingTeacher(null)}
        />
      )}
    </DashboardLayout>
  );
}