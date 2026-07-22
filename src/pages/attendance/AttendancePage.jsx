import { useState } from "react";
import { Check, X as XIcon, Clock3, Save, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

const classrooms = ["صف الفراشات", "صف النجوم", "صف القمر", "صف الشمس"];

const mockChildrenByClass = {
  "صف الفراشات": [
    { id: 1, name: "رهف يوسف" },
    { id: 2, name: "زين محمود" },
    { id: 3, name: "لجين قاسم" },
  ],
  "صف النجوم": [
    { id: 4, name: "يزن الأحمد" },
    { id: 5, name: "سيلين خالد" },
  ],
  "صف القمر": [
    { id: 6, name: "كريم فارس" },
    { id: 7, name: "دانة سعيد" },
  ],
  "صف الشمس": [
    { id: 8, name: "آدم نمر" },
  ],
};

const STATUS_OPTIONS = [
  { key: "present", label: "حاضر", icon: Check, color: "#4C8577" },
  { key: "absent", label: "غائب", icon: XIcon, color: "#C25B4A" },
  { key: "late", label: "متأخر", icon: Clock3, color: "#E8B24D" },
];

export default function AttendancePage({ onNavigate }) {
  const [activeClass, setActiveClass] = useState(classrooms[0]);
  const [attendance, setAttendance] = useState({});
  const [savedMessage, setSavedMessage] = useState(false);

  const children = mockChildrenByClass[activeClass] || [];

  const setStatus = (childId, status) => {
    setAttendance((prev) => ({ ...prev, [childId]: status }));
    setSavedMessage(false); 
  };

  const handleSaveAttendance = () => {
    console.log("تم حفظ الحضور:", { activeClass, attendance });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const today = new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <DashboardLayout activePage="attendance" onNavigate={onNavigate} pageTitle="الحضور">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm" style={{ color: "#7A8580" }}>{today}</p>
      </div>

      <div className="flex items-center justify-between mb-5 mt-3 gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {classrooms.map((c) => (
            <button key={c} onClick={() => setActiveClass(c)}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                backgroundColor: activeClass === c ? "#4C8577" : "#FFFFFF",
                color: activeClass === c ? "#FBF7EF" : "#4A5551",
                border: "1px solid #EDE7D9",
              }}>
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {savedMessage && (
            <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#4C8577" }}>
              <CheckCircle2 size={16} />
              تم الحفظ
            </span>
          )}
          <button onClick={handleSaveAttendance} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: "#4C8577" }}>
            <Save size={16} />
            حفظ الحضور
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
        {children.map((child, idx) => {
          const current = attendance[child.id] || "present";
          return (
            <div key={child.id} className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: idx < children.length - 1 ? "1px solid #F3EFE3" : "none" }}>
              <span className="text-sm font-medium" style={{ color: "#2F3A36" }}>{child.name}</span>
              <div className="flex items-center gap-2">
                {STATUS_OPTIONS.map(({ key, label, icon: Icon, color }) => {
                  const isActive = current === key;
                  return (
                    <button key={key} onClick={() => setStatus(child.id, key)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      style={{
                        backgroundColor: isActive ? `${color}20` : "transparent",
                        color: isActive ? color : "#A8B0AB",
                        border: `1px solid ${isActive ? color : "#EDE7D9"}`,
                      }}>
                      <Icon size={13} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {children.length === 0 && (
          <p className="text-center text-sm py-10" style={{ color: "#A8B0AB" }}>لا يوجد أطفال بهذا الصف</p>
        )}
      </div>
    </DashboardLayout>
  );
}