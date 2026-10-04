import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldAlert, LogOut, CheckCircle } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function ChangePasswordModal() {
  const { user, changePassword, logout } = useUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("الرجاء ملء جميع الحقول");
      return;
    }

    if (newPassword.length < 6) {
      setError("يجب أن تتكون كلمة المرور الجديدة من 6 خانات على الأقل");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    if (currentPassword === newPassword) {
      setError("يجب أن تكون كلمة المرور الجديدة مختلفة عن كلمة المرور المؤقتة");
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || "فشل تغيير كلمة المرور، يرجى التأكد من كلمة المرور الحالية");
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn"
        style={{ border: "1px solid #EDE7D9" }}
      >
        {/* Header */}
        <div
          className="p-6 text-center"
          style={{
            backgroundColor: "#FCFAF4",
            borderBottom: "1px solid #EDE7D9",
          }}
        >
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-sm"
            style={{ backgroundColor: "#EAF2EF" }}
          >
            <ShieldAlert size={28} style={{ color: "#4C8577" }} />
          </div>

          <h2 className="text-xl font-bold" style={{ color: "#2F3A36" }}>
            تعيين كلمة مرور جديدة
          </h2>

          <p className="text-xs mt-1.5 leading-relaxed text-slate-500">
            مرحباً بك {user?.fullName || ""}! نظراً لأن هذا أول تسجيل دخول لك أو كلمة المرور مؤقتة، يرجى تعيين كلمة مرور جديدة لحماية حسابك لمتابعة استخدام النظام.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              className="rounded-xl p-3 text-xs leading-relaxed"
              style={{
                backgroundColor: "#C25B4A10",
                color: "#C25B4A",
                border: "1px solid #C25B4A25",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="rounded-xl p-3 text-xs leading-relaxed flex items-center gap-2"
              style={{
                backgroundColor: "#4C857715",
                color: "#4C8577",
                border: "1px solid #4C857730",
              }}
            >
              <CheckCircle size={16} />
              <span>تم تعيين كلمة المرور بنجاح! جاري الانتقال...</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#2F3A36" }}>
              كلمة المرور الحالية (المؤقتة)
            </label>
            <div className="relative">
              <Lock size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400" />
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الحالية"
                className="w-full rounded-xl py-2.5 pr-9 pl-9 text-xs outline-none transition"
                style={{
                  border: "1px solid #E2DCCC",
                  backgroundColor: "#FCFAF4",
                  color: "#2F3A36",
                }}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#2F3A36" }}>
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <Lock size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400" />
              <input
                type={showNew ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="6 خانات على الأقل"
                className="w-full rounded-xl py-2.5 pr-9 pl-9 text-xs outline-none transition"
                style={{
                  border: "1px solid #E2DCCC",
                  backgroundColor: "#FCFAF4",
                  color: "#2F3A36",
                }}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#2F3A36" }}>
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <Lock size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400" />
              <input
                type={showConfirm ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد كتابة كلمة المرور الجديدة"
                className="w-full rounded-xl py-2.5 pr-9 pl-9 text-xs outline-none transition"
                style={{
                  border: "1px solid #E2DCCC",
                  backgroundColor: "#FCFAF4",
                  color: "#2F3A36",
                }}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 space-y-2">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full rounded-xl py-2.5 text-xs font-bold text-white transition disabled:opacity-60 shadow-sm"
              style={{ backgroundColor: "#4C8577" }}
            >
              {loading ? "جاري الحفظ..." : "حفظ كلمة المرور والدخول"}
            </button>

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-500 hover:text-red-600 transition"
            >
              <LogOut size={14} />
              <span>تسجيل الخروج والعودة لاحقاً</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
