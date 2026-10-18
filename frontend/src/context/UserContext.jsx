import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { strings as S } from "../constants/strings";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // التحقق من التوكن المحفوظ عند الإقلاع عبر الخادم، لا عبر localStorage
  useEffect(() => {
    let cancelled = false;

    const token = localStorage.getItem("auth_token");

    if (!token) {
      setInitializing(false);
      return;
    }

    (async () => {
      try {
        const data = await api.get("/auth/me");
        if (!cancelled) setUser(data.user);
      } catch (err) {
        if (!cancelled) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout Error:", err.message);
    }
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setUser(null);
    };

    const handlePasswordChangeRequired = () => {
      setUser((prev) => (prev ? { ...prev, mustChangePassword: true } : prev));
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    window.addEventListener("auth:password-change-required", handlePasswordChangeRequired);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
      window.removeEventListener("auth:password-change-required", handlePasswordChangeRequired);
    };
  }, []);

  const updateUser = async (formData) => {
    if (!user) {
      throw new Error(S.context.auth.loginFailedFallback);
    }

    const payload = {};
    if (formData.fullName !== undefined) payload.fullName = formData.fullName;
    if (formData.email !== undefined) payload.email = formData.email;
    if (formData.phone !== undefined) payload.phone = formData.phone;
    if (formData.avatar !== undefined) payload.avatar = formData.avatar;

    const data = await api.put(`/users/${user.id}`, payload);
    if (data && data.id) {
      setUser((prev) => ({ ...prev, ...data }));
    }
    return data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) {
      throw new Error(S.context.auth.loginFailedFallback);
    }
    const data = await api.put(`/users/${user.id}`, {
      currentPassword,
      newPassword,
    });
    if (data && data.id) {
      setUser((prev) => ({ ...prev, ...data }));
    }
    return data;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        initializing,
        loading,
        authError,
        loginWithCredentials,
        logout,
        updateUser,
        changePassword,
      }}
    >
      {initializing ? (
        <div
          dir="rtl"
          className="min-h-screen w-full flex items-center justify-center"
          style={{ backgroundColor: "#FBF7EF" }}
        >
          <p className="text-sm" style={{ color: "#7A8580" }}>
            جارٍ التحميل...
          </p>
        </div>
      ) : (
        children
      )}
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