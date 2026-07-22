import { useState } from "react";
import { Send, Megaphone, X } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useUser } from "../../context/UserContext";
import { useChildren } from "../../context/ChildrenContext";
import { useMessages } from "../../context/MessagesContext";

function ChatThread({ child, currentRoleType, currentName }) {
  const { getMessagesForChild, sendMessage } = useMessages();
  const [text, setText] = useState("");
  const thread = getMessagesForChild(child.id);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage({ childId: child.id, fromRole: currentRoleType, fromName: currentName, text: text.trim() });
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4" style={{ borderBottom: "1px solid #EDE7D9" }}>
        <p className="text-sm font-bold" style={{ color: "#2F3A36" }}>{child.name}</p>
        <p className="text-xs mt-0.5" style={{ color: "#7A8580" }}>{child.classroom}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {thread.length === 0 && (
          <p className="text-center text-sm py-10" style={{ color: "#A8B0AB" }}>لا يوجد رسائل بعد، ابدئي المحادثة</p>
        )}
        {thread.map((m) => {
          const isMine = m.fromRole === currentRoleType;
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-start" : "justify-end"}`}>
              <div
                className="max-w-[75%] rounded-2xl px-4 py-2.5"
                style={{
                  backgroundColor: isMine ? "#4C8577" : "#FCFAF4",
                  color: isMine ? "#FBF7EF" : "#2F3A36",
                  border: isMine ? "none" : "1px solid #F3EFE3",
                }}
              >
                {m.type === "announcement" && (
                  <p className="text-[10px] font-semibold mb-1 flex items-center gap-1" style={{ opacity: 0.8 }}>
                    <Megaphone size={11} /> إعلان عام
                  </p>
                )}
                <p className="text-sm">{m.text}</p>
                <p className="text-[10px] mt-1" style={{ opacity: 0.7 }}>{m.fromName} · {m.date}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-4 flex items-center gap-2" style={{ borderTop: "1px solid #EDE7D9" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="اكتبي رسالتك..."
          className="flex-1 rounded-xl py-2.5 px-3 text-sm outline-none"
          style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }}
        />
        <button onClick={handleSend} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#4C8577" }}>
          <Send size={16} style={{ color: "#FBF7EF" }} />
        </button>
      </div>
    </div>
  );
}

function AnnouncementModal({ childIds, fromName, onClose }) {
  const { sendAnnouncement } = useMessages();
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    sendAnnouncement({ childIds, fromName, text: text.trim() });
    onClose();
  };

  return (
    <div dir="rtl" className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: "#00000040" }}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "#2F3A36" }}>
            <Megaphone size={18} style={{ color: "#4C8577" }} />
            إعلان عام لكل أهالي الصف
          </h3>
          <button onClick={onClose} style={{ color: "#A8B0AB" }}><X size={20} /></button>
        </div>
        <p className="text-xs mb-3" style={{ color: "#A8B0AB" }}>
          هاد الإعلان رح يوصل لكل أهالي طلاب صفك ({childIds.length} ولي أمر)
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="اكتبي نص الإعلان..."
          className="w-full rounded-xl py-2.5 px-3 text-sm outline-none resize-none mb-4"
          style={{ border: "1px solid #E2DCCC", backgroundColor: "#FCFAF4", color: "#2F3A36" }}
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-semibold" style={{ border: "1px solid #E2DCCC", color: "#4A5551" }}>
            إلغاء
          </button>
          <button onClick={handleSend} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: "#4C8577" }}>
            إرسال للجميع
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage({ onNavigate, onLogout }) {
  const { user } = useUser();
  const { childrenList } = useChildren();
  const { getMessagesForChild } = useMessages();

  // نفس منطق فلترة الأطفال حسب الدور يلي استخدمناه بصفحة الأطفال
  const relevantChildren =
    user.roleType === "teacher"
      ? childrenList.filter((c) => c.classroom === user.classroom)
      : childrenList.filter((c) => user.childIds?.includes(c.id));

  const [selectedChildId, setSelectedChildId] = useState(relevantChildren[0]?.id || null);
  const [announcementOpen, setAnnouncementOpen] = useState(false);

  const selectedChild = relevantChildren.find((c) => c.id === selectedChildId);

  if (relevantChildren.length === 0) {
    return (
      <DashboardLayout activePage="messages" onNavigate={onNavigate} onLogout={onLogout} pageTitle="الرسائل">
        <p className="text-sm text-center py-10" style={{ color: "#A8B0AB" }}>لا يوجد محادثات بعد</p>
      </DashboardLayout>
    );
  }

  // ولي الأمر عادة عنده طفل واحد، فمنفتح المحادثة على طول بدون قائمة جانبية
  if (user.roleType === "parent") {
    return (
      <DashboardLayout activePage="messages" onNavigate={onNavigate} onLogout={onLogout} pageTitle="الرسائل">
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9", height: "70vh" }}>
          <ChatThread child={relevantChildren[0]} currentRoleType="parent" currentName={user.name} />
        </div>
      </DashboardLayout>
    );
  }

  // المعلم بيشوف قائمة طلاب صفه على اليمين، ويختار وحد يحكي معه
  return (
    <DashboardLayout activePage="messages" onNavigate={onNavigate} onLogout={onLogout} pageTitle="الرسائل">
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={() => setAnnouncementOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: "#4C8577" }}
        >
          <Megaphone size={16} />
          إعلان عام لكل الصف
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: "65vh" }}>
        {/* قائمة الطلاب/المحادثات */}
        <div className="rounded-2xl overflow-hidden lg:col-span-1" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
          <div className="overflow-y-auto h-full">
            {relevantChildren.map((child) => {
              const thread = getMessagesForChild(child.id);
              const lastMsg = thread[thread.length - 1];
              const isActive = child.id === selectedChildId;
              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className="w-full text-right px-4 py-3.5 flex flex-col gap-1"
                  style={{
                    backgroundColor: isActive ? "#FCFAF4" : "transparent",
                    borderBottom: "1px solid #F3EFE3",
                    borderRight: isActive ? "3px solid #4C8577" : "3px solid transparent",
                  }}
                >
                  <span className="text-sm font-semibold" style={{ color: "#2F3A36" }}>{child.name}</span>
                  <span className="text-xs truncate" style={{ color: "#A8B0AB" }}>
                    {lastMsg ? lastMsg.text : "لا يوجد رسائل بعد"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* المحادثة */}
        <div className="rounded-2xl overflow-hidden lg:col-span-2" style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}>
          {selectedChild && <ChatThread child={selectedChild} currentRoleType="teacher" currentName={user.name} />}
        </div>
      </div>

      {announcementOpen && (
        <AnnouncementModal
          childIds={relevantChildren.map((c) => c.id)}
          fromName={user.name}
          onClose={() => setAnnouncementOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}