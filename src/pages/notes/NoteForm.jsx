import { useState } from "react";
import { X } from "lucide-react";
import { useChildren } from "../../context/ChildrenContext";

const noteTypes = ["إيجابي", "ملاحظة", "تنبيه"];

export default function NoteForm({ initialData = null, onClose, onSave }) {
  const { childrenList } = useChildren(); // نفس قائمة الأطفال الحقيقية من كل التطبيق
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    childName: initialData?.childName || (childrenList[0]?.name || ""),
    type: initialData?.type || noteTypes[0],
    text: initialData?.text || "",
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
          <h3 className="text-lg font-bold" style={{ color: "#2F3A36" }}>{isEdit ? "تعديل الملاحظة" : "إضافة ملاحظة جديدة"}</h3>
          <button onClick={onClose} style={{ color: "#A8B0AB" }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>اسم الطفل</label>
            {childrenList.length === 0 ? (
              <p className="text-xs" style={{ color: "#C25B4A" }}>
                لا يوجد أطفال مسجلين بعد. أضيفي طفل أول من صفحة الأطفال.
              </p>
            ) : (
              <select
                value={form.childName}
                onChange={handleChange("childName")}
                className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }}
              >
                {childrenList.map((c) => (
                  <option key={c.id} value={c.name}>{c.name} — {c.classroom}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>نوع الملاحظة</label>
            <select value={form.type} onChange={handleChange("type")}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }}>
              {noteTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>نص الملاحظة</label>
            <textarea value={form.text} onChange={handleChange("text")} required rows={4}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none resize-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
              style={{ border: "1px solid #E2DCCC", color: "#4A5551" }}>إلغاء</button>
            <button type="submit" disabled={childrenList.length === 0} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "#4C8577" }}>{isEdit ? "حفظ التعديلات" : "إضافة"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}