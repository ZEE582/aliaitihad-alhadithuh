import { useState } from "react";
import { Mail, Phone, Shield, Pencil } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useUser } from "../../context/UserContext";

export default function ProfilePage({ onNavigate, onLogout }) {
  const { user, updateUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    updateUser(form); 
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(user);
    setEditing(false);
  };

  return (
    <DashboardLayout activePage="profile" onNavigate={onNavigate} onLogout={onLogout} pageTitle="الملف الشخصي">
      <div className="max-w-xl">
        <div className="rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: "#4C8577", color: "#FBF7EF" }}>
                {user.name.charAt(3) || "س"}
              </div>
              <div>
                <h3 className="text-base font-bold" style={{ color: "#2F3A36" }}>{user.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: "#7A8580" }}>{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => { setForm(user); setEditing((e) => !e); }}
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#4C8577" }}
            >
              <Pencil size={15} />
              {editing ? "إلغاء" : "تعديل"}
            </button>
          </div>

          {!editing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={16} style={{ color: "#A8B0AB" }} />
                <span className="text-sm" style={{ color: "#4A5551" }}>{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} style={{ color: "#A8B0AB" }} />
                <span className="text-sm" style={{ color: "#4A5551" }}>{user.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={16} style={{ color: "#A8B0AB" }} />
                <span className="text-sm" style={{ color: "#4A5551" }}>عضو منذ {user.joinDate}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>الاسم الكامل</label>
                <input type="text" value={form.name} onChange={handleChange("name")}
                  className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                  style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>البريد الإلكتروني</label>
                <input type="email" value={form.email} onChange={handleChange("email")} dir="ltr"
                  className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                  style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#2F3A36" }}>رقم الهاتف</label>
                <input type="tel" value={form.phone} onChange={handleChange("phone")} dir="ltr"
                  className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                  style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }} />
              </div>
              <button onClick={handleSave} className="w-full rounded-xl py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: "#4C8577" }}>
                حفظ التعديلات
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}