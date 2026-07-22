import { useState } from "react";
import { X } from "lucide-react";

export default function ClassForm({ initialData = null, onClose, onSave }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    name: initialData?.name || "",
    teacher: initialData?.teacher || "",
    capacity: initialData?.capacity || "",
  });

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave && onSave(form);
  };

  return (
    <div dir="rtl" className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: "#00000040" }}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: "#2F3A36" }}>{isEdit ? "تعديل الصف" : "إضافة صف جديد"}</h3>
          <button onClick={onClose} style={{ color: "#A8B0AB" }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>اسم الصف</label>
            <input type="text" value={form.name} onChange={handleChange("name")} required
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>المعلمة المسؤولة</label>
            <input type="text" value={form.teacher} onChange={handleChange("teacher")} required
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>السعة القصوى</label>
            <input type="number" value={form.capacity} onChange={handleChange("capacity")} required
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
              style={{ border: "1px solid #E2DCCC", color: "#4A5551" }}>إلغاء</button>
            <button type="submit" className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "#4C8577" }}>{isEdit ? "حفظ التعديلات" : "إضافة"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
