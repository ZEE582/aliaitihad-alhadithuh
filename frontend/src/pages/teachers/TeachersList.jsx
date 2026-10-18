import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Eye, Trash2, Phone, BookOpen, School, Printer } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import TeacherForm from "./TeacherForm";
import DetailsModal from "../../components/DetailsModal";
import ConfirmModal from "../../components/ConfirmModal";
import { useTeachers } from "../../context/TeachersContext";
import { useUser } from "../../context/UserContext";
import { strings as S } from "../../constants/strings";

export default function TeachersList({ onNavigate, onLogout }) {
  const { teachersList, refreshTeachers, updateTeacher, deleteTeacher } = useTeachers();
  const { user } = useUser();
  const isAdmin = user?.roleType === "admin";

  const [search, setSearch] = useState("");
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    refreshTeachers();
  }, [refreshTeachers]);

  const filtered = teachersList.filter((teacher) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      teacher.name?.toLowerCase().includes(query) ||
      teacher.subjectName?.toLowerCase().includes(query) ||
      teacher.section?.toLowerCase().includes(query) ||
      teacher.className?.toLowerCase().includes(query) ||
      teacher.tNumber?.toLowerCase().includes(query) ||
      teacher.phone?.includes(query)
    );
  });

  const handleSave = async (formData) => {
    if (!editingTeacher) return;
    await updateTeacher(editingTeacher.PersonID, formData);
    setEditingTeacher(null);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteTeacher(deleteTarget);
    }
    setDeleteTarget(null);
  };

  const sectionLabel = (teacher) => {
    if (!teacher.section && !teacher.className) return S.teachers.noSubject;
    if (teacher.section && teacher.className) return `${teacher.section} — ${teacher.className}`;
    return teacher.section || teacher.className;
  };

  return (
    <DashboardLayout
      activePage="teachers"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.teachers.pageTitle}
    >
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
            placeholder={S.teachers.searchPlaceholder}
            className="w-full rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none"
            style={{ border: "1px solid #E2DCCC", backgroundColor: "#FFFFFF", color: "#2F3A36" }}
          />
        </div>

        <button
          onClick={() => window.print()}
          className="no-print flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shrink-0"
          style={{ border: "1px solid #4C8577", color: "#4C8577", backgroundColor: "#FFFFFF" }}
        >
          <Printer size={18} />
          {S.reports.printButton}
        </button>

        {isAdmin && (
          <button
            onClick={() => onNavigate && onNavigate("users")}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0"
            style={{ backgroundColor: "#4C8577" }}
          >
            <Plus size={18} />
            {S.teachers.addViaUsersButton}
          </button>
        )}
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#FCFAF4", borderBottom: "1px solid #EDE7D9" }}>
                <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>
                  {S.teachers.tableHeaderTeacher}
                </th>
                <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>
                  {S.teachers.tableHeaderSubjects}
                </th>
                <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>
                  {S.teachers.tableHeaderSection}
                </th>
                <th className="text-right px-5 py-3 font-medium" style={{ color: "#7A8580" }}>
                  {S.teachers.tableHeaderActions}
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((teacher) => (
                <tr key={teacher.PersonID} style={{ borderBottom: "1px solid #F3EFE3" }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ backgroundColor: "#4C857720", color: "#4C8577" }}
                      >
                        {teacher.name?.charAt(0) || S.teachers.initialsFallback}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: "#2F3A36" }}>
                          {teacher.name}
                        </p>
                        {(teacher.phone || teacher.email) && (
                          <span
                            className="flex items-center gap-1 mt-1 text-xs"
                            style={{ color: "#A8B0AB" }}
                            dir="ltr"
                          >
                            <Phone size={11} />
                            {teacher.phone || teacher.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4" style={{ color: "#4A5551" }}>
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} style={{ color: "#6E8FB0" }} />
                      <span>{teacher.subjectName || S.teachers.noSubject}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4" style={{ color: "#4A5551" }}>
                    <div className="flex items-center gap-2">
                      <School size={14} style={{ color: "#E8B24D" }} />
                      <span>{sectionLabel(teacher)}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingTeacher(teacher)}
                        className="p-1.5 rounded-lg hover:opacity-70"
                        style={{ color: "#6E8FB0" }}
                        title={S.common.viewDetails}
                      >
                        <Eye size={16} />
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => setEditingTeacher(teacher)}
                            className="p-1.5 rounded-lg hover:opacity-70"
                            style={{ color: "#4C8577" }}
                            title={S.common.edit}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(teacher.PersonID)}
                            className="p-1.5 rounded-lg hover:opacity-70"
                            style={{ color: "#C25B4A" }}
                            title={S.common.delete}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
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
            <p className="text-sm mt-3" style={{ color: "#A8B0AB" }}>
              {S.teachers.emptyResult}
            </p>
          </div>
        )}
      </div>

      {editingTeacher && (
        <TeacherForm
          initialData={editingTeacher}
          onClose={() => setEditingTeacher(null)}
          onSave={handleSave}
        />
      )}

      {viewingTeacher && (
        <DetailsModal
          title={viewingTeacher.name}
          subtitle={S.teachers.detailsSubtitle}
          initials={viewingTeacher.name?.charAt(0) || S.teachers.detailsInitialsFallback}
          fields={[
            {
              label: S.teachers.detailsFieldSubjectsLabel,
              value: viewingTeacher.subjectName || S.teachers.detailsValueFallback,
            },
            {
              label: S.teachers.detailsFieldSectionLabel,
              value: sectionLabel(viewingTeacher),
            },
            {
              label: S.teachers.detailsFieldSpecialtyLabel,
              value: viewingTeacher.specialty || S.teachers.detailsValueFallback,
            },
            {
              label: S.teachers.detailsFieldPhoneLabel,
              value: viewingTeacher.phone || S.teachers.detailsValueFallback,
            },
            {
              label: S.teachers.detailsFieldEmailLabel,
              value: viewingTeacher.email || S.teachers.detailsValueFallback,
            },
            {
              label: S.teachers.detailsFieldTNumberLabel,
              value: viewingTeacher.tNumber || S.teachers.detailsValueFallback,
            },
          ]}
          onClose={() => setViewingTeacher(null)}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title={S.teachers.confirmDeleteTitle}
        message={S.teachers.confirmDeleteMessage}
        confirmLabel={S.teachers.confirmDeleteLabel}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}
