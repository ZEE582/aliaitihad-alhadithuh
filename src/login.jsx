import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import RegistrationForm from "./pages/registration-requests/RegistrationForm";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("admin");

  // هل المستخدم داخل على استمارة ولي الأمر الجديد？
  const [showRegistrationForm, setShowRegistrationForm] =
    useState(false);

  const roles = [
    { key: "admin", label: "مدير/ة" },
    { key: "secretary", label: "سكرتير/ة" },
    { key: "teacher", label: "معلم/ة" },
    { key: "parent", label: "ولي أمر" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);

    // مؤقتًا لحد ما نربط الـ API
    setTimeout(() => {
      setLoading(false);

      console.log("تسجيل الدخول:", {
        email,
        password,
        remember,
        role: selectedRole,
      });

      onLoginSuccess &&
        onLoginSuccess(selectedRole);
    }, 900);
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
            روضة الاتحاد الحديثة
          </h1>

          <p
            className="text-sm mt-1"
            style={{ color: "#7A8580" }}
          >
            نظام إدارة الروضة
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
              اختيار الدور
          ========================================== */}

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              الدخول كـ
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roles.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r.key);
                    setError("");
                  }}
                  className="rounded-xl py-2 text-xs font-semibold transition"
                  style={{
                    backgroundColor:
                      selectedRole === r.key
                        ? "#4C8577"
                        : "#FCFAF4",

                    color:
                      selectedRole === r.key
                        ? "#FBF7EF"
                        : "#4A5551",

                    border: `1px solid ${
                      selectedRole === r.key
                        ? "#4C8577"
                        : "#E2DCCC"
                    }`,
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* ==========================================
              البريد الإلكتروني
          ========================================== */}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: "#2F3A36" }}
            >
              البريد الإلكتروني
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
                placeholder="example@email.com"
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
                كلمة المرور
              </label>

              <button
                type="button"
                className="text-xs font-medium"
                style={{ color: "#4C8577" }}
              >
                نسيت كلمة المرور؟
              </button>

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
                placeholder="••••••••"
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
                    ? "إخفاء كلمة المرور"
                    : "إظهار كلمة المرور"
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

            تذكرني على هذا الجهاز
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
              ? "جارٍ تسجيل الدخول..."
              : "تسجيل الدخول"}
          </button>

          {/* ==========================================
              ولي أمر جديد
              يظهر فقط عند اختيار ولي أمر
          ========================================== */}

          {selectedRole === "parent" && (
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
                  أول مرة تستخدم النظام؟
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
                  ولي أمر جديد؟ قدّم طلب تسجيل طفل
                  <ArrowRight size={16} />
                </button>

              </div>
            </div>
          )}

        </form>

        {/* ==========================================
            المساعدة
        ========================================== */}

        <p
          className="text-center text-sm mt-6 leading-6"
          style={{ color: "#7A8580" }}
        >
          واجهت مشكلة بتسجيل الدخول؟
          <br />
          تواصلوا مع إدارة الروضة
        </p>

      </div>
    </div>
  );
}