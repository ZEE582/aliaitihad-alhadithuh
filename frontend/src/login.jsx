import { strings as S } from "./constants/strings";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import RegistrationForm from "./pages/registration-requests/RegistrationForm";
import { useUser } from "./context/UserContext";

export default function LoginPage() {
  const { loginWithCredentials } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // هل المستخدم داخل على استمارة ولي الأمر الجديد？
  const [showRegistrationForm, setShowRegistrationForm] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(S.login.missingCredentialsError);
      return;
    }

    setLoading(true);

    try {
      await loginWithCredentials(email, password);
    } catch (err) {
      setError(err.message || S.context.auth.loginFailedFallback);
      setLoading(false);
    }
  };

  // ==========================================
  // ولي أمر جديد → استمارة طلب التسجيل
  // ==========================================

  if (showRegistrationForm) {
    return (
      <RegistrationForm
        onBack={() => setShowRegistrationForm(false)}
        onSubmitted={() => {
          // بعد إرسال الطلب، RegistrationForm نفسها
          // تعرض رسالة نجاح، لذلك لا نغيّر الصفحة هنا.
        }}
      />
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{ backgroundColor: "#FBF7EF" }}
    >
      <div className="w-full max-w-sm">

        {/* ==========================================
            الشعار
        ========================================== */}

        <div className="flex flex-col items-center mb-8">

          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
            style={{ backgroundColor: "#4C8577" }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <circle
                cx="16"
                cy="10"
                r="5"
                fill="#FBF7EF"
              />

              <path
                d="M6 27C6 20.925 10.477 16 16 16C21.523 16 26 20.925 26 27"
                stroke="#FBF7EF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1
            className="text-xl font-bold"
            style={{ color: "#2F3A36" }}
          >
            {S.common.appName}
          </h1>

          <p
            className="text-sm mt-1"
            style={{ color: "#7A8580" }}
          >
            {S.login.appSubtitle}
          </p>
        </div>

        {/* ==========================================
            بطاقة تسجيل الدخول
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-5"
          style={{
            border: "1px solid #EDE7D9",
          }}
        >

          {/* ==========================================
              البريد الإلكتروني
          ========================================== */}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              {S.login.emailLabel}
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute top-1/2 -translate-y-1/2 right-3"
                style={{ color: "#A8B0AB" }}
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder={S.login.emailPlaceholder}
                className="w-full rounded-xl py-2.5 pr-10 pl-3 text-sm outline-none transition"
                style={{
                  border: "1px solid #E2DCCC",
                  backgroundColor: "#FCFAF4",
                  color: "#2F3A36",
                }}
                dir="ltr"
              />
            </div>
          </div>

          {/* ==========================================
              كلمة المرور
          ========================================== */}

          <div>
            <div className="flex items-center justify-between mb-1.5">

              <label
                htmlFor="password"
                className="block text-sm font-medium"
                style={{ color: "#2F3A36" }}
              >
                {S.login.passwordLabel}
              </label>

            </div>

            <div className="relative">

              <Lock
                size={18}
                className="absolute top-1/2 -translate-y-1/2 right-3"
                style={{ color: "#A8B0AB" }}
              />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder={S.login.passwordPlaceholder}
                className="w-full rounded-xl py-2.5 pr-10 pl-10 text-sm outline-none transition"
                style={{
                  border: "1px solid #E2DCCC",
                  backgroundColor: "#FCFAF4",
                  color: "#2F3A36",
                }}
                dir="ltr"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                className="absolute top-1/2 -translate-y-1/2 left-3"
                style={{ color: "#A8B0AB" }}
                aria-label={
                  showPassword
                    ? S.login.hidePasswordAria
                    : S.login.showPasswordAria
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {/* ==========================================
              الخطأ
          ========================================== */}

          {error && (
            <div
              className="rounded-xl px-3 py-2.5 text-sm"
              style={{
                backgroundColor: "#C25B4A10",
                color: "#C25B4A",
                border: "1px solid #C25B4A25",
              }}
            >
              {error}
            </div>
          )}

          {/* ==========================================
              تذكرني
          ========================================== */}

          <label
            className="flex items-center gap-2 text-sm cursor-pointer select-none"
            style={{ color: "#5B655F" }}
          >
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
              className="w-4 h-4 rounded"
              style={{
                accentColor: "#4C8577",
              }}
            />

            {S.login.rememberMe}
          </label>

          {/* ==========================================
              تسجيل الدخول
          ========================================== */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition disabled:opacity-70"
            style={{
              backgroundColor: "#4C8577",
            }}
          >
            {loading
              ? S.login.loginLoading
              : S.login.loginButton}
          </button>

          {/* ==========================================
              ولي أمر جديد
          ========================================== */}

          <div
            className="pt-4 mt-1"
            style={{
              borderTop: "1px solid #EDE7D9",
            }}
          >
            <div className="text-center">

              <p
                className="text-xs mb-2"
                style={{ color: "#7A8580" }}
              >
                {S.login.firstTimeMessage}
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowRegistrationForm(true)
                }
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition"
                style={{
                  backgroundColor: "#FCFAF4",
                  color: "#4C8577",
                  border: "1px solid #4C857750",
                }}
              >
                {S.login.newParentCta}
                <ArrowRight size={16} />
              </button>

            </div>
          </div>

        </form>

        {/* ==========================================
            المساعدة
        ========================================== */}

        <p
          className="text-center text-sm mt-6 leading-6"
          style={{ color: "#7A8580" }}
        >
          {S.login.loginHelp}
          <br />
          {S.login.contactAdmin}
        </p>

      </div>
    </div>
  );
}