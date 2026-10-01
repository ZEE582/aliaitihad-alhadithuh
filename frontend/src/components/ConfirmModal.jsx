import { strings as S } from "../constants/strings";
import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

export default function ConfirmModal({ isOpen, title, message, confirmLabel = S.confirmModal.confirmDeleteDefault, cancelLabel = S.confirmModal.cancelDefault, variant = "danger", onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (isOpen && cancelRef.current) cancelRef.current.focus();
  }, [isOpen]);

  // close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const colors = variant === "danger"
    ? { icon: "bg-red-100 text-red-600", btn: "bg-red-600 hover:bg-red-700 focus:ring-red-500" }
    : { icon: "bg-yellow-100 text-yellow-600", btn: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500" };

  return (
    <div className="modal-root" dir="rtl">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 sm:p-6 animate-in-scale">
        {/* close button */}
        <button
          onClick={onCancel}
          className="absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          aria-label={S.common.close}
        >
          ×
        </button>

        {/* icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colors.icon}`}>
            <Trash2 className="w-7 h-7" />
          </div>
        </div>

        {/* title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-2 break-words">
          {title}
        </h3>

        {/* message */}
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-6 break-words">
          {message}
        </p>

        {/* actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 px-4 py-3 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 sm:py-2.5 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}