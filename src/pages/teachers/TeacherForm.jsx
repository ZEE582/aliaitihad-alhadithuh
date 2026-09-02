import { useState } from "react";
import { X, UserRound, Phone, BookOpen, School, CalendarDays } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
              {isEdit ? "تعديل بيانات المعلم" : "إضافة معلم جديد"}
            </h3>

            <p
              className="text-xs mt-1"
              style={{ color: "#A8B0AB" }}
            >
              {isEdit
                ? "حدّث بيانات المعلم والمواد والصفوف المسندة إليه"
                : "أدخل بيانات المعلم وتوزيعه داخل الروضة"}
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

          {/* الاسم */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              <UserRound size={15} style={{ color: "#4C8577" }} />
              الاسم الكامل
            </label>

            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="مثال: نور أحمد"
              required
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            />
          </div>

          {/* الهاتف */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              <Phone size={15} style={{ color: "#4C8577" }} />
              رقم الهاتف
            </label>

            <input
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="05XXXXXXXX"
              required
              dir="ltr"
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            />
          </div>

          {/* المواد */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              <BookOpen size={15} style={{ color: "#4C8577" }} />
              المواد التي يدرّسها
            </label>

            <input
              type="text"
              value={form.subject}
              onChange={handleChange("subject")}
              placeholder="مثال: الرياضيات، اللغة العربية"
              required
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
              يمكنك إدخال أكثر من مادة وفصل بينها بفاصلة
            </p>
          </div>

          {/* الصفوف */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              <School size={15} style={{ color: "#4C8577" }} />
              الصفوف التي يدرّسها
            </label>

            <input
              type="text"
              value={form.classroom}
              onChange={handleChange("classroom")}
              placeholder="مثال: الفراشات، النجوم"
              required
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
              الصفوف التي تم إسناد حصص لهذا المعلم فيها
            </p>
          </div>

          {/* الحصص الأسبوعية */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              <CalendarDays size={15} style={{ color: "#4C8577" }} />
              عدد الحصص الأسبوعية
            </label>

            <input
              type="number"
              min="0"
              value={form.weeklyLessons}
              onChange={handleChange("weeklyLessons")}
              placeholder="مثال: 8"
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
              إجمالي الحصص المسندة للمعلم خلال الأسبوع
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
              إلغاء
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "#4C8577" }}
            >
              {isEdit ? "حفظ التعديلات" : "إضافة المعلم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}