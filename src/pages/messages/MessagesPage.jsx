import { useState } from "react";
import {
  Send,
  Megaphone,
  X,
  Clock,
  UserRound,
  CheckCircle2,
  Timer,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import { useUser } from "../../context/UserContext";
import { useChildren } from "../../context/ChildrenContext";
import { useMessages } from "../../context/MessagesContext";

// ========================================
// استخراج اسم المعلم من بيانات الطفل
// ========================================

function getTeacherName(child) {
  return (
    child.teacherName ||
    child.teacher_name ||
    child.teacher?.name ||
    child.teacher?.fullName ||
    child.teacher ||
    "معلم الصف"
  );
}

// ========================================
// استخراج اسم ولي الأمر
// ========================================

function getParentName(child) {
  return (
    child.parent ||
    child.parentName ||
    child.parent_name ||
    child.parent?.name ||
    child.parent?.fullName ||
    "ولي الأمر"
  );
}

// ========================================
// Chat Thread
// ========================================

function ChatThread({
  child,
  currentRoleType,
  currentName,
}) {
  const {
    getMessagesForChild,
    sendMessage,
  } = useMessages();

  const [text, setText] =
    useState("");

  const [sendNotice, setSendNotice] =
    useState(null);

  // ========================================
  // الرسائل حسب الدور
  // ========================================

  const thread =
    getMessagesForChild(
      child.id,
      currentRoleType
    );

  // ========================================
  // تحديد الطرف الآخر
  // ========================================

  const isParent =
    currentRoleType === "parent";

  const otherPersonName =
    isParent
      ? getTeacherName(child)
      : getParentName(child);

  // ========================================
  // إرسال رسالة
  // ========================================

  const handleSend = () => {
    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    const newMessage =
      sendMessage({
        childId: child.id,
        fromRole: currentRoleType,
        fromName: currentName,
        text: cleanText,
      });

    setText("");

    // ======================================
    // ولي الأمر أرسل خارج الوقت
    // ======================================

    if (
      currentRoleType === "parent" &&
      newMessage.pending
    ) {
      const visibleAt =
        new Date(
          newMessage.visibleAt
        );

      const time =
        visibleAt.toLocaleTimeString(
          "ar-EG",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

      setSendNotice({
        type: "pending",
        text: `تم استلام رسالتك 🌿 سيتم إرسالها إلى ${otherPersonName} الساعة ${time} لأن وقت التواصل المحدد هو من 6:00 إلى 7:00 مساءً.`,
      });

      setTimeout(() => {
        setSendNotice(null);
      }, 7000);

      return;
    }

    // ======================================
    // ولي الأمر أرسل ضمن الوقت
    // ======================================

    if (
      currentRoleType === "parent"
    ) {
      setSendNotice({
        type: "success",
        text: `تم إرسال رسالتك إلى ${otherPersonName} بنجاح ✓`,
      });

      setTimeout(() => {
        setSendNotice(null);
      }, 3500);

      return;
    }

    // ======================================
    // المعلم أرسل لولي الأمر
    // ======================================

    setSendNotice({
      type: "success",
      text: `تم إرسال الرسالة إلى ${otherPersonName} بنجاح ✓`,
    });

    setTimeout(() => {
      setSendNotice(null);
    }, 3500);
  };

  // ========================================
  // عنوان المحادثة
  // ========================================

  const title =
    otherPersonName;

  const subtitle =
    isParent
      ? `معلم ${child.classroom || "الصف"}`
      : `ولي أمر ${child.name}`;

  return (
    <div
      className="flex flex-col h-full"
      dir="rtl"
    >

      {/* ==================================
          Header
      ================================== */}

      <div
        className="px-5 py-4"
        style={{
          borderBottom:
            "1px solid #EDE7D9",
          background:
            "linear-gradient(135deg, #FFFFFF, #FCFAF4)",
        }}
      >
        <div className="flex items-center gap-3">

          {/* Avatar */}

          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor:
                "#4C857715",
              color: "#4C8577",
            }}
          >
            <UserRound size={20} />
          </div>

          <div>
            <p
              className="text-sm font-bold"
              style={{
                color: "#2F3A36",
              }}
            >
              {title}
            </p>

            <p
              className="text-xs mt-0.5"
              style={{
                color: "#7A8580",
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* ==================================
            وقت التواصل لولي الأمر فقط
        ================================== */}

        {isParent && (
          <div
            className="flex items-center gap-2 mt-3 rounded-xl px-3 py-2"
            style={{
              backgroundColor:
                "#F3F8F5",
              border:
                "1px solid #DCEBE5",
              color: "#4C8577",
            }}
          >
            <Clock size={13} />

            <span className="text-[11px] font-medium">
              وقت التواصل مع المعلم:
              {" "}
              <strong>
                6:00 – 7:00 مساءً
              </strong>
            </span>
          </div>
        )}

        {/* ==================================
            تنبيه للمعلم
        ================================== */}

        {!isParent && (
          <div
            className="flex items-center gap-2 mt-3 rounded-xl px-3 py-2"
            style={{
              backgroundColor:
                "#FCFAF4",
              border:
                "1px solid #EDE7D9",
              color: "#7A8580",
            }}
          >
            <UserRound size={13} />

            <span className="text-[11px]">
              المحادثة مع ولي أمر الطفل
            </span>
          </div>
        )}
      </div>

      {/* ==================================
          Messages
      ================================== */}

      <div
        className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
      >

        {/* ==================================
            إشعار الإرسال
        ================================== */}

        {sendNotice && (
          <div
            className="rounded-2xl px-4 py-3 text-sm mb-4 flex items-start gap-2"
            style={{
              backgroundColor:
                sendNotice.type === "pending"
                  ? "#FFF8E7"
                  : "#EDF7F3",

              color:
                sendNotice.type === "pending"
                  ? "#8A6D3B"
                  : "#357463",

              border:
                sendNotice.type === "pending"
                  ? "1px solid #F3E3B5"
                  : "1px solid #CFE8DF",
            }}
          >
            {sendNotice.type === "pending" ? (
              <Timer
                size={17}
                className="shrink-0 mt-0.5"
              />
            ) : (
              <CheckCircle2
                size={17}
                className="shrink-0 mt-0.5"
              />
            )}

            <span>
              {sendNotice.text}
            </span>
          </div>
        )}

        {/* ==================================
            لا يوجد رسائل
        ================================== */}

        {thread.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14">

            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{
                backgroundColor:
                  "#4C857712",
                color: "#4C8577",
              }}
            >
              <Send size={22} />
            </div>

            <p
              className="text-sm font-medium"
              style={{
                color: "#4A5551",
              }}
            >
              ابدئي المحادثة 🌿
            </p>

            <p
              className="text-xs mt-1 text-center"
              style={{
                color: "#A8B0AB",
              }}
            >
              {isParent
                ? "يمكنك التواصل مع معلم طفلك خلال وقت التواصل المحدد."
                : "يمكنك التواصل مع ولي أمر الطفل مباشرة."}
            </p>
          </div>
        )}

        {/* ==================================
            عرض الرسائل
        ================================== */}

        {thread.map((m) => {
          const isMine =
            m.fromRole ===
            currentRoleType;

          const isPending =
            m.pending === true;

          return (
            <div
              key={m.id}
              className={`flex ${
                isMine
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div
                className="max-w-[75%] rounded-2xl px-4 py-2.5"
                style={{
                  backgroundColor:
                    isMine
                      ? "#4C8577"
                      : "#FCFAF4",

                  color:
                    isMine
                      ? "#FBF7EF"
                      : "#2F3A36",

                  border:
                    isMine
                      ? "none"
                      : "1px solid #F3EFE3",

                  opacity:
                    isPending
                      ? 0.75
                      : 1,
                }}
              >

                {/* إعلان */}

                {m.type ===
                  "announcement" && (
                  <p
                    className="text-[10px] font-semibold mb-1 flex items-center gap-1"
                    style={{
                      opacity: 0.8,
                    }}
                  >
                    <Megaphone size={11} />
                    إعلان عام
                  </p>
                )}

                {/* نص الرسالة */}

                <p className="text-sm leading-6">
                  {m.text}
                </p>

                {/* الاسم والوقت */}

                <p
                  className="text-[10px] mt-1"
                  style={{
                    opacity: 0.7,
                  }}
                >
                  {m.fromName} · {m.date}
                </p>

                {/* رسالة مؤجلة */}

                {isPending &&
                  isMine && (
                    <div
                      className="flex items-center gap-1 mt-2 text-[10px] font-semibold"
                      style={{
                        color:
                          "#F3D08A",
                      }}
                    >
                      <Clock size={11} />

                      بانتظار وقت التواصل
                    </div>
                  )}

              </div>
            </div>
          );
        })}
      </div>

      {/* ==================================
          Input
      ================================== */}

      <div
        className="px-5 py-4 flex items-center gap-2"
        style={{
          borderTop:
            "1px solid #EDE7D9",
        }}
      >

        <input
          type="text"
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter"
            ) {
              handleSend();
            }
          }}
          placeholder={
            isParent
              ? "اكتبي رسالتك للمعلم..."
              : "اكتب رسالة لولي الأمر..."
          }
          className="flex-1 rounded-xl py-2.5 px-3 text-sm outline-none"
          style={{
            border:
              "1px solid #E2DCCC",
            backgroundColor:
              "#FCFAF4",
            color: "#2F3A36",
          }}
        />

        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor:
              "#4C8577",
          }}
          title="إرسال الرسالة"
        >
          <Send
            size={16}
            style={{
              color: "#FBF7EF",
            }}
          />
        </button>
      </div>
    </div>
  );
}

// ========================================
// Announcement Modal
// ========================================

function AnnouncementModal({
  childIds,
  fromName,
  onClose,
}) {
  const {
    sendAnnouncement,
  } = useMessages();

  const [text, setText] =
    useState("");

  const handleSend = () => {
    if (!text.trim()) {
      return;
    }

    sendAnnouncement({
      childIds,
      fromName,
      text: text.trim(),
    });

    onClose();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{
        backgroundColor:
          "#00000040",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          backgroundColor:
            "#FFFFFF",
        }}
      >

        <div className="flex items-center justify-between mb-4">

          <h3
            className="text-lg font-bold flex items-center gap-2"
            style={{
              color: "#2F3A36",
            }}
          >
            <Megaphone
              size={18}
              style={{
                color: "#4C8577",
              }}
            />

            إعلان عام لكل أهالي الصف
          </h3>

          <button
            onClick={onClose}
            style={{
              color: "#A8B0AB",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <p
          className="text-xs mb-3"
          style={{
            color: "#A8B0AB",
          }}
        >
          سيصل هذا الإعلان إلى جميع
          أولياء أمور طلاب صفك
          {" "}
          ({childIds.length} ولي أمر)
        </p>

        <textarea
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          rows={4}
          placeholder="اكتبي نص الإعلان..."
          className="w-full rounded-xl py-2.5 px-3 text-sm outline-none resize-none mb-4"
          style={{
            border:
              "1px solid #E2DCCC",
            backgroundColor:
              "#FCFAF4",
            color: "#2F3A36",
          }}
        />

        <div className="flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
            style={{
              border:
                "1px solid #E2DCCC",
              color: "#4A5551",
            }}
          >
            إلغاء
          </button>

          <button
            onClick={handleSend}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white"
            style={{
              backgroundColor:
                "#4C8577",
            }}
          >
            إرسال للجميع
          </button>

        </div>
      </div>
    </div>
  );
}

// ========================================
// Messages Page
// ========================================

export default function MessagesPage({
  onNavigate,
  onLogout,
}) {
  const { user } = useUser();

  const {
    childrenList,
  } = useChildren();

  const {
    getMessagesForChild,
  } = useMessages();

  // ========================================
  // الأطفال حسب الدور
  // ========================================

  const relevantChildren =
    user.roleType === "teacher"
      ? childrenList.filter(
          (c) =>
            c.classroom ===
            user.classroom
        )
      : childrenList.filter(
          (c) =>
            user.childIds?.includes(
              c.id
            )
        );

  const [
    selectedChildId,
    setSelectedChildId,
  ] = useState(
    relevantChildren[0]?.id ||
      null
  );

  const [
    announcementOpen,
    setAnnouncementOpen,
  ] = useState(false);

  const selectedChild =
    relevantChildren.find(
      (c) =>
        c.id ===
        selectedChildId
    );

  // ========================================
  // لا يوجد أطفال
  // ========================================

  if (
    relevantChildren.length === 0
  ) {
    return (
      <DashboardLayout
        activePage="messages"
        onNavigate={onNavigate}
        onLogout={onLogout}
        pageTitle="الرسائل"
      >
        <div className="flex flex-col items-center justify-center py-16">

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{
              backgroundColor:
                "#4C857712",
              color: "#4C8577",
            }}
          >
            <Send size={22} />
          </div>

          <p
            className="text-sm font-medium"
            style={{
              color: "#4A5551",
            }}
          >
            لا توجد محادثات بعد
          </p>

        </div>
      </DashboardLayout>
    );
  }

  // ========================================
  // واجهة ولي الأمر
  // ========================================

  if (
    user.roleType === "parent"
  ) {
    return (
      <DashboardLayout
        activePage="messages"
        onNavigate={onNavigate}
        onLogout={onLogout}
        pageTitle="الرسائل"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor:
              "#FFFFFF",

            border:
              "1px solid #EDE7D9",

            height: "70vh",
          }}
        >
          <ChatThread
            child={
              relevantChildren[0]
            }

            currentRoleType="parent"

            currentName={
              user.name
            }
          />
        </div>
      </DashboardLayout>
    );
  }

  // ========================================
  // واجهة المعلم
  // ========================================

  return (
    <DashboardLayout
      activePage="messages"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle="الرسائل"
    >

      {/* إعلان عام */}

      <div className="flex items-center justify-end mb-4">

        <button
          onClick={() =>
            setAnnouncementOpen(
              true
            )
          }
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{
            backgroundColor:
              "#4C8577",
          }}
        >
          <Megaphone size={16} />

          إعلان عام لكل الصف
        </button>

      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        style={{
          height: "65vh",
        }}
      >

        {/* ==================================
            قائمة الطلاب
        ================================== */}

        <div
          className="rounded-2xl overflow-hidden lg:col-span-1"
          style={{
            backgroundColor:
              "#FFFFFF",

            border:
              "1px solid #EDE7D9",
          }}
        >

          <div className="overflow-y-auto h-full">

            {relevantChildren.map(
              (child) => {

                const thread =
                  getMessagesForChild(
                    child.id,
                    user.roleType
                  );

                const lastMsg =
                  thread[
                    thread.length - 1
                  ];

                const isActive =
                  child.id ===
                  selectedChildId;

                return (
                  <button
                    key={child.id}
                    onClick={() =>
                      setSelectedChildId(
                        child.id
                      )
                    }
                    className="w-full text-right px-4 py-3.5 flex items-center gap-3"
                    style={{
                      backgroundColor:
                        isActive
                          ? "#FCFAF4"
                          : "transparent",

                      borderBottom:
                        "1px solid #F3EFE3",

                      borderRight:
                        isActive
                          ? "3px solid #4C8577"
                          : "3px solid transparent",
                    }}
                  >

                    {/* صورة/رمز الطفل */}

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor:
                          "#4C857712",
                        color:
                          "#4C8577",
                      }}
                    >
                      <UserRound size={17} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-2">

                        <span
                          className="text-sm font-semibold truncate"
                          style={{
                            color:
                              "#2F3A36",
                          }}
                        >
                          {getParentName(child)}
                        </span>

                      </div>

                      <span
                        className="text-[11px] block mt-0.5"
                        style={{
                          color:
                            "#A8B0AB",
                        }}
                      >
                        ولي أمر {child.name}
                      </span>

                      <span
                        className="text-xs truncate block mt-1"
                        style={{
                          color:
                            "#A8B0AB",
                        }}
                      >
                        {lastMsg
                          ? lastMsg.text
                          : "لا توجد رسائل بعد"}
                      </span>

                    </div>

                  </button>
                );
              }
            )}

          </div>
        </div>

        {/* ==================================
            المحادثة
        ================================== */}

        <div
          className="rounded-2xl overflow-hidden lg:col-span-2"
          style={{
            backgroundColor:
              "#FFFFFF",

            border:
              "1px solid #EDE7D9",
          }}
        >

          {selectedChild && (
            <ChatThread
              child={
                selectedChild
              }

              currentRoleType="teacher"

              currentName={
                user.name
              }
            />
          )}

        </div>

      </div>

      {/* ==================================
          Announcement Modal
      ================================== */}

      {announcementOpen && (
        <AnnouncementModal
          childIds={relevantChildren.map(
            (c) => c.id
          )}

          fromName={
            user.name
          }

          onClose={() =>
            setAnnouncementOpen(
              false
            )
          }
        />
      )}

    </DashboardLayout>
  );
}