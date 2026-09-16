import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { strings as S } from "../constants/strings";

const UserContext = createContext(null);

// الأدوار الموجودة في النظام:
// admin      = مدير/ة الروضة
// secretary  = سكرتير/ة المدير
// teacher    = معلم/ة
// parent     = ولي أمر

export const demoAccounts = {
  admin: {
    id: 1,
    name: "أ. سارة أحمد",
    role: "مديرة الروضة",
    roleType: "admin",
    gender: "female",
    email: "sara.ahmad@barae-kg.edu",
    phone: "059-1234567",
    joinDate: "أيلول 2022",
  },

  secretary: {
    id: 2,
    name: "أ. ليان خالد",
    role: "سكرتيرة المدير",
    roleType: "secretary",
    gender: "female",
    email: "layan.khaled@barae-kg.edu",
    phone: "059-4455667",
    joinDate: "آذار 2024",
  },

  teacher: {
    id: 3,
    name: "أ. نور سلامة",
    role: "معلمة",
    roleType: "teacher",
    gender: "female",
    email: "nour.salame@barae-kg.edu",
    phone: "059-1112223",
    joinDate: "شباط 2023",
    classroom: "صف الفراشات",
  },

  parent: {
    id: 4,
    name: "محمد يوسف",
    role: "ولي أمر",
    roleType: "parent",
    gender: "male",
    email: "mohammad.yousef@gmail.com",
    phone: "059-1234567",
    joinDate: "أيلول 2024",
    childIds: [1],
  },
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("auth_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // حفظ بيانات المستخدم المحظوظة
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
    }
  }, [user]);

  // الدخول عن طريق الباك إند الحقيقي
  const loginWithCredentials = async (username, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await api.post("/auth/login", { username, password });
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      setUser(data.user);
      setLoading(false);
      return data;
    } catch (err) {
      setAuthError(err.message || S.context.auth.loginFailedFallback);
      setLoading(false);
      throw err;
    }
  };

  // الدخول الديمو التجريبي الحالي
  const login = (roleType) => {
    const account = demoAccounts[roleType];

    if (!account) {
      console.error("الدور غير موجود:", roleType);
      return;
    }

    localStorage.setItem("auth_token", "demo_token_" + roleType);
    setUser(account);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  const updateUser = (formData) => {
    setUser((prev) => ({
      ...prev,
      ...formData,
    }));
  };

  const isFemale =
    user?.gender === "female" ||
    user?.roleType === "teacher" ||
    (user?.roleType === "admin" && user?.name?.includes("سارة")) ||
    user?.role?.includes("مديرة") ||
    user?.role?.includes("معلمة") ||
    user?.role?.includes("سكرتيرة");

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        authError,
        isFemale: !!isFemale,
        login,
        loginWithCredentials,
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