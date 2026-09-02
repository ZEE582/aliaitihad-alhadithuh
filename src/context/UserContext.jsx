import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

// الأدوار الموجودة في النظام:
// admin      = مدير/ة الروضة
// secretary  = سكرتير/ة المدير
// teacher    = معلم/ة
// parent     = ولي أمر

export const demoAccounts = {
  admin: {
    name: "أ. سارة أحمد",
    role: "مديرة الروضة",
    roleType: "admin",
    email: "sara.ahmad@barae-kg.edu",
    phone: "059-1234567",
    joinDate: "أيلول 2022",
  },

  secretary: {
    name: "أ. ليان خالد",
    role: "سكرتيرة المدير",
    roleType: "secretary",
    email: "layan.khaled@barae-kg.edu",
    phone: "059-4455667",
    joinDate: "آذار 2024",
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
    childIds: [1],
  },
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (roleType) => {
    const account = demoAccounts[roleType];

    if (!account) {
      console.error("الدور غير موجود:", roleType);
      return;
    }

    setUser(account);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (formData) => {
    setUser((prev) => ({
      ...prev,
      ...formData,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error("useUser لازم تستخدم جوا UserProvider");
  }

  return ctx;
}