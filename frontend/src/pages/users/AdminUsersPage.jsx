import { useEffect, useState } from "react";
import { Plus, RotateCcw, Search } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import ConfirmModal from "../../components/ConfirmModal";
import TempPasswordModal from "../../components/TempPasswordModal";
import { useToast } from "../../context/ToastContext";
import { strings as S } from "../../constants/strings";
import { api } from "../../services/api";

const ROLE_LABELS = {
  teacher: S.users.roleTeacher,
  secretary: S.users.roleSecretary,
  parent: S.users.roleParent,
  admin: S.users.roleAdmin,
};

// ======================================================
// Add User Modal
// ======================================================

function AddUserModal({ isOpen, onClose, onCreated }) {
  const { showError } = useToast();
  const [form, setForm] = useState({
    fullName: "",
    nationalId: "",
    phone: "",
    roleType: "teacher",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm({
        fullName: "",
        nationalId: "",
        phone: "",
        roleType: "teacher",
      });
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.nationalId.trim() ||
      !form.phone.trim()
    ) {
      setError(S.users.requiredFields);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const data = await api.post("/users", {
        fullName: form.fullName.trim(),
        nationalId: form.nationalId.trim(),
        phone: form.phone.trim(),
        roleType: form.roleType,
      });
      onCreated(data);
      onClose();
    } catch (err) {
      showError(err.message || S.users.addFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in">
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          aria-label={S.common.close}
        >
          ×
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#4C8577" }}>
            <Plus size={20} style={{ color: "#FBF7EF" }} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "#2F3A36" }}>
              {S.users.addModalTitle}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#7A8580" }}>
              {S.users.addModalSubtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "#4A5551" }}>
              {S.users.labelFullName} *
            </label>
            <input
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder={S.users.fullNamePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ backgroundColor: "#FCFAF4", border: "1px solid #EDE7D9", color: "#2F3A36" }}
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "#4A5551" }}>
              {S.users.labelNationalId} *
            </label>
            <input
              value={form.nationalId}
              onChange={(e) => handleChange("nationalId", e.target.value)}
              placeholder={S.users.nationalIdPlaceholder}
              inputMode="numeric"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ backgroundColor: "#FCFAF4", border: "1px solid #EDE7D9", color: "#2F3A36" }}
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "#4A5551" }}>
              {S.users.labelPhone} *
            </label>
            <input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder={S.users.phonePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ backgroundColor: "#FCFAF4", border: "1px solid #EDE7D9", color: "#2F3A36" }}
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "#4A5551" }}>
              {S.users.labelRole} *
            </label>
            <select
              value={form.roleType}
              onChange={(e) => handleChange("roleType", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ backgroundColor: "#FCFAF4", border: "1px solid #EDE7D9", color: "#2F3A36" }}
            >
              <option value="teacher">{S.users.roleTeacher}</option>
              <option value="secretary">{S.users.roleSecretary}</option>
            </select>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: "#7A8580" }}>
            {S.users.parentsNote}
          </p>

          {error && (
            <p className="text-xs" style={{ color: "#C25B4A" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none"
            >
              {S.common.cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none"
              style={{ backgroundColor: "#4C8577" }}
            >
              {saving ? S.common.save : S.users.saveButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ======================================================
// Admin Users Page
// ======================================================

export default function AdminUsersPage({ onNavigate, onLogout }) {
  const { showSuccess, showError } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [tempCreds, setTempCreds] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await api.get("/users");
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      showError(err.message || S.users.fetchFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreated = (data) => {
    showSuccess(S.users.addSuccess);
    setTempCreds({ username: data.user.username, tempPassword: data.tempPassword });
    fetchUsers();
  };

  const handleReset = async () => {
    try {
      const data = await api.post(`/users/${resetTarget.id}/reset-password`);
      showSuccess(S.users.resetSuccess);
      setTempCreds({ username: data.user.username, tempPassword: data.tempPassword });
      setResetTarget(null);
      fetchUsers();
    } catch (err) {
      showError(err.message || S.users.resetFailed);
      setResetTarget(null);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.fullName || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout
      activePage="users"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.users.pageTitle}
    >
      <div dir="rtl" className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#2F3A36" }}>
              {S.users.pageTitle}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#7A8580" }}>
              {users.length > 0 ? `${users.length} ${S.common.users}` : ""}
            </p>
          </div>

          <div className="sm:mr-auto flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#A8B0AB" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={S.users.searchPlaceholder}
                className="pl-3.5 pr-9 py-2.5 rounded-xl text-sm w-64 focus:outline-none"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9", color: "#2F3A36" }}
              />
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: "#4C8577", color: "#FBF7EF" }}
            >
              <Plus size={16} />
              {S.users.addButton}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
          {loading ? (
            <div className="py-16 text-center text-sm" style={{ color: "#A8B0AB" }}>
              {S.common.loading}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm" style={{ color: "#A8B0AB" }}>
              {S.users.emptyResult}
            </div>
          ) : (
            filtered.map((u) => {
              const initials = (u.fullName || u.username || S.users.initialsFallback).charAt(0);
              return (
                <div
                  key={u.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center px-5 py-4"
                  style={{ borderBottom: "1px solid #F3EFE3" }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shrink-0"
                      style={{ backgroundColor: "#4C8577", color: "#FBF7EF" }}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#2F3A36" }}>
                        {u.fullName || "—"}
                      </p>
                      <p className="text-xs mt-0.5" dir="ltr" style={{ color: "#A8B0AB" }}>
                        {u.email || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:w-52 shrink-0">
                    <div className="chips" style={{ color: "#4A5551" }}>
                      <p className="text-xs" style={{ color: "#A8B0AB" }}>
                        {S.users.tableHeaderUsername}
                      </p>
                      <p className="text-sm font-medium" dir="ltr" style={{ color: "#2F3A36" }}>
                        {u.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:w-40 shrink-0">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{
                        color: "#4C8577",
                        backgroundColor: "#4C857720",
                      }}
                    >
                      {ROLE_LABELS[u.roleType] || u.roleType}
                    </span>
                  </div>

                  <div className="sm:mr-auto shrink-0 flex items-center gap-2">
                    {u.roleType !== "admin" && (
                      <button
                        onClick={() => setResetTarget(u)}
                        title={S.users.resetButton}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
                        style={{ backgroundColor: "#FCFAF4", border: "1px solid #EDE7D9", color: "#4A5551" }}
                      >
                        <RotateCcw size={14} />
                        {S.users.resetButton}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <AddUserModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={handleCreated}
      />

      <ConfirmModal
        isOpen={!!resetTarget}
        title={S.users.confirmResetTitle}
        message={S.users.confirmResetMessage}
        confirmLabel={S.users.confirmResetLabel}
        variant="warning"
        onConfirm={handleReset}
        onCancel={() => setResetTarget(null)}
      />

      <TempPasswordModal
        isOpen={!!tempCreds}
        username={tempCreds?.username}
        tempPassword={tempCreds?.tempPassword}
        onClose={() => setTempCreds(null)}
      />
    </DashboardLayout>
  );
}