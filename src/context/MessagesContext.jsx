import { createContext, useContext, useState, useEffect } from "react";

const MessagesContext = createContext(null);

// ========================================
// وقت التواصل المسموح مع المعلم
// 6:00 مساءً → 7:00 مساءً
// هذا القيد على ولي الأمر فقط
// ========================================

const WINDOW_START_HOUR = 18;
const WINDOW_END_HOUR = 19;

const initialMessages = [];

// ========================================
// هل الوقت الحالي داخل نافذة التواصل؟
// ========================================

function isWithinWindow(date) {
  const hour = date.getHours();

  return (
    hour >= WINDOW_START_HOUR &&
    hour < WINDOW_END_HOUR
  );
}

// ========================================
// حساب أقرب موعد قادم للتواصل
// ========================================

function getNextWindowStart(date) {
  const next = new Date(date);

  // إذا لم يبدأ وقت التواصل بعد اليوم
  if (date.getHours() < WINDOW_START_HOUR) {
    next.setHours(
      WINDOW_START_HOUR,
      0,
      0,
      0
    );

    return next;
  }

  // إذا انتهى وقت التواصل
  // ننتقل لليوم التالي
  next.setDate(next.getDate() + 1);

  next.setHours(
    WINDOW_START_HOUR,
    0,
    0,
    0
  );

  return next;
}

// ========================================
// Messages Provider
// ========================================

export function MessagesProvider({ children }) {
  const [messages, setMessages] =
    useState(initialMessages);

  const [now, setNow] =
    useState(new Date());

  // تحديث الوقت كل 30 ثانية
  // حتى تختفي حالة الانتظار تلقائيًا عند حلول الوقت
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ========================================
  // إرسال رسالة مباشرة
  // ========================================

  const sendMessage = ({
    childId,
    fromRole,
    fromName,
    text,
  }) => {
    const sentAt = new Date();

    // القيد فقط على ولي الأمر
    const isRestricted =
      fromRole === "parent" &&
      !isWithinWindow(sentAt);

    const visibleAt = isRestricted
      ? getNextWindowStart(sentAt)
      : sentAt;

    const newMessage = {
      id:
        Date.now() +
        Math.random(),

      childId,

      fromRole,

      fromName,

      text,

      type: "direct",

      date:
        sentAt.toLocaleDateString(
          "ar-EG",
          {
            day: "numeric",
            month: "short",
          }
        ) +
        " " +
        sentAt.toLocaleTimeString(
          "ar-EG",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),

      sentAt:
        sentAt.toISOString(),

      visibleAt:
        visibleAt.toISOString(),

      pending:
        isRestricted,
    };

    setMessages((prev) => [
      ...prev,
      newMessage,
    ]);

    return newMessage;
  };

  // ========================================
  // إرسال إعلان عام
  // المعلم فقط يستخدمه
  // ========================================

  const sendAnnouncement = ({
    childIds,
    fromName,
    text,
  }) => {
    const sentAt = new Date();

    const newAnnouncements =
      childIds.map((childId) => ({
        id:
          Date.now() +
          Math.random() +
          childId,

        childId,

        fromRole: "teacher",

        fromName,

        text,

        type: "announcement",

        date:
          sentAt.toLocaleDateString(
            "ar-EG",
            {
              day: "numeric",
              month: "short",
            }
          ) +
          " " +
          sentAt.toLocaleTimeString(
            "ar-EG",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),

        sentAt:
          sentAt.toISOString(),

        visibleAt:
          sentAt.toISOString(),

        pending: false,
      }));

    setMessages((prev) => [
      ...prev,
      ...newAnnouncements,
    ]);
  };

  // ========================================
  // جلب رسائل طفل معين
  // ========================================

  const getMessagesForChild = (
    childId,
    viewerRole = null
  ) => {
    return messages
      .filter(
        (message) =>
          message.childId === childId
      )

      .filter((message) => {
        // الرسائل العادية تظهر مباشرة
        if (!message.pending) {
          return true;
        }

        // الرسالة المؤجلة:
        // المعلم لا يراها قبل وقتها
        if (viewerRole === "teacher") {
          return (
            new Date(
              message.visibleAt
            ) <= now
          );
        }

        // ولي الأمر يرى رسالته المؤجلة
        return true;
      })

      .sort(
        (a, b) =>
          new Date(a.sentAt) -
          new Date(b.sentAt)
      );
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        sendMessage,
        sendAnnouncement,
        getMessagesForChild,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

// ========================================
// Hook
// ========================================

export function useMessages() {
  const ctx =
    useContext(MessagesContext);

  if (!ctx) {
    throw new Error(
      "useMessages لازم تستخدم جوا MessagesProvider"
    );
  }

  return ctx;
}