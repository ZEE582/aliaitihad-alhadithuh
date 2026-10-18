import { useState } from "react";
import { X, Layers, UserRound, Users, School, GraduationCap } from "lucide-react";

import { strings as S } from "../../constants/strings";

export default function SectionForm({
  initialData = null,
  classes = [],
  teachers = [],
  onClose,
  onSave,
}) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    sectionName: initialData?.name || "",
    nameLevel: initialData?.nameLevel || "",
    level: initialData?.level || "",
    classID: initialData?.classID ? String(initialData.classID) : "",
    teacherId:
      initialData?.teacherId !== null && initialData?.teacherId !== undefined
        ? String(initialData.teacherId)
        : "",
    capacity: initialData?.capacity || "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave &&
      onSave({
        SectionName: form.sectionName.trim(),
        Name_level: form.nameLevel.trim(),
        Level: form.level.trim() || null,
        Capacity: form.capacity ? Number(form.capacity) : null,
        classID: Number(form.classID),
        assigned_teacher_id: form.teacherId === "" ? null : Number(form.teacherId),
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
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: "#00000040" }}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 20px 60px rgba(47,58,54,0.15)",
        }}
      >
        <div
          className="p-6"
          style={{ backgroundColor: "#FCFAF4", borderBottom: "1px solid #EDE7D9" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#EAF2EF" }}
              >
                <Layers size={22} style={{ color: "#4C8577" }} />
              </div>

              <div>
                <h3 className="text-lg font-bold" style={{ color: "#2F3A36" }}>
                  {S.sectionForm.title(isEdit ? "edit" : "add")}
                </h3>

                <p className="text-xs mt-1" style={{ color: "#7A8580" }}>
                  {S.sectionForm.subtitle}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#2F3A36" }}>
              {S.sectionForm.labelSectionName}
            </label>
            <div className="relative">
              <Layers
                size={16}
                className="absolute top-1/2 -translate-y-1/2 right-3"
                style={{ color: "#A8B0AB" }}
              />
              <input
                type="text"
                value={form.sectionName}
                onChange={handleChange("sectionName")}
                required
                placeholder={S.sectionForm.sectionNamePlaceholder}
                className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#2F3A36" }}>
              {S.sectionForm.labelNameLevel}
            </label>
            <div className="relative">
              <GraduationCap
                size={16}
                className="absolute top-1/2 -translate-y-1/2 right-3"
                style={{ color: "#A8B0AB" }}
              />
              <input
                type="text"
                value={form.nameLevel}
                onChange={handleChange("nameLevel")}
                required
                placeholder={S.sectionForm.nameLevelPlaceholder}
                className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#2F3A36" }}>
                {S.sectionForm.labelClass}
              </label>
              <div className="relative">
                <School
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3"
                  style={{ color: "#A8B0AB" }}
                />
                <select
                  value={form.classID}
                  onChange={handleChange("classID")}
                  required
                  className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none appearance-none"
                  style={inputStyle}
                >
                  <option value="">{S.sectionForm.classPlaceholder}</option>
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#2F3A36" }}>
                {S.sectionForm.labelLevel}
              </label>
              <input
                type="text"
                value={form.level}
                onChange={handleChange("level")}
                placeholder={S.sectionForm.levelPlaceholder}
                className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#2F3A36" }}>
              {S.sectionForm.labelTeacher}
            </label>
            <div className="relative">
              <UserRound
                size={16}
                className="absolute top-1/2 -translate-y-1/2 right-3"
                style={{ color: "#A8B0AB" }}
              />
              <select
                value={form.teacherId}
                onChange={handleChange("teacherId")}
                className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none appearance-none"
                style={inputStyle}
              >
                <option value="">{S.sectionForm.teacherNone}</option>
                {teachers.map((teacher) => (
                  <option key={teacher.PersonID} value={teacher.PersonID}>
                    {teacher.person?.Name ||
                      [teacher.F_name, teacher.S_name, teacher.Th_name, teacher.L_name]
                        .filter(Boolean)
                        .join(" ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#2F3A36" }}>
              {S.sectionForm.labelCapacity}
            </label>
            <div className="relative">
              <Users
                size={16}
                className="absolute top-1/2 -translate-y-1/2 right-3"
                style={{ color: "#A8B0AB" }}
              />
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={handleChange("capacity")}
                placeholder={S.sectionForm.capacityPlaceholder}
                className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
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
              {S.sectionForm.cancelButton}
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#4C8577" }}
            >
              {S.sectionForm.submitButton(isEdit ? "edit" : "add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
