import { useState } from "react";
import { Search, Plus, Pencil, Eye, Trash2, Printer } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ChildForm from "./ChildForm";
import ConfirmModal from "../../components/ConfirmModal";
import { useChildren } from "../../context/ChildrenContext";
import { useUser } from "../../context/UserContext";
import { strings as S } from "../../constants/strings";
function StatusBadge({ status, onClick }) {
  const isActive = status === "نشط";
  const isButton = typeof onClick === "function";

  const content = (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: isActive ? "#4C857720" : "#C25B4A20",
        color: isActive ? "#4C8577" : "#C25B4A",
      }}
      title={S.children.toggleStatusTitle}
    >
      {status}
    </span>
  );

  if (!isButton) return content;

  return (
    <button onClick={onClick} style={{ border: "none", background: "none", padding: 0 }}>
      {content}
    </button>
  );
}

export default function ChildrenList({ onNavigate, onOpenChild, onLogout }) {
  const {
    childrenList,
    addChild,
    updateChild,
    deleteChild,
  } = useChildren();

  const { user } = useUser();
  const isSecretary = user?.roleType === "secretary";

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = childrenList.filter(
    (c) =>
      (c.name || "").includes(search) ||
      (c.classroom || "").includes(search)
  );

  const handleAddClick = () => {
    setEditingChild(null);
    setFormOpen(true);
  };

  const handleEditClick = (child) => {
    setEditingChild(child);
    setFormOpen(true);
  };

  const handleSave = async (formData) => {
    const result = editingChild
      ? await updateChild(editingChild.id, formData)
      : await addChild(formData);

    if (result && !result.error) {
      setFormOpen(false);
      setEditingChild(null);
    }
  };

  const handleDelete = (childId) => {
    setDeleteTarget(childId);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteChild(deleteTarget);
    }

    setDeleteTarget(null);
  };

  return (
    <DashboardLayout
      activePage="children"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.children.pageTitle}
    >
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
            placeholder={S.children.searchPlaceholder}
            className="w-full rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none"
            style={{
              border: "1px solid #E2DCCC",
              backgroundColor: "#FFFFFF",
              color: "#2F3A36",
            }}
          />
        </div>

        <button
          onClick={() => window.print()}
          className="no-print flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shrink-0"
          style={{
            border: "1px solid #4C8577",
            color: "#4C8577",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Printer size={18} />
          {S.reports.printButton}
        </button>

        {!isSecretary && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0"
            style={{ backgroundColor: "#4C8577" }}
          >
            <Plus size={18} />
            {S.children.addChildButton}
          </button>
        )}
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EDE7D9",
        }}
      >
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
                {S.children.tableName}
              </th>

              <th
                className="text-right px-5 py-3 font-medium"
                style={{ color: "#7A8580" }}
              >
                {S.children.tableClassroom}
              </th>

              <th
                className="text-right px-5 py-3 font-medium"
                style={{ color: "#7A8580" }}
              >
                {S.children.tableAge}
              </th>

              <th
                className="text-right px-5 py-3 font-medium"
                style={{ color: "#7A8580" }}
              >
                {S.children.tableParent}
              </th>

              <th
                className="text-right px-5 py-3 font-medium"
                style={{ color: "#7A8580" }}
              >
                {S.children.tableStatus}
              </th>

              <th
                className="text-right px-5 py-3 font-medium"
                style={{ color: "#7A8580" }}
              >
                {S.children.tableActions}
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((child) => (
              <tr
                key={child.id}
                style={{ borderBottom: "1px solid #F3EFE3" }}
              >
                <td
                  className="px-5 py-3 font-medium"
                  style={{ color: "#2F3A36" }}
                >
                  {child.name}
                </td>

                <td
                  className="px-5 py-3"
                  style={{ color: "#4A5551" }}
                >
                  {child.classroom}
                </td>

                <td
                  className="px-5 py-3"
                  style={{ color: "#4A5551" }}
                >
                  {child.age}
                </td>

                <td
                  className="px-5 py-3"
                  style={{ color: "#4A5551" }}
                >
                  {child.parent}
                </td>

                <td className="px-5 py-3">
                  <StatusBadge status={child.status} />
                </td>

                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onOpenChild && onOpenChild(child)
                      }
                      className="p-1.5 rounded-lg hover:opacity-70"
                      style={{ color: "#6E8FB0" }}
                    >
                      <Eye size={16} />
                    </button>

                    {!isSecretary && (
                      <>
                        <button
                          onClick={() => handleEditClick(child)}
                          className="p-1.5 rounded-lg hover:opacity-70"
                          style={{ color: "#4C8577" }}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(child.id)}
                          className="p-1.5 rounded-lg hover:opacity-70"
                          style={{ color: "#C25B4A" }}
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

        {filtered.length === 0 && (
          <p
            className="text-center text-sm py-8"
            style={{ color: "#A8B0AB" }}
          >
            {S.children.noResults}
          </p>
        )}
      </div>

      {formOpen && (
        <ChildForm
          initialData={editingChild}
          onClose={() => {
            setFormOpen(false);
            setEditingChild(null);
          }}
          onSave={handleSave}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title={S.children.confirmDeleteTitle}
        message={S.children.confirmDeleteMessage}
        confirmLabel={S.children.confirmDeleteButton}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}