import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Users,
  Layers3,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import SubjectForm from "./SubjectForm";
import ConfirmModal from "../../components/ConfirmModal";
import { strings as S } from "../../constants/strings";

const initialSubjects = [
  {
    id: 1,
    name: "اللغة العربية",
    teachersCount: 3,
    color: "#4C8577",
  },
  {
    id: 2,
    name: "الرياضيات",
    teachersCount: 2,
    color: "#6E8FB0",
  },
  {
    id: 3,
    name: "التربية الفنية",
    teachersCount: 1,
    color: "#E8B24D",
  },
  {
    id: 4,
    name: "النشاط الحركي",
    teachersCount: 2,
    color: "#C25B4A",
  },
];

export default function SubjectsList({
  onNavigate,
  onLogout,
}) {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const filtered = subjects.filter((s) =>
    s.name.includes(search)
  );

  const handleAddClick = () => {
    setEditingSubject(null);
    setFormOpen(true);
  };

  const handleEditClick = (subject) => {
    setEditingSubject(subject);
    setFormOpen(true);
  };

  const handleSave = (formData) => {
    if (editingSubject) {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === editingSubject.id
            ? { ...s, ...formData }
            : s
        )
      );
    } else {
      setSubjects((prev) => [
        ...prev,
        {
          id: Date.now(),
          teachersCount: 0,
          color: "#4C8577",
          ...formData,
        },
      ]);
    }

    setFormOpen(false);
    setEditingSubject(null);
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setSubjects((prev) =>
        prev.filter((s) => s.id !== deleteTarget)
      );
    }

    setDeleteTarget(null);
  };

  return (
    <DashboardLayout
      activePage="subjects"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.subjects.pageTitle}
    >
      <div dir="rtl">
        {/* Header */}
        <div
          className="rounded-3xl p-6 mb-5 relative overflow-hidden"
          style={{
            backgroundColor: "#F4F8F7",
            border: "1px solid #E2ECE8",
          }}
        >
          <div
            className="absolute -left-10 -top-10 w-28 h-28 rounded-full"
            style={{ backgroundColor: "#4C857710" }}
          />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#EAF2EF" }}
              >
                <Layers3
                  size={25}
                  style={{ color: "#4C8577" }}
                />
              </div>

              <div>
                <h2
                  className="text-lg font-bold"
                  style={{ color: "#2F3A36" }}
                >
                  {S.subjects.headerTitle}
                </h2>

                <p
                  className="text-xs mt-1"
                  style={{ color: "#7A8580" }}
                >
                  {S.subjects.headerDescription}
                </p>
              </div>
            </div>

            <div
              className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2ECE8",
              }}
            >
              <BookOpen
                size={15}
                style={{ color: "#4C8577" }}
              />

              <span
                className="text-xs font-semibold"
                style={{ color: "#4A5551" }}
              >
                {S.subjects.subjectsCount(subjects.length)}
              </span>
            </div>
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex items-center justify-between mb-5 gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute top-1/2 -translate-y-1/2 right-3"
              style={{ color: "#A8B0AB" }}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={S.subjects.searchPlaceholder}
              className="w-full rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FFFFFF",
                color: "#2F3A36",
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleAddClick}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0 hover:opacity-90"
            style={{
              backgroundColor: "#4C8577",
              boxShadow:
                "0 6px 16px rgba(76,133,119,0.14)",
            }}
          >
            <Plus size={18} />
            {S.subjects.addSubjectButton}
          </button>
        </div>

        {/* Subjects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EDE7D9",
                boxShadow:
                  "0 6px 20px rgba(47,58,54,0.04)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${s.color}1A`,
                  }}
                >
                  <BookOpen
                    size={21}
                    style={{ color: s.color }}
                  />
                </div>

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
                    onClick={() => handleDelete(s.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#FCF0EE]"
                    style={{ color: "#C25B4A" }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <h3
                  className="text-sm font-bold"
                  style={{ color: "#2F3A36" }}
                >
                  {s.name}
                </h3>

                <div
                  className="flex items-center gap-1.5 mt-2"
                  style={{ color: "#A8B0AB" }}
                >
                  <Users size={13} />

                  <p className="text-xs">
                    {S.subjects.teachersCount(s.teachersCount)}
                  </p>
                </div>
              </div>

              <div
                className="h-1 rounded-full mt-5"
                style={{
                  backgroundColor: `${s.color}30`,
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(
                      25,
                      Math.min(s.teachersCount * 25, 100)
                    )}%`,
                    backgroundColor: s.color,
                  }}
                />
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div
              className="col-span-full rounded-2xl py-12 flex flex-col items-center justify-center"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EDE7D9",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ backgroundColor: "#F4F8F7" }}
              >
                <Search
                  size={20}
                  style={{ color: "#A8B0AB" }}
                />
              </div>

              <p
                className="text-sm font-medium"
                style={{ color: "#7A8580" }}
              >
                {S.subjects.noResultsFound}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        {formOpen && (
          <SubjectForm
            initialData={editingSubject}
            onClose={() => {
              setFormOpen(false);
              setEditingSubject(null);
            }}
            onSave={handleSave}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title={S.subjects.confirmDeleteTitle}
        message={S.subjects.confirmDeleteMessage}
        confirmLabel={S.subjects.confirmDeleteLabel}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}