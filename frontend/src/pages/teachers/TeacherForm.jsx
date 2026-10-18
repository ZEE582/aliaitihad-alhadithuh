import { useState, useEffect } from "react";
import { X, UserRound, BookOpen, School, Award, BadgeCheck } from "lucide-react";
import { strings as S } from "../../constants/strings";
import { api } from "../../services/api";

export default function TeacherForm({ initialData, onClose, onSave }) {
  const [form, setForm] = useState({
    F_name: initialData?.F_name || "",
    L_name: initialData?.L_name || "",
    specialty: initialData?.specialty || "",
    subject_id: initialData?.subjectId ?? "",
    T_Number: initialData?.T_Number || "",
    years_of_experience: initialData?.yearsOfExperience ?? "",
  });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get("/subjects");
        if (!cancelled && Array.isArray(data)) setSubjects(data);
      } catch (err) {
        console.error("API Fetch Subjects Error:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave?.({
      F_name: form.F_name.trim(),
      L_name: form.L_name.trim(),
      specialty: form.specialty.trim(),
      subject_id: form.subject_id === "" ? null : Number(form.subject_id),
      T_Number: form.T_Number.trim(),
      years_of_experience:
        form.years_of_experience === "" ? null : Number(form.years_of_experience),
    });
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
        className="w-full max-w-lg rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold" style={{ color: "#2F3A36" }}>
              {S.teachers.editTitle}
            </h3>
            <p className="text-xs mt-1" style={{ color: "#A8B0AB" }}>
              {initialData?.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-70"
            style={{ backgroundColor: "#FCFAF4", color: "#7A8580" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>
                <UserRound size={15} style={{ color: "#4C8577" }} />
                {S.teachers.fieldFirstName}
              </label>
              <input
                type="text"
                value={form.F_name}
                onChange={handleChange("F_name")}
                required
                className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>
                <UserRound size={15} style={{ color: "#4C8577" }} />
                {S.teachers.fieldLastName}
              </label>
              <input
                type="text"
                value={form.L_name}
                onChange={handleChange("L_name")}
                required
                className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>
              <Award size={15} style={{ color: "#4C8577" }} />
              {S.teachers.fieldSpecialty}
            </label>
            <input
              type="text"
              value={form.specialty}
              onChange={handleChange("specialty")}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>
              <BookOpen size={15} style={{ color: "#4C8577" }} />
              {S.teachers.fieldSubject}
            </label>
            <select
              value={form.subject_id}
              onChange={handleChange("subject_id")}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={inputStyle}
            >
              <option value="">{S.teachers.selectSubjectNone}</option>
              {subjects.map((subject) => (
                <option key={subject.SubjectID} value={subject.SubjectID}>
                  {subject.Subject_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>
                <BadgeCheck size={15} style={{ color: "#4C8577" }} />
                {S.teachers.fieldTNumber}
              </label>
              <input
                type="text"
                value={form.T_Number}
                onChange={handleChange("T_Number")}
                className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>
                <School size={15} style={{ color: "#4C8577" }} />
                {S.teachers.fieldYearsOfExperience}
              </label>
              <input
                type="number"
                min="0"
                value={form.years_of_experience}
                onChange={handleChange("years_of_experience")}
                className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
              style={{ border: "1px solid #E2DCCC", color: "#4A5551", backgroundColor: "#FFFFFF" }}
            >
              {S.common.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "#4C8577" }}
            >
              {S.teachers.saveEditButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
