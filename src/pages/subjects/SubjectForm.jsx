import { useState } from "react";
import {
  X,
  BookOpen,
  Users,
  CalendarDays,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";

import { strings as S } from "../../constants/strings";

const weekDays = [
  S.seed.days.sunday,
  S.seed.days.monday,
  S.seed.days.tuesday,
  S.seed.days.wednesday,
  S.seed.days.thursday,
];

const teachers = [
  S.seed.teachers.teacherSara,
  S.seed.teachers.teacherNoor,
  S.seed.teachers.teacherReem,
  S.seed.teachers.teacherLayan,
];

export default function SubjectForm({
  initialData = null,
  onClose,
  onSave,
}) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    weeklyClasses: initialData?.weeklyClasses || 1,
    teachers: initialData?.teachers || [],
    schedule: initialData?.schedule || [],
  });

  const [newClass, setNewClass] = useState({
    day: S.seed.days.sunday,
    from: "09:00",
    to: "09:30",
    teacher: teachers[0],
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleTeacherToggle = (teacher) => {
    setForm((prev) => ({
      ...prev,
      teachers: prev.teachers.includes(teacher)
        ? prev.teachers.filter((t) => t !== teacher)
        : [...prev.teachers, teacher],
    }));
  };

  const handleAddClass = () => {
    if (!newClass.day || !newClass.from || !newClass.to || !newClass.teacher) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { ...newClass, id: Date.now() }],
    }));
  };

  const handleRemoveClass = (id) => {
    setForm((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave &&
      onSave({
        ...form,
        weeklyClasses: Number(form.weeklyClasses),
      });
  };

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
        {/* Header */}
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
                <h3
                  className="text-lg font-bold"
                  style={{ color: "#2F3A36" }}
                >
                  {S.subjectForm.title(isEdit ? "edit" : "add")}
                </h3>

                <p
                  className="text-xs mt-1"
                  style={{ color: "#7A8580" }}
                >
                  {S.subjectForm.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={17} style={{ color: "#4C8577" }} />
              <h4
                className="text-sm font-bold"
                style={{ color: "#2F3A36" }}
              >
                {S.subjectForm.sectionBasicInfo}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: "#2F3A36" }}
                >
                  {S.subjectForm.labelSubjectName}
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                  placeholder={S.subjectForm.subjectNamePlaceholder}
                  className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: "#2F3A36" }}
                >
                  {S.subjectForm.labelWeeklyClasses}
                </label>

                <input
                  type="number"
                  min="1"
                  max="20"
                  value={form.weeklyClasses}
                  onChange={handleChange("weeklyClasses")}
                  required
                  className="w-full rounded-xl py-3 px-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                />
              </div>
            </div>
          </section>

          {/* Teachers */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users size={17} style={{ color: "#4C8577" }} />
              <h4
                className="text-sm font-bold"
                style={{ color: "#2F3A36" }}
              >
                {S.subjectForm.sectionTeachers}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {teachers.map((teacher) => {
                const selected = form.teachers.includes(teacher);

                return (
                  <button
                    key={teacher}
                    type="button"
                    onClick={() => handleTeacherToggle(teacher)}
                    className="flex items-center gap-3 rounded-xl p-3 text-right transition-all"
                    style={{
                      backgroundColor: selected
                        ? "#EAF2EF"
                        : "#FCFAF4",
                      border: selected
                        ? "1px solid #4C8577"
                        : "1px solid #E2DCCC",
                      color: "#2F3A36",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: selected
                          ? "#4C8577"
                          : "#E8ECEA",
                        color: selected ? "#FFFFFF" : "#7A8580",
                      }}
                    >
                      <Users size={15} />
                    </div>

                    <span className="text-sm font-medium">
                      {teacher}
                    </span>

                    {selected && (
                      <span
                        className="mr-auto text-xs font-semibold"
                        style={{ color: "#4C8577" }}
                      >
                        {S.subjectForm.teacherSelectedBadge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Schedule */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays size={17} style={{ color: "#4C8577" }} />
              <h4
                className="text-sm font-bold"
                style={{ color: "#2F3A36" }}
              >
                {S.subjectForm.sectionWeeklySchedule}
              </h4>
            </div>

            <div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: "#F4F8F7",
                border: "1px solid #E2ECE8",
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <select
                  value={newClass.day}
                  onChange={(e) =>
                    setNewClass((prev) => ({
                      ...prev,
                      day: e.target.value,
                    }))
                  }
                  className="rounded-xl py-2.5 px-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FFFFFF",
                    color: "#2F3A36",
                  }}
                >
                  {weekDays.map((day) => (
                    <option key={day}>{day}</option>
                  ))}
                </select>

                <input
                  type="time"
                  value={newClass.from}
                  onChange={(e) =>
                    setNewClass((prev) => ({
                      ...prev,
                      from: e.target.value,
                    }))
                  }
                  className="rounded-xl py-2.5 px-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FFFFFF",
                    color: "#2F3A36",
                  }}
                />

                <input
                  type="time"
                  value={newClass.to}
                  onChange={(e) =>
                    setNewClass((prev) => ({
                      ...prev,
                      to: e.target.value,
                    }))
                  }
                  className="rounded-xl py-2.5 px-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FFFFFF",
                    color: "#2F3A36",
                  }}
                />

                <select
                  value={newClass.teacher}
                  onChange={(e) =>
                    setNewClass((prev) => ({
                      ...prev,
                      teacher: e.target.value,
                    }))
                  }
                  className="rounded-xl py-2.5 px-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FFFFFF",
                    color: "#2F3A36",
                  }}
                >
                  {teachers.map((teacher) => (
                    <option key={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddClass}
                className="flex items-center gap-2 mt-3 rounded-xl px-4 py-2.5 text-sm font-semibold"
                style={{
                  backgroundColor: "#EAF2EF",
                  color: "#4C8577",
                }}
              >
                <Plus size={16} />
                {S.subjectForm.addClassToScheduleButton}
              </button>
            </div>

            {/* Added Classes */}
            {form.schedule.length > 0 && (
              <div className="mt-3 space-y-2">
                {form.schedule.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl p-3"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #EDE7D9",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#EAF2EF" }}
                    >
                      <Clock size={16} style={{ color: "#4C8577" }} />
                    </div>

                    <div className="flex-1">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#2F3A36" }}
                      >
                        {item.day}
                      </p>

                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#7A8580" }}
                      >
                        {S.subjectForm.scheduleItemDetail({
                          from: item.from,
                          to: item.to,
                          teacher: item.teacher,
                        })}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveClass(item.id)}
                      className="p-2 rounded-lg hover:opacity-70"
                      style={{ color: "#C25B4A" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Buttons */}
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