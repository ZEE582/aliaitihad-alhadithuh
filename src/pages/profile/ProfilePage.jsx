import { useState } from "react";
import {
  Mail,
  Phone,
  Shield,
  Pencil,
  UserRound,
  Check,
  X,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useUser } from "../../context/UserContext";

export default function ProfilePage({ onNavigate, onLogout }) {
  const { user, updateUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(user);
    setEditing(false);
  };

  const initial = user.name?.charAt(0) || "س";

  return (
    <DashboardLayout
      activePage="profile"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle="الملف الشخصي"
    >
      <div dir="rtl" className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
            boxShadow: "0 12px 35px rgba(47,58,54,0.06)",
          }}
        >
          {/* Soft Header */}
          <div
            className="h-28 relative"
            style={{
              background:
                "linear-gradient(135deg, #EAF2EF 0%, #F8F5EC 100%)",
            }}
          >
            <div
              className="absolute -bottom-8 right-6 w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-bold"
              style={{
                backgroundColor: "#4C8577",
                color: "#FBF7EF",
                border: "5px solid #FFFFFF",
                boxShadow: "0 8px 20px rgba(76,133,119,0.18)",
              }}
            >
              {initial}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 pt-12">
            {/* Profile Header */}
            <div className="flex items-start justify-between gap-4 mb-7">
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: "#2F3A36" }}
                >
                  {user.name}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: "#EAF2EF",
                      color: "#4C8577",
                    }}
                  >
                    {user.role}
                  </span>

                  <span
                    className="text-xs"
                    style={{ color: "#A8B0AB" }}
                  >
                    حساب المستخدم
                  </span>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={() => {
                    setForm(user);
                    setEditing(true);
                  }}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all hover:opacity-80"
                  style={{
                    color: "#4C8577",
                    backgroundColor: "#EAF2EF",
                  }}
                >
                  <Pencil size={15} />
                  تعديل
                </button>
              )}
            </div>

            {!editing ? (
              <>
                {/* Information Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor: "#FCFAF4",
                      border: "1px solid #EDE7D9",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: "#EAF2EF" }}
                      >
                        <Mail size={17} style={{ color: "#4C8577" }} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="text-xs mb-1"
                          style={{ color: "#A8B0AB" }}
                        >
                          البريد الإلكتروني
                        </p>

                        <p
                          dir="ltr"
                          className="text-sm font-medium truncate text-right"
                          style={{ color: "#2F3A36" }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor: "#FCFAF4",
                      border: "1px solid #EDE7D9",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: "#EAF2EF" }}
                      >
                        <Phone size={17} style={{ color: "#4C8577" }} />
                      </div>

                      <div>
                        <p
                          className="text-xs mb-1"
                          style={{ color: "#A8B0AB" }}
                        >
                          رقم الهاتف
                        </p>

                        <p
                          dir="ltr"
                          className="text-sm font-medium text-right"
                          style={{ color: "#2F3A36" }}
                        >
                          {user.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-4 sm:col-span-2"
                    style={{
                      backgroundColor: "#FCFAF4",
                      border: "1px solid #EDE7D9",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: "#EAF2EF" }}
                      >
                        <Shield size={17} style={{ color: "#4C8577" }} />
                      </div>

                      <div>
                        <p
                          className="text-xs mb-1"
                          style={{ color: "#A8B0AB" }}
                        >
                          تاريخ الانضمام
                        </p>

                        <p
                          className="text-sm font-medium"
                          style={{ color: "#2F3A36" }}
                        >
                          عضو منذ {user.joinDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Small Footer */}
                <div
                  className="flex items-center gap-2 mt-6 pt-5"
                  style={{
                    borderTop: "1px solid #F0ECE2",
                  }}
                >
                  <UserRound size={14} style={{ color: "#A8B0AB" }} />

                  <p
                    className="text-xs"
                    style={{ color: "#A8B0AB" }}
                  >
                    معلومات الحساب الشخصية
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: "#FCFAF4",
                    border: "1px solid #EDE7D9",
                  }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "#EAF2EF" }}
                    >
                      <Pencil size={15} style={{ color: "#4C8577" }} />
                    </div>

                    <div>
                      <h4
                        className="text-sm font-bold"
                        style={{ color: "#2F3A36" }}
                      >
                        تعديل معلومات الحساب
                      </h4>

                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#A8B0AB" }}
                      >
                        حدّثي البيانات ثم احفظي التغييرات
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-1.5"
                        style={{ color: "#2F3A36" }}
                      >
                        الاسم الكامل
                      </label>

                      <div className="relative">
                        <UserRound
                          size={16}
                          className="absolute top-1/2 -translate-y-1/2 right-3"
                          style={{ color: "#A8B0AB" }}
                        />

                        <input
                          type="text"
                          value={form.name}
                          onChange={handleChange("name")}
                          className="w-full rounded-xl py-3 pr-10 pl-3 text-sm outline-none"
                          style={{
                            border: "1px solid #E2DCCC",
                            backgroundColor: "#FFFFFF",
                            color: "#2F3A36",
                          }}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-1.5"
                        style={{ color: "#2F3A36" }}
                      >
                        البريد الإلكتروني
                      </label>

                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute top-1/2 -translate-y-1/2 left-3"
                          style={{ color: "#A8B0AB" }}
                        />

                        <input
                          type="email"
                          value={form.email}
                          onChange={handleChange("email")}
                          dir="ltr"
                          className="w-full rounded-xl py-3 px-3 pl-10 text-sm outline-none"
                          style={{
                            border: "1px solid #E2DCCC",
                            backgroundColor: "#FFFFFF",
                            color: "#2F3A36",
                          }}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        className="block text-sm font-semibold mb-1.5"
                        style={{ color: "#2F3A36" }}
                      >
                        رقم الهاتف
                      </label>

                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute top-1/2 -translate-y-1/2 left-3"
                          style={{ color: "#A8B0AB" }}
                        />

                        <input
                          type="tel"
                          value={form.phone}
                          onChange={handleChange("phone")}
                          dir="ltr"
                          className="w-full rounded-xl py-3 px-3 pl-10 text-sm outline-none"
                          style={{
                            border: "1px solid #E2DCCC",
                            backgroundColor: "#FFFFFF",
                            color: "#2F3A36",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Buttons */}
                <div className="flex gap-3 mt-5">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all hover:opacity-80"
                    style={{
                      border: "1px solid #E2DCCC",
                      color: "#4A5551",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <X size={16} />
                    إلغاء
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "#4C8577" }}
                  >
                    <Check size={16} />
                    حفظ التعديلات
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}