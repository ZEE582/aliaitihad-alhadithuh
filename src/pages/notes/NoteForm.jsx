import { useState } from "react";
import { X } from "lucide-react";
import { useChildren } from "../../context/ChildrenContext";

const noteTypes = ["إيجابي", "ملاحظة", "تنبيه"];

export default function NoteForm({
  initialData = null,
  initialChildName = "",
  onClose,
  onSave,
}) {
  const { childrenList } = useChildren();

  const isEdit = !!initialData;

  const defaultChild =
    initialChildName ||
    initialData?.childName ||
    childrenList[0]?.name ||
    "";

  const [form, setForm] = useState({
    childName: defaultChild,
    type: initialData?.type || noteTypes[0],
    text: initialData?.text || "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.childName || !form.text.trim()) {
      return;
    }

    onSave && onSave(form);
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{
        backgroundColor: "#00000040",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-lg font-bold"
            style={{
              color: "#2F3A36",
            }}
          >
            {isEdit
              ? "تعديل ملاحظة الطفل"
              : "إضافة ملاحظة عن طفل"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            style={{
              color: "#A8B0AB",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Child */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{
                color: "#2F3A36",
              }}
            >
              اسم الطفل
            </label>

            {childrenList.length === 0 ? (
              <p
                className="text-xs"
                style={{
                  color: "#C25B4A",
                }}
              >
                لا يوجد أطفال مسجلين بعد. أضيفي طفل أول من صفحة الأطفال.
              </p>
            ) : (
              <select
                value={form.childName}
                onChange={handleChange("childName")}
                className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                style={{
                  border: "1px solid #E2DCCC",
                  backgroundColor: "#FCFAF4",
                  color: "#2F3A36",
                }}
              >
                {childrenList.map((child) => (
                  <option
                    key={child.id}
                    value={child.name}
                  >
                    {child.name} — {child.classroom}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Type */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{
                color: "#2F3A36",
              }}
            >
              نوع الملاحظة
            </label>

            <select
              value={form.type}
              onChange={handleChange("type")}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            >
              {noteTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Text */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{
                color: "#2F3A36",
              }}
            >
              نص الملاحظة
            </label>

            <textarea
              value={form.text}
              onChange={handleChange("text")}
              required
              rows={4}
              placeholder="اكتبي ملاحظة عن الطفل..."
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none resize-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
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
              disabled={childrenList.length === 0}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{
                backgroundColor: "#4C8577",
              }}
            >
              {isEdit
                ? "حفظ التعديلات"
                : "إضافة الملاحظة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}