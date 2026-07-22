import { useState } from "react";
import { ArrowRight, Phone, Users, CalendarDays, Pencil, Plus } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import NoteForm from "../notes/NoteForm";

const defaultAttendance = [
  { date: "2026-07-14", status: "حاضر" },
  { date: "2026-07-13", status: "حاضر" },
  { date: "2026-07-12", status: "غائب" },
  { date: "2026-07-11", status: "حاضر" },
];

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#FCFAF4" }}>
        <Icon size={16} style={{ color: "#4C8577" }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: "#A8B0AB" }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: "#2F3A36" }}>{value || "غير محدد"}</p>
      </div>
    </div>
  );
}

function BehaviorBadge({ type }) {
  const isPositive = type === "إيجابي";
  const isAlert = type === "تنبيه";
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
      style={{
        backgroundColor: isPositive ? "#4C857720" : isAlert ? "#C25B4A20" : "#E8B24D25",
        color: isPositive ? "#4C8577" : isAlert ? "#C25B4A" : "#B8862F",
      }}
    >
      {type}
    </span>
  );
}

// child: الطفل الحقيقي المُمرَّر من صفحة القائمة (id, name, classroom, age, parent, status, ...)
export default function ChildDetails({ child, onNavigate, onBack, onLogout }) {
  const [tab, setTab] = useState("behavior");
  const [notes, setNotes] = useState(child?.notes || []);
  const [noteFormOpen, setNoteFormOpen] = useState(false);

  if (!child) {
    // احتياط: لو دخلنا الصفحة بدون طفل محدد، منرجع تلقائياً
    return (
      <DashboardLayout activePage="children" onNavigate={onNavigate} onLogout={onLogout} pageTitle="تفاصيل الطفل">
        <p className="text-sm" style={{ color: "#A8B0AB" }}>لم يتم اختيار طفل. الرجاء الرجوع لقائمة الأطفال.</p>
      </DashboardLayout>
    );
  }

  const handleAddNote = (formData) => {
    const today = new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" });
    setNotes((prev) => [{ id: Date.now(), author: "أنتِ", date: today, type: formData.type, text: formData.text }, ...prev]);
    setNoteFormOpen(false);
  };

  return (
    <DashboardLayout activePage="children" onNavigate={onNavigate} onLogout={onLogout} pageTitle="تفاصيل الطفل">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium mb-5" style={{ color: "#4C8577" }}>
        <ArrowRight size={16} />
        رجوع لقائمة الأطفال
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* البطاقة الجانبية: معلومات الطفل الحقيقية */}
        <div className="rounded-2xl p-5 h-fit lg:col-span-1" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
                style={{ backgroundColor: "#4C8577", color: "#FBF7EF" }}>
                {child.name?.charAt(0) || "؟"}
              </div>
              <div>
                <h3 className="text-base font-bold" style={{ color: "#2F3A36" }}>{child.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: "#7A8580" }}>{child.classroom}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <InfoRow icon={CalendarDays} label="العمر" value={child.age ? `${child.age} سنوات` : null} />
            <InfoRow icon={Users} label="ولي الأمر" value={child.parent} />
            <InfoRow icon={Phone} label="رقم التواصل" value={child.parentPhone} />
            <InfoRow icon={CalendarDays} label="الحالة" value={child.status} />
          </div>

          {child.healthNotes && (
            <div className="mt-5 pt-4 rounded-xl px-3 py-3" style={{ backgroundColor: "#FCFAF4", border: "1px solid #F3EFE3" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "#C25B4A" }}>ملاحظات صحية</p>
              <p className="text-sm" style={{ color: "#4A5551" }}>{child.healthNotes}</p>
            </div>
          )}
        </div>

        {/* التبويبات */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setTab("behavior")} className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ backgroundColor: tab === "behavior" ? "#4C8577" : "#FFFFFF", color: tab === "behavior" ? "#FBF7EF" : "#4A5551", border: "1px solid #EDE7D9" }}>
              السلوكيات والملاحظات
            </button>
            <button onClick={() => setTab("attendance")} className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ backgroundColor: tab === "attendance" ? "#4C8577" : "#FFFFFF", color: tab === "attendance" ? "#FBF7EF" : "#4A5551", border: "1px solid #EDE7D9" }}>
              سجل الحضور
            </button>
          </div>

          {tab === "behavior" && (
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold" style={{ color: "#2F3A36" }}>السلوكيات والملاحظات</h4>
                <button onClick={() => setNoteFormOpen(true)} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#4C8577" }}>
                  <Plus size={16} />
                  إضافة ملاحظة
                </button>
              </div>

              {notes.length === 0 ? (
                <p className="text-sm text-center py-6" style={{ color: "#A8B0AB" }}>لا يوجد ملاحظات بعد لهذا الطفل</p>
              ) : (
                <ul className="space-y-3">
                  {notes.map((note) => (
                    <li key={note.id} className="rounded-xl p-4" style={{ backgroundColor: "#FCFAF4", border: "1px solid #F3EFE3" }}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm flex-1" style={{ color: "#2F3A36" }}>{note.text}</p>
                        <BehaviorBadge type={note.type} />
                      </div>
                      <p className="text-xs" style={{ color: "#A8B0AB" }}>{note.author} · {note.date}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "attendance" && (
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
              <h4 className="text-sm font-bold mb-4" style={{ color: "#2F3A36" }}>سجل الحضور</h4>
              <ul className="space-y-2.5">
                {defaultAttendance.map((a) => (
                  <li key={a.date} className="flex items-center justify-between text-sm py-2" style={{ borderBottom: "1px solid #F3EFE3" }}>
                    <span style={{ color: "#4A5551" }}>{a.date}</span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: a.status === "حاضر" ? "#4C857720" : "#C25B4A20", color: a.status === "حاضر" ? "#4C8577" : "#C25B4A" }}>
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {noteFormOpen && (
        <NoteForm
          initialData={{ childName: child.name, type: "إيجابي", text: "" }}
          onClose={() => setNoteFormOpen(false)}
          onSave={handleAddNote}
        />
      )}
    </DashboardLayout>
  );
}