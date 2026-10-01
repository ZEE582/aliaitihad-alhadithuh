import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { strings as S } from "../constants/strings";

const RegistrationRequestsContext = createContext(null);

const getErrorMessage = (err, fallback) => {
  if (err?.status === 403) return S.context.children.error403;
  if (err?.status === 404) return S.context.registrationRequests.error404;
  if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch"))
    return S.context.children.errorNetwork;
  return err?.message || fallback;
};

export function RegistrationRequestsProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("app_registration_requests");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    localStorage.setItem("app_registration_requests", JSON.stringify(requests));
  }, [requests]);

  const fetchRequestsFromApi = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token || token.startsWith("demo_token_")) return;

    setLoading(true);
    try {
      const data = await api.get("/registration-requests");
      if (Array.isArray(data)) setRequests(data);
    } catch (err) {
      console.error("API Fetch Registration Requests Error:", err);
      showError(getErrorMessage(err, S.context.registrationRequests.fetchFailed));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchRequestsFromApi();
  }, [fetchRequestsFromApi]);

  const submitRequest = async (formData) => {
    const token = localStorage.getItem("auth_token");

    if (token && !token.startsWith("demo_token_")) {
      try {
        const saved = await api.post("/registration-requests", formData);
        setRequests((prev) => [saved, ...prev]);
        showSuccess(S.context.registrationRequests.submitSuccess);
        return saved;
      } catch (err) {
        console.error("API Submit Registration Request Error:", err);
        const msg = getErrorMessage(err, S.context.registrationRequests.submitFailed);
        showError(msg);
        return { error: msg };
      }
    }

    // demo mode
    const newRequest = {
      id: Date.now(),
      status: "pending",
      submittedAt: new Date().toLocaleDateString("ar-EG", {
        day: "numeric", month: "long", year: "numeric",
      }),
      ...formData,
    };
    setRequests((prev) => [newRequest, ...prev]);
    showSuccess(S.context.registrationRequests.submitDemoSuccess);
    return newRequest;
  };

  const updateRequestStatus = async (id, status) => {
    const token = localStorage.getItem("auth_token");

    if (token && !token.startsWith("demo_token_")) {
      try {
        await api.put(`/registration-requests/${id}`, { status });
        setRequests((prev) =>
          prev.map((request) => (request.id === id ? { ...request, status } : request))
        );
        const label = status === "approved" ? S.context.registrationRequests.statusApprovedLabel : status === "rejected" ? S.context.registrationRequests.statusRejectedLabel : S.context.registrationRequests.statusUpdatedLabel;
        showSuccess(S.context.registrationRequests.updateSuccess(label));
        return { success: true };
      } catch (err) {
        console.error("API Update Registration Request Error:", err);
        const msg = getErrorMessage(err, S.context.registrationRequests.updateFailed);
        showError(msg);
        return { error: msg };
      }
    }

    // demo mode
    setRequests((prev) =>
      prev.map((request) => (request.id === id ? { ...request, status } : request))
    );
    showSuccess(S.context.registrationRequests.updateDemoSuccess);
  };

  // ======================================================
  // الطلبات المعلقة
  // ======================================================

  const getPendingRequests = () => requests.filter((r) => r.status === "pending");

  const pendingRequestsCount = requests.filter((r) => r.status === "pending").length;

  return (
    <RegistrationRequestsContext.Provider
      value={{ requests, loading, submitRequest, updateRequestStatus, getPendingRequests, pendingRequestsCount }}
    >
      {children}
    </RegistrationRequestsContext.Provider>
  );
}

export function useRegistrationRequests() {
  const ctx = useContext(RegistrationRequestsContext);
  if (!ctx) throw new Error("useRegistrationRequests لازم تستخدم جوا RegistrationRequestsProvider");
  return ctx;
}