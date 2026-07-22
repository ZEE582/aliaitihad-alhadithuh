import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

// حسابات تجريبية لكل دور، لحد ما يجهز الـ API الحقيقي ويصير الدور جاي من السيرفر
// roleType: "admin" | "teacher" | "parent" -- هاد يلي بيتحكم بالصلاحيات والفلترة بكل التطبيق
// classroom: يستخدم بس لو roleType = teacher (أي صف هو مسؤول عنه)
// childIds: يستخدم بس لو roleType = parent (أطفاله بالروضة، مصفوفة لأنه ممكن أكتر من طفل)
export const demoAccounts = {
  admin: {
    name: "أ. سارة أحمد",
    role: "مديرة الروضة",
    roleType: "admin",
    email: "sara.ahmad@barae-kg.edu",
    phone: "059-1234567",
    joinDate: "أيلول 2022",
  },
  teacher: {
    name: "أ. نور سلامة",
    role: "معلمة",
    roleType: "teacher",
    email: "nour.salame@barae-kg.edu",
    phone: "059-1112223",
    joinDate: "شباط 2023",
    classroom: "صف الفراشات",
  },
  parent: {
    name: "محمد يوسف",
    role: "ولي أمر",
    roleType: "parent",
    email: "mohammad.yousef@gmail.com",
    phone: "059-1234567",
    joinDate: "أيلول 2024",
    childIds: [1], // بيقابل id الطفل "رهف يوسف" بـ ChildrenContext
  },
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // null يعني لسا ما سجل دخول

  const login = (roleType) => {
    setUser(demoAccounts[roleType]);
  };

  const logout = () => setUser(null);

  const updateUser = (formData) => {
    setUser((prev) => ({ ...prev, ...formData }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser لازم تستخدم جوا UserProvider");
  return ctx;
}