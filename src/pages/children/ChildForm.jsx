import { useState } from "react";
import { X, AlertCircle } from "lucide-react";

// الحد القانوني لعمر القبول بالروضة: من 3 سنين و8 أشهر لغاية 5 سنين بالضبط
const MIN_AGE_MONTHS = 3 * 12 + 8; // 44 شهر
const MAX_AGE_MONTHS = 5 * 12; // 60 شهر

function calculateAgeInMonths(birthDateStr) {
  if (!birthDateStr) return null;
  const birth = new Date(birthDateStr);
  const today = new Date();
  let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  if (today.getDate() < birth.getDate()) months -= 1;
  return months;
}

function formatAge(months) {
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years === 0) return `${remMonths} أشهر`;
  if (remMonths === 0) return `${years} سنوات`;
  return `${years} سنوات و${remMonths} أشهر`;
}

export default function ChildForm({ initialData = null, onClose, onSave }) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    classroom: initialData?.classroom || "",
    birthDate: initialData?.birthDate || "",
    parent: initialData?.parent || "",
  });

  const [ageError, setAgeError] = useState("");

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "birthDate") {
      validateAge(value);
    }
  };

  const validateAge = (birthDateStr) => {
    const months = calculateAgeInMonths(birthDateStr);
    if (months === null) {
      setAgeError("");
      return true;
    }
    if (months < MIN_AGE_MONTHS) {
      setAgeError(`عمر الطفل أقل من الحد القانوني للقبول (3 سنوات و8 أشهر). العمر الحالي: ${formatAge(months)}`);
      return false;
    }
    if (months > MAX_AGE_MONTHS) {
      setAgeError(`عمر الطفل أكبر من الحد القانوني للقبول (5 سنوات). العمر الحالي: ${formatAge(months)}`);
      return false;
    }
    setAgeError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAge(form.birthDate)) return;

    const months = calculateAgeInMonths(form.birthDate);
    const ageYears = months !== null ? Math.floor(months / 12) : "";

    onSave && onSave({ ...form, age: ageYears });
  };

  const currentMonths = calculateAgeInMonths(form.birthDate);

  return (
    <div
      dir="rtl"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: "#00000040" }}
    >
      <div className="w-full max-w-md rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: "#2F3A36" }}>
            {isEdit ? "تعديل بيانات الطفل" : "إضافة طفل جديد"}
          </h3>
          <button onClick={onClose} style={{ color: "#A8B0AB" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>
              اسم الطفل
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>
              الصف
            </label>
            <input
              type="text"
              value={form.classroom}
              onChange={handleChange("classroom")}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>
              تاريخ الميلاد
            </label>
            <input
              type="date"
              value={form.birthDate}
              onChange={handleChange("birthDate")}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: `1px solid ${ageError ? "#C25B4A" : "#E2DCCC"}`,
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
              required
            />
            {/* عرض العمر المحسوب تلقائياً، يساعد يلي بتعبي الفورم تتأكد بسرعة */}
            {currentMonths !== null && !ageError && (
              <p className="text-xs mt-1.5" style={{ color: "#7A8580" }}>
                العمر الحالي: {formatAge(currentMonths)}
              </p>
            )}
            {ageError && (
              <p className="text-xs mt-1.5 flex items-start gap-1.5" style={{ color: "#C25B4A" }}>
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                <span>{ageError}</span>
              </p>
            )}
            <p className="text-[11px] mt-1" style={{ color: "#A8B0AB" }}>
              العمر المقبول قانونياً: من 3 سنوات و8 أشهر إلى 5 سنوات
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>
              اسم ولي الأمر
            </label>
            <input
              type="text"
              value={form.parent}
              onChange={handleChange("parent")}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
              style={{ border: "1px solid #E2DCCC", color: "#4A5551" }}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!!ageError}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "#4C8577" }}
            >
              {isEdit ? "حفظ التعديلات" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}