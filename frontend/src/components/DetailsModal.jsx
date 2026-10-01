import { strings as S } from "../constants/strings";
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
      className="modal-root"
      style={{ backgroundColor: "#00000040" }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-xl animate-in-scale"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EDE7D9",
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
              style={{
                backgroundColor: "#4C857720",
                color: "#4C8577",
              }}
            >
              {initials || S.detailsModal.unknownInitials}
            </div>

            <div className="min-w-0">
              <h3
                className="text-base font-bold break-words"
                style={{ color: "#2F3A36" }}
              >
                {title}
              </h3>

              <p
                className="text-xs mt-0.5 break-words"
                style={{ color: "#A8B0AB" }}
              >
                {subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={S.common.close}
            className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center hover:opacity-70"
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
                className="text-sm font-medium break-words"
                style={{ color: "#2F3A36" }}
              >
                {field.value || S.detailsModal.notSpecified}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl py-3 sm:py-2.5 mt-5 text-sm font-semibold"
          style={{
            backgroundColor: "#4C8577",
            color: "#FFFFFF",
          }}
        >
          {S.common.close}
        </button>
      </div>
    </div>
  );
}