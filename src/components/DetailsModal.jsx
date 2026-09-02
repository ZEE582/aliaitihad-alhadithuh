import { X } from "lucide-react";

export default function DetailsModal({
  title,
  subtitle,
  initials,
  fields = [],
  onClose,
}) {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "#00000040" }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 shadow-xl"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EDE7D9",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold"
              style={{
                backgroundColor: "#4C857720",
                color: "#4C8577",
              }}
            >
              {initials || "؟"}
            </div>

            <div>
              <h3
                className="text-base font-bold"
                style={{ color: "#2F3A36" }}
              >
                {title}
              </h3>

              <p
                className="text-xs mt-0.5"
                style={{ color: "#A8B0AB" }}
              >
                {subtitle}
              </p>
            </div>
          </div>

          <button
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

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={`${field.label}-${index}`}
              className="rounded-xl px-4 py-3"
              style={{
                backgroundColor: "#FCFAF4",
                border: "1px solid #F3EFE3",
              }}
            >
              <p
                className="text-xs mb-1"
                style={{ color: "#A8B0AB" }}
              >
                {field.label}
              </p>

              <p
                className="text-sm font-medium"
                style={{ color: "#2F3A36" }}
              >
                {field.value || "غير محدد"}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl py-2.5 mt-5 text-sm font-semibold"
          style={{
            backgroundColor: "#4C8577",
            color: "#FFFFFF",
          }}
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}