import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

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

  if (date.getHours() < WINDOW_START_HOUR) {
    next.setHours(WINDOW_START_HOUR, 0, 0, 0);

    return next;
  }

  next.setDate(next.getDate() + 1);

  next.setHours(WINDOW_START_HOUR, 0, 0, 0);

  return next;
}

const formatMessageDate = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return (
    date.toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "short",
    }) +
    " " +
    date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

const normalizeMessage = (message) => ({
  id: message.id,
  childId: message.childId,
  fromRole: message.sender?.roleType || "",
  fromName: message.sender?.fullName || "",
  toRole: message.receiver?.roleType || "",
  toName: message.receiver?.fullName || "",
  text: message.content || "",
  subject: message.subject || "",
  type: "direct",
  date: formatMessageDate(message.createdAt),
  sentAt: message.createdAt,
  visibleAt: message.createdAt,
  pending: false,
  senderId: message.senderId,
  receiverId: message.receiverId,
  isRead: !!message.isRead,
});

// ========================================
// Messages Provider
// ========================================

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState(initialMessages);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchMessagesFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const data = await api.get("/messages");
      if (Array.isArray(data)) {
        setMessages((prev) => [
          ...data.map(normalizeMessage),
          ...prev.filter((m) => m.pending),
        ]);
      }
    } catch (err) {
      console.error("API Fetch Messages Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchMessagesFromApi();
  }, [fetchMessagesFromApi]);

  // ========================================
  // إرسال رسالة مباشرة
  // ========================================

  const sendMessage = ({
    childId,
    receiverId,
    fromRole,
    fromName,
    text,
  }) => {
    const sentAt = new Date();

    const isRestricted =
      fromRole === "parent" && !isWithinWindow(sentAt);

    const visibleAt = isRestricted ? getNextWindowStart(sentAt) : sentAt;

    const newMessage = {
      id: Date.now() + Math.random(),
      childId,
      fromRole,
      fromName,
      text,
      type: "direct",
      date: formatMessageDate(sentAt),
      sentAt: sentAt.toISOString(),
      visibleAt: visibleAt.toISOString(),
      pending: isRestricted,
    };

    setMessages((prev) => [...prev, newMessage]);

    const token = localStorage.getItem("auth_token");
    if (token) {
      api
        .post("/messages", { childId, receiverId, content: text })
        .then((saved) => {
          const normalized = normalizeMessage(saved);
          setMessages((prev) =>
            prev.map((m) => (m.id === newMessage.id ? normalized : m))
          );
        })
        .catch((err) => {
          console.error("API Send Message Error:", err);
          setMessages((prev) => prev.filter((m) => m.id !== newMessage.id));
        });
    }

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

    const newAnnouncements = childIds.map((childId) => ({
      id: Date.now() + Math.random() + childId,
      childId,
      fromRole: "teacher",
      fromName,
      text,
      type: "announcement",
      date: formatMessageDate(sentAt),
      sentAt: sentAt.toISOString(),
      visibleAt: sentAt.toISOString(),
      pending: false,
    }));

    setMessages((prev) => [...prev, ...newAnnouncements]);

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    Promise.all(
      childIds.map((childId) =>
        api
          .post("/messages", { childId, content: text })
          .then((saved) => ({ childId, saved }))
          .catch((err) => {
            console.error("API Send Announcement Error:", err);
            return null;
          })
      )
    ).then((results) => {
      const savedMap = {};
      results.forEach((r) => {
        if (r) savedMap[r.childId] = normalizeMessage(r.saved);
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.type === "announcement" && savedMap[m.childId]
            ? savedMap[m.childId]
            : m
        )
      );
    });
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
        if (!message.pending) {
          return true;
        }

        if (viewerRole === "teacher") {
          return (
            new Date(
              message.visibleAt
            ) <= now
          );
        }

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