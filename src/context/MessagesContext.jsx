import { createContext, useContext, useState } from "react";

const MessagesContext = createContext(null);

const initialMessages = [
  {
    id: 1,
    childId: 1, // رهف يوسف
    fromRole: "parent",
    fromName: "محمد يوسف",
    text: "ممكن أعرف كيف كان يوم رهف اليوم؟ لاحظت إنها متعبة الصبح",
    date: "اليوم، 8:30 ص",
    read: true,
    type: "message",
  },
  {
    id: 2,
    childId: 1,
    fromRole: "teacher",
    fromName: "أ. نور سلامة",
    text: "صباح الخير، رهف كانت بخير وشاركت بكل الأنشطة، بس فعلاً بدت متعبة شوي وقت الغدا",
    date: "اليوم، 9:10 ص",
    read: true,
    type: "message",
  },
  {
    id: 3,
    childId: 1,
    fromRole: "parent",
    fromName: "محمد يوسف",
    text: "تمام شكراً، رح أخليها تنام بدري الليلة",
    date: "اليوم، 9:15 ص",
    read: false, // المعلم لسا ما شافها
    type: "message",
  },
];

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState(initialMessages);

  // رسالة عادية مرتبطة بطفل واحد
  const sendMessage = ({ childId, fromRole, fromName, text }) => {
    const newMsg = {
      id: Date.now(),
      childId,
      fromRole,
      fromName,
      text,
      date: "الآن",
      read: false,
      type: "message",
    };
    setMessages((prev) => [...prev, newMsg]);
    return newMsg;
  };

  const sendAnnouncement = ({ childIds, fromName, text }) => {
    const today = "الآن";
    const newMessages = childIds.map((childId) => ({
      id: Date.now() + childId, // نضمن id فريد لكل نسخة
      childId,
      fromRole: "teacher",
      fromName,
      text,
      date: today,
      read: false,
      type: "announcement",
    }));
    setMessages((prev) => [...prev, ...newMessages]);
  };

  const markAsRead = (messageId) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, read: true } : m)));
  };

  // كل الرسائل الخاصة بطفل معين، مرتبة زمنياً
  const getMessagesForChild = (childId) => messages.filter((m) => m.childId === childId);

  // عدد الرسائل الغير مقروءة الموجهة لدور معين (تُستخدم بجرس الإشعارات)
  // منطق بسيط: أي رسالة الطرف المرسل لها مختلف عن الدور الحالي وغير مقروءة
  const getUnreadCount = (roleType) => {
    const oppositeRole = roleType === "teacher" ? "parent" : "teacher";
    return messages.filter((m) => m.fromRole === oppositeRole && !m.read).length;
  };

  return (
    <MessagesContext.Provider
      value={{ messages, sendMessage, sendAnnouncement, markAsRead, getMessagesForChild, getUnreadCount }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useMessages لازم تستخدم جوا MessagesProvider");
  return ctx;
}