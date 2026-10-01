import { useState } from "react";
import { X, UserRound, Phone, BookOpen, School, CalendarDays } from "lucide-react";
import { strings as S } from "../../constants/strings";

export default function TeacherForm({ initialData = null, onClose, onSave }) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    subject: initialData?.subject || "",
    classroom: initialData?.classroom || "",
    weeklyLessons: initialData?.weeklyLessons || "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave?.({
      ...form,
      weeklyLessons: Number(form.weeklyLessons) || 0,
    });
  };

  return (
    <div
      dir="rtl"
      className="modal-root"
      style={{ backgroundColor: "#00000040" }}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-6 shadow-xl"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EDE7D9",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className="text-lg font-bold"
              style={{ color: "#2F3A36" }}
            >
              {isEdit ? S.teacherForm.headerEditTitle : S.teacherForm.headerAddTitle}
            </h3>

            <p
              className="text-xs mt-1"
              style={{ color: "#A8B0AB" }}
            >
              {isEdit
                ? S.teacherForm.headerEditSubtitle
                : S.teacherForm.headerAddSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-70"
            style={{
              backgroundColor: "#FCFAF4",
              color: "#7A8580",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ط§ظ„ط§ط³ظ… */}
          <div>
            <label
              htmlFor="teacher-name"
              className="flex items-center gap-2 text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              <UserRound size={15} style={{ color: "#4C8577" }} />
              {S.teacherForm.labelFullName}
            </label>

            <input
              id="teacher-name"
              name="teacher-name"
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder={S.teacherForm.namePlaceholder}
              required
              autoComplete="name"
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            />
          </div>

          {/* ط§ظ„ظ‡ط§طھظپ */}
          <div>
            <label
              htmlFor="teacher-phone"
              className="flex items-center gap-2 text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              <Phone size={15} style={{ color: "#4C8577" }} />
              {S.teacherForm.labelPhone}
            </label>

            <input
              id="teacher-phone"
              name="teacher-phone"
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="05XXXXXXXX"
              required
              autoComplete="tel"
              dir="ltr"
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            />
          </div>

          {/* ط§ظ„ظ…ظˆط§ط¯ */}
          <div>
            <label
              htmlFor="teacher-subject"
              className="flex items-center gap-2 text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              <BookOpen size={15} style={{ color: "#4C8577" }} />
              {S.teacherForm.labelSubjects}
            </label>

            <input
              id="teacher-subject"
              name="teacher-subject"
              type="text"
              value={form.subject}
              onChange={handleChange("subject")}
              placeholder={S.teacherForm.subjectsPlaceholder}
              required
              autoComplete="off"
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            />

            <p
              className="text-[11px] mt-1.5"
              style={{ color: "#A8B0AB" }}
            >
              {S.teacherForm.subjectsHint}
            </p>
          </div>

          {/* ط§ظ„طµظپظˆظپ */}
          <div>
            <label
              htmlFor="teacher-classroom"
              className="flex items-center gap-2 text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              <School size={15} style={{ color: "#4C8577" }} />
              {S.teacherForm.labelClassrooms}
            </label>

            <input
              id="teacher-classroom"
              name="teacher-classroom"
              type="text"
              value={form.classroom}
              onChange={handleChange("classroom")}
              placeholder={S.teacherForm.classroomsPlaceholder}
              required
              autoComplete="off"
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            />

            <p
              className="text-[11px] mt-1.5"
              style={{ color: "#A8B0AB" }}
            >
              {S.teacherForm.classroomsHint}
            </p>
          </div>

          {/* ط§ظ„ط­طµطµ ط§ظ„ط£ط³ط¨ظˆط¹ظٹط© */}
          <div>
            <label
              htmlFor="teacher-weekly-lessons"
              className="flex items-center gap-2 text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              <CalendarDays size={15} style={{ color: "#4C8577" }} />
              {S.teacherForm.labelWeeklyLessons}
            </label>

            <input
              id="teacher-weekly-lessons"
              name="teacher-weekly-lessons"
              type="number"
              min="0"
              value={form.weeklyLessons}
              onChange={handleChange("weeklyLessons")}
              placeholder={S.teacherForm.weeklyLessonsPlaceholder}
              autoComplete="off"
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            />

            <p
              className="text-[11px] mt-1.5"
              style={{ color: "#A8B0AB" }}
            >
              {S.teacherForm.weeklyLessonsHint}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
              style={{
                border: "1px solid #E2DCCC",
                color: "#4A5551",
                backgroundColor: "#FFFFFF",
              }}
            >
              {S.teacherForm.cancelButton}
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "#4C8577" }}
            >
              {isEdit ? S.teacherForm.submitEditLabel : S.teacherForm.submitAddLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}