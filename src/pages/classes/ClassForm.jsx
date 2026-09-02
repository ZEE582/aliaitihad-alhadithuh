import { useState } from "react";
import {
  X,
  School,
  UserRound,
  Users,
} from "lucide-react";

export default function ClassForm({
  initialData = null,
  onClose,
  onSave,
}) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    teacher: initialData?.teacher || "",
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
                <School
                  size={22}
                  style={{ color: "#4C8577" }}
                />
              </div>

              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "#2F3A36" }}
                >
                  {isEdit ? "تعديل بيانات الصف" : "إضافة صف جديد"}
                </h3>

                <p
                  className="text-xs mt-1"
                  style={{ color: "#7A8580" }}
                >
                  {isEdit
                    ? "حدّثي بيانات الصف ثم احفظي التغييرات"
                    : "أضيفي صفًا جديدًا إلى فصول الروضة"}
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
              معاينة الصف
            </p>

            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#EAF2EF" }}
              >
                <School
                  size={19}
                  style={{ color: "#4C8577" }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-bold truncate"
                  style={{ color: "#2F3A36" }}
                >
                  {form.name || "اسم الصف"}
                </p>

                <div className="flex flex-wrap gap-3 mt-1">
                  <span
                    className="text-xs flex items-center gap-1"
                    style={{ color: "#7A8580" }}
                  >
                    <UserRound size={12} />
                    {form.teacher || "المعلمة المسؤولة"}
                  </span>

                  <span
                    className="text-xs flex items-center gap-1"
                    style={{ color: "#7A8580" }}
                  >
                    <Users size={12} />
                    {form.capacity
                      ? `${form.capacity} طفل`
                      : "السعة القصوى"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                اسم الصف
              </label>

              <div className="relative">
                <School
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3"
                  style={{ color: "#A8B0AB" }}
                />

                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                  placeholder="مثال: صف الفراشات"
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
                المعلمة المسؤولة
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
                  placeholder="مثال: أ. سارة الحاج"
                  className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                  style={{
                    border: "1px solid #E2DCCC",
                    backgroundColor: "#FCFAF4",
                    color: "#2F3A36",
                  }}
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#2F3A36" }}
              >
                السعة القصوى
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
                  required
                  placeholder="مثال: 20"
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
              إلغاء
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#4C8577" }}
            >
              {isEdit ? "حفظ التعديلات" : "إنشاء الصف"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}