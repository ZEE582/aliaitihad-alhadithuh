import { useState } from "react";
import { Bell, Lock, Globe } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

function ToggleRow({ icon: Icon, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid #F3EFE3" }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#FCFAF4" }}>
          <Icon size={16} style={{ color: "#4C8577" }} />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "#2F3A36" }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: "#A8B0AB" }}>{description}</p>
        </div>
      </div>
      <button onClick={onChange} className="w-11 h-6 rounded-full relative transition"
        style={{ backgroundColor: checked ? "#4C8577" : "#E2DCCC" }}>
        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition"
          style={{ right: checked ? "2px" : "22px" }} />
      </button>
    </div>
  );
}

export default function SettingsPage({ onNavigate }) {
  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  return (
    <DashboardLayout activePage="settings" onNavigate={onNavigate} pageTitle="الإعدادات">
      <div className="max-w-xl space-y-5">
        <div className="rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: "#2F3A36" }}>التنبيهات</h3>
          <ToggleRow icon={Bell} label="إشعارات داخل التطبيق" description="تنبيهات الحضور والملاحظات الجديدة"
            checked={notifications} onChange={() => setNotifications((v) => !v)} />
          <ToggleRow icon={Bell} label="تنبيهات SMS" description="إرسال رسائل نصية لأولياء الأمور عند الغياب"
            checked={smsAlerts} onChange={() => setSmsAlerts((v) => !v)} />
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "#2F3A36" }}>الأمان</h3>
          <button className="flex items-center gap-3 text-sm font-medium w-full py-2" style={{ color: "#4C8577" }}>
            <Lock size={16} />
            تغيير كلمة المرور
          </button>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "#2F3A36" }}>اللغة</h3>
          <div className="flex items-center gap-3">
            <Globe size={16} style={{ color: "#A8B0AB" }} />
            <select className="rounded-xl py-2 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }}>
              <option>العربية</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
