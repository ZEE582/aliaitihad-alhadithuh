import { useState } from "react";
import { X, CalendarClock } from "lucide-react";

import { useSubjects } from "../../context/SubjectsContext";
import { useClasses } from "../../context/ClassesContext";
import { useTeachers } from "../../context/TeachersContext";
import { strings as S } from "../../constants/strings";

const WEEKDAYS = [
  S.sessions.days.sunday,
  S.sessions.days.monday,
  S.sessions.days.tuesday,
  S.sessions.days.wednesday,
  S.sessions.days.thursday,
  S.sessions.days.friday,
  S.sessions.days.saturday,
];

const dayNameFromDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return WEEKDAYS[d.getDay()] || "";
};

export default function SessionForm({ initialData = null, onClose, onSave }) {
  const isEdit = !!initialData;

  const { subjectsList } = useSubjects();
  const { sectionsList } = useClasses();
  const { teachersList } = useTeachers();

  const [form, setForm] = useState({
    SubjectID: initialData?.subjectId ?? "",
    section_id: initialData?.sectionId ?? "",
    teacher_PersonID: initialData?.teacherId ?? "",
    Date: initialData?.date || "",
    Period: initialData?.period || "",
    Duration: initialData?.duration || "",
    Notes: initialData?.notes || "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.SubjectID || !form.section_id || !form.Date || !form.Period) return;

    if (onSave) {
      onSave({
        SubjectID: Number(form.SubjectID),
        section_id: Number(form.section_id),
        teacher_PersonID:
          form.teacher_PersonID === "" ? null : Number(form.teacher_PersonID),
        Date: form.Date,
        day: dayNameFromDate(form.Date),
        Period: form.Period.trim(),
        Duration: form.Duration.trim() || null,
        Notes: form.Notes.trim() || null,
      });
    }
  };

  const inputStyle = {
    border: "1px solid #E2DCCC",
    backgroundColor: "#FCFAF4",
    color: "#2F3A36",
  };
  const labelStyle = { color: "#2F3A36" };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "#00000040" }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
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
                <CalendarClock size={22} style={{ color: "#4C8577" }} />
              </div>

              <div>
                <h3 className="text-lg font-bold" style={{ color: "#2F3A36" }}>
                  {isEdit
                    ? S.sessionForm.headerTitleEdit
                    : S.sessionForm.headerTitleAdd}
                </h3>

                <p className="text-xs mt-1" style={{ color: "#7A8580" }}>
                  {S.sessionForm.headerSubtitle}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
                {S.sessionForm.labelSubject}
              </label>

              <select
                value={form.SubjectID}
                onChange={handleChange("SubjectID")}
                required
                className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                style={inputStyle}
              >
                <option value="">{S.sessionForm.placeholderSubjectSelect}</option>
                {subjectsList.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
                {S.sessionForm.labelSection}
              </label>

              <select
                value={form.section_id}
                onChange={handleChange("section_id")}
                required
                className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                style={inputStyle}
              >
                <option value="">{S.sessionForm.placeholderSectionSelect}</option>
                {sectionsList.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.className ? `${sec.name} — ${sec.className}` : sec.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
                {S.sessionForm.labelTeacher}
              </label>

              <select
                value={form.teacher_PersonID}
                onChange={handleChange("teacher_PersonID")}
                className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                style={inputStyle}
              >
                <option value="">{S.sessionForm.placeholderTeacherSelect}</option>
                {teachersList.map((t) => (
                  <option key={t.PersonID} value={t.PersonID}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
                {S.sessionForm.labelDate}
              </label>

              <input
                type="date"
                value={form.Date}
                onChange={handleChange("Date")}
                required
                className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
                {S.sessionForm.labelTime}
              </label>

              <input
                type="text"
                value={form.Period}
                onChange={handleChange("Period")}
                required
                placeholder={S.sessionForm.placeholderTime}
                className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
                {S.sessionForm.labelDuration}
              </label>

              <input
                type="text"
                value={form.Duration}
                onChange={handleChange("Duration")}
                placeholder={S.sessionForm.placeholderDuration}
                className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
              {S.sessionForm.labelNotes}
            </label>

            <textarea
              value={form.Notes}
              onChange={handleChange("Notes")}
              rows={3}
              placeholder={S.sessionForm.placeholderNotes}
              className="w-full rounded-xl py-3 px-3 text-sm outline-none resize-none"
              style={inputStyle}
            />
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
              {S.sessionForm.cancelButton}
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: "#4C8577" }}
            >
              {isEdit ? S.sessionForm.submitEdit : S.sessionForm.submitAdd}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
