import { useState } from "react";
import { X, BookOpen } from "lucide-react";

import { strings as S } from "../../constants/strings";

export default function SubjectForm({ initialData = null, onClose, onSave }) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    Subject_name: initialData?.Subject_name || initialData?.name || "",
    level: initialData?.level || "",
    semester: initialData?.semester || "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        Subject_name: form.Subject_name.trim(),
        level: form.level.trim(),
        semester: form.semester.trim(),
      });
    }
  };

  const inputStyle = {
    border: "1px solid #E2DCCC",
    backgroundColor: "#FCFAF4",
    color: "#2F3A36",
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "#00000040" }}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 20px 60px rgba(47,58,54,0.15)",
        }}
      >
        <div
          className="p-6 sticky top-0 z-10"
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
                <BookOpen size={22} style={{ color: "#4C8577" }} />
              </div>

              <div>
                <h3 className="text-lg font-bold" style={{ color: "#2F3A36" }}>
                  {S.subjectForm.title(isEdit ? "edit" : "add")}
                </h3>

                <p className="text-xs mt-1" style={{ color: "#7A8580" }}>
                  {S.subjectForm.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-70"
              style={{ color: "#A8B0AB", backgroundColor: "#FFFFFF" }}
            >
              <X size={19} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label
              className="block text-sm font-semibold mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              {S.subjectForm.labelSubjectName}
            </label>

            <input
              type="text"
              value={form.Subject_name}
              onChange={handleChange("Subject_name")}
              required
              placeholder={S.subjectForm.subjectNamePlaceholder}
              className="w-full rounded-xl py-3 px-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                {S.subjectForm.labelLevel}
              </label>

              <input
                type="text"
                value={form.level}
                onChange={handleChange("level")}
                required
                placeholder={S.subjectForm.levelPlaceholder}
                className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                {S.subjectForm.labelSemester}
              </label>

              <input
                type="text"
                value={form.semester}
                onChange={handleChange("semester")}
                required
                placeholder={S.subjectForm.semesterPlaceholder}
                className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-3 text-sm font-semibold"
              style={{
                border: "1px solid #E2DCCC",
                color: "#4A5551",
                backgroundColor: "#FFFFFF",
              }}
            >
              {S.subjectForm.cancelButton}
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: "#4C8577" }}
            >
              {S.subjectForm.submitButton(isEdit ? "edit" : "add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
