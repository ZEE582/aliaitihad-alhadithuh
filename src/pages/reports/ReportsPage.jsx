import { useState } from "react";
import { Download, Printer, FileBarChart } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

const reportTypes = [
  { key: "attendance", label: "تقرير الحضور" },
  { key: "children", label: "تقرير الأطفال" },
  { key: "behavior", label: "تقرير السلوكيات" },
];

export default function ReportsPage({ onNavigate }) {
  const [reportType, setReportType] = useState("attendance");
  const [classroom, setClassroom] = useState("الكل");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <DashboardLayout activePage="reports" onNavigate={onNavigate} pageTitle="التقارير">
      {/* فلاتر */}
      <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#2F3A36" }}>تصفية التقرير</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#7A8580" }}>نوع التقرير</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }}>
              {reportTypes.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#7A8580" }}>الصف</label>
            <select value={classroom} onChange={(e) => setClassroom(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }}>
              <option>الكل</option>
              <option>صف الفراشات</option>
              <option>صف النجوم</option>
              <option>صف القمر</option>
              <option>صف الشمس</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#7A8580" }}>من تاريخ</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#7A8580" }}>إلى تاريخ</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }} />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: "#4C8577" }}>
            <FileBarChart size={16} />
            عرض التقرير
          </button>
          <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
            style={{ border: "1px solid #E2DCCC", color: "#4A5551" }}>
            <Download size={16} />
            تصدير PDF
          </button>
          <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
            style={{ border: "1px solid #E2DCCC", color: "#4A5551" }}>
            <Printer size={16} />
            طباعة
          </button>
        </div>
      </div>

      {/* منطقة عرض النتائج (مكانها جاهز، بتتعبى بعد ربط API) */}
      <div className="rounded-2xl p-10 flex flex-col items-center justify-center" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
        <FileBarChart size={28} style={{ color: "#A8B0AB" }} />
        <p className="text-sm mt-3" style={{ color: "#A8B0AB" }}>اختر الفلاتر واضغط "عرض التقرير" لعرض النتائج هنا</p>
      </div>
    </DashboardLayout>
  );
}
