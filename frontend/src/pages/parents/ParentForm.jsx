import { useState } from "react";
import {
  X,
  UserRound,
  Phone,
  Mail,
  Users,
} from "lucide-react";

import { strings as S } from "../../constants/strings";

export default function ParentForm({ initialData = null, onClose, onSave }) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    childrenNames: initialData?.childrenNames || "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave && onSave(form);
  };

  return (
    <div
      dir="rtl"
      className="modal-root"
      style={{ backgroundColor: "#00000040" }}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden"
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
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#EAF2EF" }}
              >
                <UserRound size={22} style={{ color: "#4C8577" }} />
              </div>

              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "#2F3A36" }}
                >
                  {isEdit
                    ? S.parentForm.headerEditTitle
                    : S.parentForm.headerAddTitle}
                </h3>

                <p
                  className="text-xs mt-1"
                  style={{ color: "#7A8580" }}
                >
                  {isEdit
                    ? S.parentForm.headerEditSubtitle
                    : S.parentForm.headerAddSubtitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
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

        <form onSubmit={handleSubmit} className="p-6">
          {/* Preview */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{
              backgroundColor: "#F4F8F7",
              border: "1px solid #E2ECE8",
            }}
          >
            <p
              className="text-[11px] font-semibold mb-3"
              style={{ color: "#7A8580" }}
            >
              {S.parentForm.previewLabel}
            </p>

            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-base font-bold"
                style={{
                  backgroundColor: "#4C8577",
                  color: "#FBF7EF",
                }}
              >
                {form.name?.charAt(0) || S.common.fallbackInitial}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-bold truncate"
                  style={{ color: "#2F3A36" }}
                >
                  {form.name || S.parentForm.previewNameFallback}
                </p>

                <div className="flex flex-wrap gap-3 mt-1">
                  <span
                    className="text-xs flex items-center gap-1"
                    style={{ color: "#7A8580" }}
                  >
                    <Phone size={12} />
                    {form.phone || S.parentForm.previewPhoneFallback}
                  </span>

                  <span
                    className="text-xs flex items-center gap-1"
                    style={{ color: "#7A8580" }}
                  >
                    <Users size={12} />
                    {form.childrenNames || S.parentForm.previewChildrenFallback}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="parent-name"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                {S.parentForm.labelFullName}
              </label>

              <div className="relative">
                <UserRound
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3"
                  style={{ color: "#A8B0AB" }}
                />

                <input
                  id="parent-name"
                  name="parent-name"
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                  placeholder={S.parentForm.namePlaceholder}
                  autoComplete="name"
                  className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="parent-phone"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                {S.parentForm.labelPhone}
              </label>

              <div className="relative">
                <Phone
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3"
                  style={{ color: "#A8B0AB" }}
                />

                <input
                  id="parent-phone"
                  name="parent-phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  required
                  dir="ltr"
                  placeholder="059XXXXXXX"
                  autoComplete="tel"
                  className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="parent-email"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                {S.parentForm.labelEmail}
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3"
                  style={{ color: "#A8B0AB" }}
                />

                <input
                  id="parent-email"
                  name="parent-email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  dir="ltr"
                  placeholder="example@email.com"
                  autoComplete="email"
                  className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                />
              </div>
            </div>

            {/* Children */}
            <div>
              <label
                htmlFor="parent-children"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                {S.parentForm.labelChildren}
              </label>

              <div className="relative">
                <Users
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3"
                  style={{ color: "#A8B0AB" }}
                />

                <input
                  id="parent-children"
                  name="parent-children"
                  type="text"
                  value={form.childrenNames}
                  onChange={handleChange("childrenNames")}
                  required
                  placeholder={S.parentForm.childrenPlaceholder}
                  autoComplete="off"
                  className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-3 text-sm font-semibold hover:opacity-80"
              style={{
                border: "1px solid #E2DCCC",
                color: "#4A5551",
                backgroundColor: "#FFFFFF",
              }}
            >
              {S.parentForm.cancelButton}
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-semibold text-white hover:opacity-90"
              style={{ backgroundColor: "#4C8577" }}
            >
              {isEdit ? S.parentForm.submitEditLabel : S.parentForm.submitAddLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}