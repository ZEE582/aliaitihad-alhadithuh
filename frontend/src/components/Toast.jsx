import { strings as S } from "../constants/strings";
import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: "bg-green-50 border-green-400 text-green-800",
  error:   "bg-red-50 border-red-400 text-red-800",
  warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
  info:    "bg-blue-50 border-blue-400 text-blue-800",
};

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // animate in
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const Icon = ICONS[toast.type] || ICONS.info;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 mb-2 rounded-lg border-r-4 shadow-md
        transition-all duration-300 ease-in-out
        ${COLORS[toast.type] || COLORS.info}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
      `}
      dir="rtl"
    >
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
        aria-label={S.toast.closeNotificationAria}
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div
      className="fixed top-3 left-3 right-3 sm:left-4 sm:right-auto sm:top-4 z-50 w-auto sm:w-80 max-w-full pointer-events-none"
      style={{
        marginTop:
          "env(safe-area-inset-top, 0px)",
      }}
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            toast={toast}
            onRemove={removeToast}
          />
        </div>
      ))}
    </div>
  );
}