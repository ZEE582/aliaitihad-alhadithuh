import { useState } from "react";
import {
  X,
  CalendarDays,
  Clock,
  BookOpen,
  School,
  UserRound,
} from "lucide-react";

import { strings as S } from "../../constants/strings";

const days = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
];

export default function SessionForm({
  initialData = null,
  onClose,
  onSave,
}) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    day: initialData?.day || days[0],
    time: initialData?.time || "",
    subject: initialData?.subject || "",
    classroom: initialData?.classroom || "",
    teacher: initialData?.teacher || "",
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
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
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
                <CalendarDays
                  size={22}
                  style={{ color: "#4C8577" }}
                />
              </div>

              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "#2F3A36" }}
                >
                  {isEdit
                    ? S.sessionForm.headerTitleEdit
                    : S.sessionForm.headerTitleAdd}
                </h3>

                <p
                  className="text-xs mt-1"
                  style={{ color: "#7A8580" }}
                >
                  {S.sessionForm.headerSubtitle}
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

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
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
              {S.sessionForm.previewLabel}
            </p>

            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "#EAF2EF",
                  color: "#4C8577",
                }}
              >
                <BookOpen size={19} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-bold truncate"
                  style={{ color: "#2F3A36" }}
                >
                  {form.subject || S.sessionForm.previewSubjectFallback}
                </p>

                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  <span
                    className="text-xs"
                    style={{ color: "#7A8580" }}
                  >
                    {form.day}
                  </span>

                  <span
                    className="text-xs"
                    style={{ color: "#7A8580" }}
                  >
                    {form.time || S.sessionForm.previewTimeFallback}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  <span
                    className="text-xs"
                    style={{ color: "#7A8580" }}
                  >
                    {form.classroom || S.sessionForm.previewClassroomFallback}
                  </span>

                  <span
                    className="text-xs"
                    style={{ color: "#7A8580" }}
                  >
                    {form.teacher || S.sessionForm.previewTeacherFallback}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Day */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                {S.sessionForm.labelDay}
              </label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                  style={{ color: "#A8B0AB" }}
                />

                <select
                  value={form.day}
                  onChange={handleChange("day")}
                  className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none appearance-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                {S.sessionForm.labelTime}
              </label>

              <div className="relative">
                <Clock
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3"
                  style={{ color: "#A8B0AB" }}
                />

                <input
                  type="text"
                  placeholder={S.sessionForm.placeholderTime}
                  value={form.time}
                  onChange={handleChange("time")}
                  required
                  className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                {S.sessionForm.labelSubject}
              </label>

              <div className="relative">
                <BookOpen
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3"
                  style={{ color: "#A8B0AB" }}
                />

                <input
                  type="text"
                  value={form.subject}
                  onChange={handleChange("subject")}
                  required
                  placeholder={S.sessionForm.placeholderSubject}
                  className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                />
              </div>
            </div>

            {/* Classroom */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                {S.sessionForm.labelClassroom}
              </label>

              <div className="relative">
                <School
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3"
                  style={{ color: "#A8B0AB" }}
                />

                <input
                  type="text"
                  value={form.classroom}
                  onChange={handleChange("classroom")}
                  required
                  placeholder={S.sessionForm.placeholderClassroom}
                  className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                />
              </div>
            </div>

            {/* Teacher */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                {S.sessionForm.labelTeacher}
              </label>

              <div className="relative">
                <UserRound
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3"
                  style={{ color: "#A8B0AB" }}
                />

                <input
                  type="text"
                  value={form.teacher}
                  onChange={handleChange("teacher")}
                  required
                  placeholder={S.sessionForm.placeholderTeacher}
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
              className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all hover:opacity-80"
              style={{
                border: "1px solid #E2DCCC",
                color: "#4A5551",
                backgroundColor: "#FFFFFF",
              }}
            >
              {S.sessionForm.cancelButton}
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#4C8577" }}
            >
              {isEdit
                ? S.sessionForm.submitEdit
                : S.sessionForm.submitAdd}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}