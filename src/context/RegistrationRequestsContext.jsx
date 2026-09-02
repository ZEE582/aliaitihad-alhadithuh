import { createContext, useContext, useState } from "react";

const RegistrationRequestsContext = createContext(null);

// ======================================================
// طلبات التسجيل
// pending   = بانتظار المراجعة
// approved  = تمت الموافقة
// rejected  = مرفوض
// ======================================================

const initialRequests = [];

export function RegistrationRequestsProvider({ children }) {
  const [requests, setRequests] = useState(initialRequests);

  // ======================================================
  // إرسال طلب تسجيل جديد
  // ======================================================

  const submitRequest = (formData) => {
    const newRequest = {
      id: Date.now(),
      status: "pending",

      submittedAt: new Date().toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),

      ...formData,
    };

    setRequests((prev) => [
      newRequest,
      ...prev,
    ]);

    return newRequest;
  };

  // ======================================================
  // تحديث حالة الطلب
  // ======================================================

  const updateRequestStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
            }
          : request
      )
    );
  };

  // ======================================================
  // الطلبات المعلقة
  // ======================================================

  const getPendingRequests = () => {
    return requests.filter(
      (request) => request.status === "pending"
    );
  };

  // ======================================================
  // عدد الطلبات المعلقة
  // ======================================================

  const pendingRequestsCount = requests.filter(
    (request) => request.status === "pending"
  ).length;

  return (
    <RegistrationRequestsContext.Provider
      value={{
        requests,
        submitRequest,
        updateRequestStatus,
        getPendingRequests,
        pendingRequestsCount,
      }}
    >
      {children}
    </RegistrationRequestsContext.Provider>
  );
}

export function useRegistrationRequests() {
  const ctx = useContext(
    RegistrationRequestsContext
  );

  if (!ctx) {
    throw new Error(
      "useRegistrationRequests لازم تستخدم جوا RegistrationRequestsProvider"
    );
  }

  return ctx;
}