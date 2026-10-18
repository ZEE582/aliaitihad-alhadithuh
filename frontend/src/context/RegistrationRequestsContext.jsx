import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useToast } from "./ToastContext";
import { useUser } from "./UserContext";
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
  const { user } = useUser();

  useEffect(() => {
    localStorage.setItem("app_registration_requests", JSON.stringify(requests));
  }, [requests]);

  const fetchRequestsFromApi = useCallback(async () => {
    if (user?.roleType !== "admin" && user?.roleType !== "secretary") return;
    const token = localStorage.getItem("auth_token");
    if (!token) return;

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
  }, [showError, user?.roleType]);

  useEffect(() => {
    fetchRequestsFromApi();
  }, [fetchRequestsFromApi]);

  const submitRequest = async (formData) => {
    try {
      const saved = await api.post("/registration-requests", formData);
      const token = localStorage.getItem("auth_token");
      if (token) {
        fetchRequestsFromApi();
      }
      showSuccess(S.context.registrationRequests.submitSuccess);
      return saved;
    } catch (err) {
      console.error("API Submit Registration Request Error:", err);
      const msg = getErrorMessage(err, S.context.registrationRequests.submitFailed);
      showError(msg);
      return { error: msg };
    }
  };

  const updateRequestStatus = async (id, status, extra = {}) => {
    try {
      const data = await api.put(`/registration-requests/${id}`, { status, ...extra });
      setRequests((prev) =>
        prev.map((request) => (request.id === id ? { ...request, status } : request))
      );
      if (status === "approved" && !data?.tempPassword) {
        showSuccess(S.context.registrationRequests.approvedLinkedExisting);
      } else {
        const label = status === "approved" ? S.context.registrationRequests.statusApprovedLabel : status === "rejected" ? S.context.registrationRequests.statusRejectedLabel : S.context.registrationRequests.statusUpdatedLabel;
        showSuccess(S.context.registrationRequests.updateSuccess(label));
      }
      return { success: true, data };
    } catch (err) {
      console.error("API Update Registration Request Error:", err);
      const msg = getErrorMessage(err, S.context.registrationRequests.updateFailed);
      showError(msg);
      return { error: msg };
    }
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