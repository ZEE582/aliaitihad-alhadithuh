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
import ConfirmModal from "../../components/ConfirmModal";
import { useTeachers } from "../../context/TeachersContext";
import { strings as S } from "../../constants/strings";

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
      title={S.teachers.statusToggleTitle}
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
  const [deleteTarget, setDeleteTarget] = useState(null);

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
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteTeacher(deleteTarget);
    }

    setDeleteTarget(null);
  };

  return (
    <DashboardLayout
      activePage="teachers"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.teachers.pageTitle}
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
            placeholder={S.teachers.searchPlaceholder}
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
          {S.teachers.addButton}
        </button>
      </div>

      {/* Teachers table */}
      <div
        className="table-card rounded-2xl"
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
                  {S.teachers.tableHeaderTeacher}
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  {S.teachers.tableHeaderSubjects}
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  {S.teachers.tableHeaderClassrooms}
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  {S.teachers.tableHeaderWeeklyLessons}
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  {S.teachers.tableHeaderStatus}
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  {S.teachers.tableHeaderActions}
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
                  <td data-label="" className="card-title px-3 sm:px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          backgroundColor: "#4C857720",
                          color: "#4C8577",
                        }}
                      >
                        {teacher.name?.charAt(0) || S.teachers.initialsFallback}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="font-semibold break-words"
                          style={{ color: "#2F3A36" }}
                        >
                          {teacher.name}
                        </p>

                        <span
                          className="flex items-center gap-1 mt-1 text-xs"
                          style={{ color: "#A8B0AB" }}
                        >
                          <Phone size={11} className="shrink-0" />
                          {teacher.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Subjects */}
                  <td
                    data-label={S.teachers.tableHeaderSubjects}
                    className="px-3 sm:px-5 py-4"
                    style={{ color: "#4A5551" }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen
                        size={14}
                        className="shrink-0"
                        style={{ color: "#6E8FB0" }}
                      />
                      <span className="break-words">{teacher.subject}</span>
                    </div>
                  </td>

                  {/* Classrooms */}
                  <td
                    data-label={S.teachers.tableHeaderClassrooms}
                    className="px-3 sm:px-5 py-4"
                    style={{ color: "#4A5551" }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <School
                        size={14}
                        className="shrink-0"
                        style={{ color: "#E8B24D" }}
                      />
                      <span className="break-words">{teacher.classroom}</span>
                    </div>
                  </td>

                  {/* Weekly lessons */}
                  <td
                    data-label={S.teachers.tableHeaderWeeklyLessons}
                    className="px-3 sm:px-5 py-4"
                    style={{ color: "#4A5551" }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CalendarDays
                        size={14}
                        className="shrink-0"
                        style={{ color: "#4C8577" }}
                      />

                      <span>
                        {S.teachers.weeklyLessonsSuffix(teacher.weeklyLessons ?? 0)}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td
                    data-label={S.teachers.tableHeaderStatus}
                    className="px-3 sm:px-5 py-4"
                  >
                    <StatusBadge
                      status={teacher.status || "نشط"}
                      onClick={() => toggleTeacherStatus(teacher.id)}
                    />
                  </td>

                  {/* Actions */}
                  <td data-label="" className="card-actions px-3 sm:px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingTeacher(teacher)}
                        className="p-2 rounded-lg hover:opacity-70 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        style={{ color: "#6E8FB0" }}
                        title={S.common.viewDetails}
                        aria-label={S.common.viewDetails}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => handleEditClick(teacher)}
                        className="p-2 rounded-lg hover:opacity-70 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        style={{ color: "#4C8577" }}
                        title={S.common.edit}
                        aria-label={S.common.edit}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="p-2 rounded-lg hover:opacity-70 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        style={{ color: "#C25B4A" }}
                        title={S.common.delete}
                        aria-label={S.common.delete}
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
              {S.teachers.emptyResult}
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
          subtitle={S.teachers.detailsSubtitle}
          initials={viewingTeacher.name?.charAt(0) || S.teachers.detailsInitialsFallback}
          fields={[
            {
              label: S.teachers.detailsFieldSubjectsLabel,
              value: viewingTeacher.subject || S.teachers.detailsValueFallback,
            },
            {
              label: S.teachers.detailsFieldClassroomsLabel,
              value: viewingTeacher.classroom || S.teachers.detailsValueFallback,
            },
            {
              label: S.teachers.detailsFieldPhoneLabel,
              value: viewingTeacher.phone || S.teachers.detailsValueFallback,
            },
            {
              label: S.teachers.detailsFieldWeeklyLessonsLabel,
              value: S.teachers.detailsWeeklyLessonsValue(
                viewingTeacher.weeklyLessons ?? 0
              ),
            },
            {
              label: S.teachers.detailsFieldStatusLabel,
              value: viewingTeacher.status || "نشط",
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