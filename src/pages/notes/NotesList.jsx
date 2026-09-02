import { useState } from "react";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  MessageSquareText,
  Sparkles,
  AlertCircle,
  StickyNote,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import NoteForm from "./NoteForm";

import { useChildren } from "../../context/ChildrenContext";
import { useUser } from "../../context/UserContext";
import { useNotes } from "../../context/NotesContext";

const TYPE_CONFIG = {
  إيجابي: {
    bg: "#EAF4F0",
    text: "#4C8577",
    icon: Sparkles,
    label: "إيجابي",
  },

  ملاحظة: {
    bg: "#FFF5DF",
    text: "#B8862F",
    icon: StickyNote,
    label: "ملاحظة",
  },

  تنبيه: {
    bg: "#FBEDEA",
    text: "#C25B4A",
    icon: AlertCircle,
    label: "تنبيه",
  },
};

function TypeBadge({ type }) {
  const config =
    TYPE_CONFIG[type] ||
    TYPE_CONFIG["ملاحظة"];

  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full"
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  bg,
  color,
}) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EDE7D9",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{
          backgroundColor: bg,
        }}
      >
        <Icon
          size={18}
          style={{
            color,
          }}
        />
      </div>

      <div>
        <p
          className="text-xs"
          style={{
            color: "#A8B0AB",
          }}
        >
          {label}
        </p>

        <p
          className="text-lg font-bold mt-0.5"
          style={{
            color: "#2F3A36",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function NotesList({
  onNavigate,
  onLogout,
}) {
  const { childrenList } = useChildren();
  const { user } = useUser();

  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] =
    useState(null);

  // ==========================================
  // أطفال المعلمة
  // ==========================================

  const allowedNames =
    user?.roleType === "teacher"
      ? childrenList
          .filter(
            (child) =>
              child.classroom === user.classroom
          )
          .map((child) => child.name)
      : user?.roleType === "parent"
      ? childrenList
          .filter((child) =>
            user.childIds?.includes(child.id)
          )
          .map((child) => child.name)
      : null;

  // ==========================================
  // فلترة الملاحظات حسب الصلاحية
  // ==========================================

  const roleFilteredNotes = allowedNames
    ? notes.filter(
        (note) =>
          note.noteScope === "child" &&
          allowedNames.includes(note.childName)
      )
    : notes.filter(
        (note) => note.noteScope === "child"
      );

  const filtered = roleFilteredNotes.filter(
    (note) => {
      const query = search.trim();

      if (!query) return true;

      return (
        note.childName.includes(query) ||
        note.text.includes(query) ||
        note.author.includes(query)
      );
    }
  );

  // ==========================================
  // الصلاحيات
  // ==========================================

  const canAdd =
    user?.roleType === "admin" ||
    user?.roleType === "teacher";

  const canManageNote = (note) => {
    // المديرة تستطيع إدارة جميع الملاحظات
    if (user?.roleType === "admin") {
      return true;
    }

    // المعلمة تستطيع تعديل/حذف ملاحظاتها
    // الخاصة بأطفال صفها فقط
    if (user?.roleType === "teacher") {
      return (
        note.author === user.name &&
        allowedNames?.includes(note.childName)
      );
    }

    return false;
  };

  // ==========================================
  // الإحصائيات
  // ==========================================

  const positiveCount =
    roleFilteredNotes.filter(
      (note) => note.type === "إيجابي"
    ).length;

  const alertCount =
    roleFilteredNotes.filter(
      (note) => note.type === "تنبيه"
    ).length;

  // ==========================================
  // فتح الفورم
  // ==========================================

  const handleAddClick = () => {
    setEditingNote(null);
    setFormOpen(true);
  };

  const handleEditClick = (note) => {
    if (!canManageNote(note)) return;

    setEditingNote(note);
    setFormOpen(true);
  };

  // ==========================================
  // حفظ الملاحظة
  // ==========================================

  const handleSave = (formData) => {
    // منع المعلمة من إضافة ملاحظة لطفل
    // خارج صفها
    if (
      user?.roleType === "teacher" &&
      !allowedNames?.includes(formData.childName)
    ) {
      return;
    }

    if (editingNote) {
      if (!canManageNote(editingNote)) {
        return;
      }

      updateNote(
        editingNote.id,
        formData
      );
    } else {
      addNote(
        formData,
        user?.name || "أنتِ"
      );
    }

    setFormOpen(false);
    setEditingNote(null);
  };

  // ==========================================
  // حذف
  // ==========================================

  const handleDelete = (note) => {
    if (!canManageNote(note)) return;

    if (
      window.confirm(
        "متأكدة إنك بدك تحذفي هالملاحظة؟"
      )
    ) {
      deleteNote(note.id);
    }
  };

  return (
    <DashboardLayout
      activePage="notes"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle="الملاحظات"
    >
      {/* Header */}

      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "#EAF2EF",
                }}
              >
                <MessageSquareText
                  size={18}
                  style={{
                    color: "#4C8577",
                  }}
                />
              </div>

              <h2
                className="text-lg font-bold"
                style={{
                  color: "#2F3A36",
                }}
              >
                ملاحظات الأطفال
              </h2>
            </div>

            <p
              className="text-xs mt-2"
              style={{
                color: "#A8B0AB",
              }}
            >
              تابعي ملاحظات الأطفال وسلوكهم وتطورهم اليومي
            </p>
          </div>

          {canAdd && (
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0 transition-all hover:opacity-90"
              style={{
                backgroundColor: "#4C8577",
              }}
            >
              <Plus size={17} />
              إضافة ملاحظة
            </button>
          )}
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard
          icon={MessageSquareText}
          label="إجمالي الملاحظات"
          value={roleFilteredNotes.length}
          bg="#EAF2EF"
          color="#4C8577"
        />

        <StatCard
          icon={Sparkles}
          label="ملاحظات إيجابية"
          value={positiveCount}
          bg="#EAF4F0"
          color="#4C8577"
        />

        <StatCard
          icon={AlertCircle}
          label="تنبيهات"
          value={alertCount}
          bg="#FBEDEA"
          color="#C25B4A"
        />
      </div>

      {/* Search */}

      <div
        className="rounded-2xl p-3 mb-5"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EDE7D9",
        }}
      >
        <div className="relative">
          <Search
            size={17}
            className="absolute top-1/2 -translate-y-1/2 right-3"
            style={{
              color: "#A8B0AB",
            }}
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="ابحث باسم الطفل أو نص الملاحظة..."
            className="w-full rounded-xl py-2.5 pr-10 pl-3 text-sm outline-none"
            style={{
              border: "1px solid #E2DCCC",
              backgroundColor: "#FCFAF4",
              color: "#2F3A36",
            }}
          />
        </div>
      </div>

      {/* Notes */}

      {filtered.length > 0 ? (
        <ul className="space-y-3">
          {filtered.map((note) => {
            const config =
              TYPE_CONFIG[note.type] ||
              TYPE_CONFIG["ملاحظة"];

            const Icon = config.icon;

            return (
              <li
                key={note.id}
                className="rounded-2xl p-4 transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EDE7D9",
                  boxShadow:
                    "0 2px 10px rgba(47,58,54,0.03)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor:
                        config.bg,
                    }}
                  >
                    <Icon
                      size={18}
                      style={{
                        color: config.text,
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className="text-sm font-bold"
                          style={{
                            color: "#2F3A36",
                          }}
                        >
                          {note.childName}
                        </p>

                        <p
                          className="text-sm mt-1.5 leading-6"
                          style={{
                            color: "#4A5551",
                          }}
                        >
                          {note.text}
                        </p>
                      </div>

                      <TypeBadge
                        type={note.type}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-[#F3EFE3]">
                      <p
                        className="text-xs"
                        style={{
                          color: "#A8B0AB",
                        }}
                      >
                        {note.author} · {note.date}
                      </p>

                      {canManageNote(note) && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              handleEditClick(
                                note
                              )
                            }
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-70"
                            style={{
                              color: "#4C8577",
                              backgroundColor:
                                "#F4F8F7",
                            }}
                            title="تعديل"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(note)
                            }
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-70"
                            style={{
                              color: "#C25B4A",
                              backgroundColor:
                                "#FDF5F3",
                            }}
                            title="حذف"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div
          className="rounded-2xl py-14 px-5 text-center"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3"
            style={{
              backgroundColor: "#F4F8F7",
            }}
          >
            <MessageSquareText
              size={24}
              style={{
                color: "#A8B0AB",
              }}
            />
          </div>

          <p
            className="text-sm font-semibold"
            style={{
              color: "#4A5551",
            }}
          >
            لا توجد ملاحظات مطابقة
          </p>

          <p
            className="text-xs mt-1.5"
            style={{
              color: "#A8B0AB",
            }}
          >
            جرّبي البحث باسم طفل آخر أو كلمة مختلفة
          </p>
        </div>
      )}

      {/* Note Form */}

      {formOpen && (
        <NoteForm
          initialData={editingNote}
          onClose={() => {
            setFormOpen(false);
            setEditingNote(null);
          }}
          onSave={handleSave}
        />
      )}
    </DashboardLayout>
  );
}