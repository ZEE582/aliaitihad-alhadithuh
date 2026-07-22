import { Construction } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

const pageTitles = {
  parents: "أولياء الأمور",
  teachers: "المعلمون",
  classes: "الصفوف",
  subjects: "المواد",
  sessions: "الحصص",
  attendance: "الحضور",
  notes: "الملاحظات",
  reports: "التقارير",
  profile: "الملف الشخصي",
  settings: "الإعدادات",
};

export default function ComingSoon({ pageKey, onNavigate }) {
  const title = pageTitles[pageKey] || "الصفحة";

  return (
    <DashboardLayout activePage={pageKey} onNavigate={onNavigate} pageTitle={title}>
      <div
        className="flex flex-col items-center justify-center rounded-2xl py-20"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "#FCFAF4" }}
        >
          <Construction size={24} style={{ color: "#4C8577" }} />
        </div>
        <h3 className="text-base font-bold mb-1" style={{ color: "#2F3A36" }}>
          صفحة {title} قيد الإنشاء
        </h3>
        <p className="text-sm" style={{ color: "#A8B0AB" }}>
          رح تكون جاهزة قريباً
        </p>
      </div>
    </DashboardLayout>
  );
}