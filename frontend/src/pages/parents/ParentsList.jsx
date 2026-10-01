import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Eye,
  Trash2,
  Phone,
  Users,
  UserCheck,
  X,
  Mail,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import ParentForm from "./ParentForm";
import ConfirmModal from "../../components/ConfirmModal";
import { useParents } from "../../context/ParentsContext";
import { strings as S } from "../../constants/strings";

function StatusBadge({ status, onClick }) {
  const isActive = status === "ظ†ط´ط·";

  return (
    <button
      onClick={onClick}
      className="text-xs font-medium px-2.5 py-1 rounded-full transition-all hover:opacity-80"
      style={{
        backgroundColor: isActive ? "#4C857720" : "#C25B4A20",
        color: isActive ? "#4C8577" : "#C25B4A",
      }}
      title={S.parents.statusToggleTitle}
    >
      {status}
    </button>
  );
}

function ParentDetails({ parent, onClose }) {
  if (!parent) return null;

  return (
    <div
      dir="rtl"
      className="modal-root"
      style={{ backgroundColor: "#00000040" }}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 20px 60px rgba(47,58,54,0.15)",
        }}
      >
        {/* Header */}
        <div
          className="p-6"
          style={{
            backgroundColor: "#FCFAF4",
            borderBottom: "1px solid #EDE7D9",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold"
                style={{
                  backgroundColor: "#4C8577",
                  color: "#FBF7EF",
                }}
              >
                {parent.name?.charAt(0) || S.parents.rowAvatarFallback}
              </div>

              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "#2F3A36" }}
                >
                  {parent.name}
                </h3>

                <p
                  className="text-xs mt-1"
                  style={{ color: "#7A8580" }}
                >
                  {S.parents.parentRole}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-70"
              style={{
                color: "#A8B0AB",
                backgroundColor: "#FFFFFF",
              }}
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-3">
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "#FCFAF4",
              border: "1px solid #F3EFE3",
            }}
          >
            <div className="flex items-center gap-3">
              <Phone size={17} style={{ color: "#4C8577" }} />

              <div>
                <p
                  className="text-xs"
                  style={{ color: "#A8B0AB" }}
                >
                  {S.parents.detailPhoneLabel}
                </p>

                <p
                  className="text-sm font-medium mt-0.5"
                  style={{ color: "#2F3A36" }}
                >
                  {parent.phone || S.parents.detailPhoneFallback}
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "#FCFAF4",
              border: "1px solid #F3EFE3",
            }}
          >
            <div className="flex items-center gap-3">
              <Mail size={17} style={{ color: "#4C8577" }} />

              <div>
                <p
                  className="text-xs"
                  style={{ color: "#A8B0AB" }}
                >
                  {S.parents.detailEmailLabel}
                </p>

                <p
                  className="text-sm font-medium mt-0.5"
                  style={{ color: "#2F3A36" }}
                >
                  {parent.email || S.parents.detailEmailFallback}
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "#FCFAF4",
              border: "1px solid #F3EFE3",
            }}
          >
            <div className="flex items-center gap-3">
              <Users size={17} style={{ color: "#4C8577" }} />

              <div>
                <p
                  className="text-xs"
                  style={{ color: "#A8B0AB" }}
                >
                  {S.parents.detailChildrenLabel}
                </p>

                <p
                  className="text-sm font-medium mt-0.5"
                  style={{ color: "#2F3A36" }}
                >
                  {parent.childrenNames || S.parents.detailChildrenFallback}
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "#FCFAF4",
              border: "1px solid #F3EFE3",
            }}
          >
            <div className="flex items-center gap-3">
              <UserCheck size={17} style={{ color: "#4C8577" }} />

              <div>
                <p
                  className="text-xs"
                  style={{ color: "#A8B0AB" }}
                >
                  {S.parents.detailStatusLabel}
                </p>

                <div className="mt-1">
                  <StatusBadge status={parent.status} />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 text-sm font-semibold mt-2"
            style={{
              backgroundColor: "#4C8577",
              color: "#FFFFFF",
            }}
          >
            {S.parents.detailCloseButton}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ParentsList({ onNavigate, onLogout }) {
  const {
    parentsList,
    addParent,
    updateParent,
    deleteParent,
    toggleParentStatus,
  } = useParents();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [viewingParent, setViewingParent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = parentsList.filter(
    (p) =>
      p.name.includes(search) ||
      p.childrenNames.includes(search)
  );

  const activeParents = parentsList.filter(
    (p) => p.status === "ظ†ط´ط·"
  ).length;

  const handleAddClick = () => {
    setEditingParent(null);
    setFormOpen(true);
  };

  const handleEditClick = (parent) => {
    setEditingParent(parent);
    setFormOpen(true);
  };

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
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteParent(deleteTarget);
    }

    setDeleteTarget(null);
  };

  return (
    <DashboardLayout
      activePage="parents"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.parents.pageTitle}
    >
      {/* Intro */}
      <div className="mb-5">
        <p
          className="text-sm"
          style={{ color: "#7A8580" }}
        >
          {S.parents.introText}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#EAF2EF" }}
          >
            <Users
              size={19}
              style={{ color: "#4C8577" }}
            />
          </div>

          <div>
            <p
              className="text-xs"
              style={{ color: "#A8B0AB" }}
            >
              {S.parents.statsTotalLabel}
            </p>

            <p
              className="text-lg font-bold mt-0.5"
              style={{ color: "#2F3A36" }}
            >
              {parentsList.length}
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#EAF2EF" }}
          >
            <UserCheck
              size={19}
              style={{ color: "#4C8577" }}
            />
          </div>

          <div>
            <p
              className="text-xs"
              style={{ color: "#A8B0AB" }}
            >
              {S.parents.statsActiveLabel}
            </p>

            <p
              className="text-lg font-bold mt-0.5"
              style={{ color: "#2F3A36" }}
            >
              {activeParents}
            </p>
          </div>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
        <div className="relative w-full sm:flex-1 sm:max-w-sm">
          <Search
            size={16}
            className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
            style={{ color: "#A8B0AB" }}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={S.parents.searchPlaceholder}
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
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 sm:py-2.5 text-sm font-semibold text-white shrink-0 hover:opacity-90 w-full sm:w-auto"
          style={{ backgroundColor: "#4C8577" }}
        >
          <Plus size={18} />
          {S.parents.addButton}
        </button>
      </div>

      {/* Table */}
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
                  {S.common.tableHeaderName}
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  {S.common.tableHeaderContact}
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  {S.parents.detailChildrenLabel}
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  {S.parents.detailStatusLabel}
                </th>

                <th
                  className="text-right px-5 py-3 font-medium"
                  style={{ color: "#7A8580" }}
                >
                  {S.common.tableHeaderActions}
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-[#FCFAF4] transition-colors"
                  style={{
                    borderBottom: "1px solid #F3EFE3",
                  }}
                >
                  <td
                    data-label=""
                    className="card-title px-3 sm:px-5 py-3"
                    style={{ color: "#2F3A36" }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          backgroundColor: "#EAF2EF",
                          color: "#4C8577",
                        }}
                      >
                        {p.name?.charAt(0) || S.parents.rowAvatarFallback}
                      </div>

                      <span className="break-words">{p.name}</span>
                    </div>
                  </td>

                  <td
                    data-label={S.common.tableHeaderContact}
                    className="px-3 sm:px-5 py-3"
                    style={{ color: "#4A5551" }}
                  >
                    <span className="flex items-center gap-1.5 min-w-0">
                      <Phone
                        size={13}
                        className="shrink-0"
                        style={{ color: "#A8B0AB" }}
                      />
                      <span className="break-words">{p.phone}</span>
                    </span>
                  </td>

                  <td
                    data-label={S.parents.detailChildrenLabel}
                    className="px-3 sm:px-5 py-3"
                    style={{ color: "#4A5551" }}
                  >
                    <span className="flex items-center gap-1.5 min-w-0">
                      <Users
                        size={13}
                        className="shrink-0"
                        style={{ color: "#A8B0AB" }}
                      />
                      <span className="break-words">{p.childrenNames}</span>
                    </span>
                  </td>

                  <td
                    data-label={S.parents.detailStatusLabel}
                    className="px-3 sm:px-5 py-3"
                  >
                    <StatusBadge
                      status={p.status}
                      onClick={() =>
                        toggleParentStatus(p.id)
                      }
                    />
                  </td>

                  <td data-label="" className="card-actions px-3 sm:px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setViewingParent(p)
                        }
                        className="p-2 rounded-lg hover:opacity-70 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        style={{ color: "#6E8FB0" }}
                        title={S.common.viewDetails}
                        aria-label={S.common.viewDetails}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleEditClick(p)
                        }
                        className="p-2 rounded-lg hover:opacity-70 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        style={{ color: "#4C8577" }}
                        title={S.common.edit}
                        aria-label={S.common.edit}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(p.id)
                        }
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
          <div className="text-center py-10">
            <div
              className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: "#FCFAF4" }}
            >
              <Users
                size={20}
                style={{ color: "#A8B0AB" }}
              />
            </div>

            <p
              className="text-sm"
              style={{ color: "#A8B0AB" }}
            >
              {S.common.noSearchResults}
            </p>
          </div>
        )}
      </div>

      {/* Parent Form */}
      {formOpen && (
        <ParentForm
          initialData={editingParent}
          onClose={() => {
            setFormOpen(false);
            setEditingParent(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Parent Details */}
      {viewingParent && (
        <ParentDetails
          parent={viewingParent}
          onClose={() => setViewingParent(null)}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title={S.parents.confirmDeleteTitle}
        message={S.parents.confirmDeleteMessage}
        confirmLabel={S.parents.confirmDeleteLabel}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}