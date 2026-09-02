import { useState } from "react";

import {
  CheckCircle2,
  XCircle,
  Clock3,
  User,
  Phone,
  ChevronDown,
  ChevronUp,
  Baby,
  CalendarDays,
  HeartPulse,
  ShieldCheck,
  FileText,
  Users,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import { useRegistrationRequests } from "../../context/RegistrationRequestsContext";
import { useChildren } from "../../context/ChildrenContext";

// ======================================================
// Status Badge
// ======================================================

function StatusBadge({ status }) {
  const statusMap = {
    pending: {
      label: "بانتظار المراجعة",
      backgroundColor: "#E8B24D25",
      color: "#B8862F",
    },

    approved: {
      label: "تمت الموافقة",
      backgroundColor: "#4C857720",
      color: "#4C8577",
    },

    rejected: {
      label: "مرفوض",
      backgroundColor: "#C25B4A20",
      color: "#C25B4A",
    },
  };

  const current =
    statusMap[status] || statusMap.pending;

  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{
        backgroundColor:
          current.backgroundColor,
        color: current.color,
      }}
    >
      {current.label}
    </span>
  );
}

// ======================================================
// Info Item
// ======================================================

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          backgroundColor: "#FCFAF4",
        }}
      >
        <Icon
          size={15}
          style={{
            color: "#4C8577",
          }}
        />
      </div>

      <div className="min-w-0">
        <p
          className="text-[11px] mb-0.5"
          style={{
            color: "#A8B0AB",
          }}
        >
          {label}
        </p>

        <p
          className="text-sm font-medium break-words"
          style={{
            color: "#2F3A36",
          }}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

// ======================================================
// Request Card
// ======================================================

function RequestCard({
  request,
  onApprove,
  onReject,
}) {
  const [expanded, setExpanded] =
    useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EDE7D9",
      }}
    >
      {/* ==================================================
          Header
      ================================================== */}

      <button
        type="button"
        onClick={() =>
          setExpanded((previous) => !previous)
        }
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right hover:bg-[#FCFAF4] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "#EAF2EF",
            }}
          >
            <Baby
              size={19}
              style={{
                color: "#4C8577",
              }}
            />
          </div>

          <div className="text-right min-w-0">
            <p
              className="text-sm font-bold truncate"
              style={{
                color: "#2F3A36",
              }}
            >
              {request.childName ||
                "طفل جديد"}
            </p>

            <div className="flex items-center gap-1.5 mt-1">
              <CalendarDays
                size={12}
                style={{
                  color: "#A8B0AB",
                }}
              />

              <p
                className="text-xs"
                style={{
                  color: "#A8B0AB",
                }}
              >
                قُدّم بتاريخ{" "}
                {request.submittedAt}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge
            status={request.status}
          />

          {expanded ? (
            <ChevronUp
              size={17}
              style={{
                color: "#A8B0AB",
              }}
            />
          ) : (
            <ChevronDown
              size={17}
              style={{
                color: "#A8B0AB",
              }}
            />
          )}
        </div>
      </button>

      {/* ==================================================
          Details
      ================================================== */}

      {expanded && (
        <div
          className="px-5 pb-5"
          style={{
            borderTop:
              "1px solid #F3EFE3",
          }}
        >
          {/* Intro */}

          <div className="flex items-center gap-2 pt-4 mb-4">
            <FileText
              size={16}
              style={{
                color: "#4C8577",
              }}
            />

            <p
              className="text-sm font-bold"
              style={{
                color: "#2F3A36",
              }}
            >
              تفاصيل طلب التسجيل
            </p>
          </div>

          {/* ==================================================
              Child Information
          ================================================== */}

          <div className="mb-5">
            <p
              className="text-xs font-bold mb-3"
              style={{
                color: "#4C8577",
              }}
            >
              👶 معلومات الطفل
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                icon={Baby}
                label="اسم الطفل"
                value={
                  request.childName
                }
              />

              <InfoItem
                icon={User}
                label="الجنس"
                value={
                  request.gender
                }
              />

              <InfoItem
                icon={CalendarDays}
                label="تاريخ الميلاد"
                value={
                  request.birthDate
                }
              />
            </div>
          </div>

          {/* ==================================================
              Parents Information
          ================================================== */}

          <div className="mb-5">
            <p
              className="text-xs font-bold mb-3"
              style={{
                color: "#4C8577",
              }}
            >
              👨‍👩‍👧 معلومات ولي الأمر
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                icon={User}
                label="اسم الأب"
                value={
                  request.fatherName
                }
              />

              <InfoItem
                icon={Phone}
                label="هاتف الأب"
                value={
                  request.fatherPhone
                }
              />

              <InfoItem
                icon={User}
                label="اسم الأم"
                value={
                  request.motherName
                }
              />

              <InfoItem
                icon={Phone}
                label="هاتف الأم"
                value={
                  request.motherPhone
                }
              />

              <InfoItem
                icon={Users}
                label="الوضع الحالي للوالدين"
                value={
                  request.parentsStatus
                }
              />

              <InfoItem
                icon={Phone}
                label="وسيلة اتصال الطوارئ"
                value={
                  request.emergencyContact
                }
              />
            </div>
          </div>

          {/* ==================================================
              Health Conditions
          ================================================== */}

          {Array.isArray(
            request.healthConditions
          ) &&
            request.healthConditions
              .length > 0 && (
              <div
                className="rounded-xl p-4 mb-4"
                style={{
                  backgroundColor:
                    "#FBEAE7",
                  border:
                    "1px solid #F1D5CF",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <HeartPulse
                    size={16}
                    style={{
                      color: "#C25B4A",
                    }}
                  />

                  <p
                    className="text-xs font-bold"
                    style={{
                      color: "#C25B4A",
                    }}
                  >
                    حالات أو معلومات صحية
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {request.healthConditions.map(
                    (condition, index) => (
                      <span
                        key={`${condition}-${index}`}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            "#FFFFFF90",
                          color:
                            "#C25B4A",
                        }}
                      >
                        {condition}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          {/* ==================================================
              Special Needs
          ================================================== */}

          {Array.isArray(
            request.specialNeeds
          ) &&
            request.specialNeeds
              .length > 0 && (
              <div
                className="rounded-xl p-4 mb-4"
                style={{
                  backgroundColor:
                    "#EEF3F8",
                  border:
                    "1px solid #D8E2EC",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck
                    size={16}
                    style={{
                      color: "#6E8FB0",
                    }}
                  />

                  <p
                    className="text-xs font-bold"
                    style={{
                      color: "#6E8FB0",
                    }}
                  >
                    احتياجات خاصة
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {request.specialNeeds.map(
                    (need, index) => (
                      <span
                        key={`${need}-${index}`}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            "#FFFFFF90",
                          color:
                            "#6E8FB0",
                        }}
                      >
                        {need}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          {/* ==================================================
              Extra Notes
          ================================================== */}

          {request.notes && (
            <div
              className="rounded-xl p-4 mb-4"
              style={{
                backgroundColor:
                  "#FCFAF4",
                border:
                  "1px solid #F3EFE3",
              }}
            >
              <p
                className="text-xs font-bold mb-1.5"
                style={{
                  color: "#4C8577",
                }}
              >
                ملاحظات إضافية
              </p>

              <p
                className="text-sm leading-6"
                style={{
                  color: "#4A5551",
                }}
              >
                {request.notes}
              </p>
            </div>
          )}

          {/* ==================================================
              Actions
          ================================================== */}

          {request.status ===
            "pending" && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  onReject(request.id)
                }
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors hover:bg-[#FBEAE7]"
                style={{
                  border:
                    "1px solid #E2DCCC",
                  color: "#C25B4A",
                }}
              >
                <XCircle size={16} />

                رفض الطلب
              </button>

              <button
                type="button"
                onClick={() =>
                  onApprove(request)
                }
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{
                  backgroundColor:
                    "#4C8577",
                }}
              >
                <CheckCircle2
                  size={16}
                />

                قبول وإضافة للروضة
              </button>
            </div>
          )}

          {request.status ===
            "approved" && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3"
              style={{
                backgroundColor:
                  "#EAF2EF",
                color: "#4C8577",
              }}
            >
              <CheckCircle2
                size={17}
              />

              <p className="text-xs font-semibold">
                تمت الموافقة على الطلب
                وإضافة الطفل إلى النظام.
              </p>
            </div>
          )}

          {request.status ===
            "rejected" && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3"
              style={{
                backgroundColor:
                  "#FBEAE7",
                color: "#C25B4A",
              }}
            >
              <XCircle size={17} />

              <p className="text-xs font-semibold">
                تم رفض طلب التسجيل.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ======================================================
// Registration Requests Page
// ======================================================

export default function RegistrationRequestsPage({
  onNavigate,
  onLogout,
}) {
  const {
    requests,
    updateRequestStatus,
  } = useRegistrationRequests();

  const { addChild } =
    useChildren();

  const [filter, setFilter] =
    useState("pending");

  // ======================================================
  // Counts
  // ======================================================

  const pendingCount =
    requests.filter(
      (request) =>
        request.status === "pending"
    ).length;

  const approvedCount =
    requests.filter(
      (request) =>
        request.status === "approved"
    ).length;

  const rejectedCount =
    requests.filter(
      (request) =>
        request.status === "rejected"
    ).length;

  // ======================================================
  // Filter
  // ======================================================

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter(
          (request) =>
            request.status === filter
        );

  // ======================================================
  // Approve
  // ======================================================

  const handleApprove = (request) => {
    const parentName =
      request.fatherName ||
      request.motherName ||
      "ولي أمر";

    const parentPhone =
      request.fatherPhone ||
      request.motherPhone ||
      "";

    const calculatedAge =
      request.age ?? "";

    addChild({
      name:
        request.childName ||
        "طفل جديد",

      classroom:
        "بانتظار توزيع الصف",

      age: calculatedAge,

      parent: parentName,

      parentPhone: parentPhone,

      gender:
        request.gender || "",

      birthDate:
        request.birthDate || "",

      fatherName:
        request.fatherName || "",

      fatherPhone:
        request.fatherPhone || "",

      motherName:
        request.motherName || "",

      motherPhone:
        request.motherPhone || "",

      parentsStatus:
        request.parentsStatus || "",

      emergencyContact:
        request.emergencyContact || "",

      healthConditions:
        Array.isArray(
          request.healthConditions
        )
          ? request.healthConditions
          : [],

      specialNeeds:
        Array.isArray(
          request.specialNeeds
        )
          ? request.specialNeeds
          : [],

      registrationRequestId:
        request.id,

      registrationDate:
        request.submittedAt,
    });

    updateRequestStatus(
      request.id,
      "approved"
    );
  };

  // ======================================================
  // Reject
  // ======================================================

  const handleReject = (id) => {
    const confirmed = window.confirm(
      "هل أنتِ متأكدة من رفض طلب التسجيل؟"
    );

    if (!confirmed) {
      return;
    }

    updateRequestStatus(
      id,
      "rejected"
    );
  };

  // ======================================================
  // Filter buttons
  // ======================================================

  const filters = [
    {
      key: "pending",
      label: "بانتظار المراجعة",
      count: pendingCount,
    },
    {
      key: "approved",
      label: "مقبولة",
      count: approvedCount,
    },
    {
      key: "rejected",
      label: "مرفوضة",
      count: rejectedCount,
    },
    {
      key: "all",
      label: "الكل",
      count: requests.length,
    },
  ];

  return (
    <DashboardLayout
      activePage="registration-requests"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle="طلبات التسجيل"
    >
      {/* ==================================================
          Welcome Header
      ================================================== */}

      <div
        className="rounded-3xl p-6 mb-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #EAF2EF 0%, #F7F4EA 100%)",
          border:
            "1px solid #DDE9E4",
        }}
      >
        <div
          className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-40"
          style={{
            backgroundColor:
              "#D8E8E2",
          }}
        />

        <div
          className="absolute -bottom-12 right-10 w-28 h-28 rounded-full opacity-30"
          style={{
            backgroundColor:
              "#F1DFC0",
          }}
        />

        <div className="relative flex items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">
                🌷
              </span>

              <span
                className="text-xs font-semibold"
                style={{
                  color: "#4C8577",
                }}
              >
                تسجيلات جديدة
              </span>
            </div>

            <h2
              className="text-xl md:text-2xl font-bold"
              style={{
                color: "#2F3A36",
              }}
            >
              طلبات الالتحاق بالروضة
            </h2>

            <p
              className="text-sm mt-2 leading-6"
              style={{
                color: "#68736F",
              }}
            >
              راجعي طلبات الأهالي قبل
              اعتماد تسجيل أطفالهم في
              الروضة. 💚
            </p>
          </div>

          <div
            className="hidden sm:flex w-16 h-16 rounded-3xl items-center justify-center"
            style={{
              backgroundColor:
                "#FFFFFF90",
              border:
                "1px solid #FFFFFF",
            }}
          >
            <FileText
              size={27}
              style={{
                color: "#4C8577",
              }}
            />
          </div>
        </div>
      </div>

      {/* ==================================================
          Statistics
      ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            backgroundColor:
              "#FFFFFF",
            border:
              "1px solid #EDE7D9",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor:
                "#FCF3DE",
            }}
          >
            <Clock3
              size={18}
              style={{
                color: "#B8862F",
              }}
            />
          </div>

          <div>
            <p
              className="text-lg font-bold"
              style={{
                color: "#2F3A36",
              }}
            >
              {pendingCount}
            </p>

            <p
              className="text-xs"
              style={{
                color: "#7A8580",
              }}
            >
              طلب يحتاج مراجعة
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            backgroundColor:
              "#FFFFFF",
            border:
              "1px solid #EDE7D9",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor:
                "#EAF2EF",
            }}
          >
            <CheckCircle2
              size={18}
              style={{
                color: "#4C8577",
              }}
            />
          </div>

          <div>
            <p
              className="text-lg font-bold"
              style={{
                color: "#2F3A36",
              }}
            >
              {approvedCount}
            </p>

            <p
              className="text-xs"
              style={{
                color: "#7A8580",
              }}
            >
              طلب تمت الموافقة عليه
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            backgroundColor:
              "#FFFFFF",
            border:
              "1px solid #EDE7D9",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor:
                "#FBEAE7",
            }}
          >
            <XCircle
              size={18}
              style={{
                color: "#C25B4A",
              }}
            />
          </div>

          <div>
            <p
              className="text-lg font-bold"
              style={{
                color: "#2F3A36",
              }}
            >
              {rejectedCount}
            </p>

            <p
              className="text-xs"
              style={{
                color: "#7A8580",
              }}
            >
              طلب مرفوض
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          Filters
      ================================================== */}

      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() =>
              setFilter(item.key)
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor:
                filter === item.key
                  ? "#4C8577"
                  : "#FFFFFF",

              color:
                filter === item.key
                  ? "#FBF7EF"
                  : "#4A5551",

              border:
                "1px solid #EDE7D9",
            }}
          >
            <span>
              {item.label}
            </span>

            <span
              className="text-[11px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center"
              style={{
                backgroundColor:
                  filter === item.key
                    ? "#FFFFFF25"
                    : "#FCFAF4",

                color:
                  filter === item.key
                    ? "#FBF7EF"
                    : "#7A8580",
              }}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {/* ==================================================
          Requests
      ================================================== */}

      <div className="space-y-3">
        {filteredRequests.length ===
        0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl"
            style={{
              backgroundColor:
                "#FFFFFF",
              border:
                "1px solid #EDE7D9",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "#FCFAF4",
              }}
            >
              <FileText
                size={24}
                style={{
                  color: "#A8B0AB",
                }}
              />
            </div>

            <p
              className="text-sm font-semibold mt-4"
              style={{
                color: "#4A5551",
              }}
            >
              لا توجد طلبات هنا حاليًا
            </p>

            <p
              className="text-xs mt-1"
              style={{
                color: "#A8B0AB",
              }}
            >
              ستظهر طلبات الأهالي هنا
              عند إرسالها.
            </p>
          </div>
        ) : (
          filteredRequests.map(
            (request) => (
              <RequestCard
                key={request.id}
                request={request}
                onApprove={
                  handleApprove
                }
                onReject={
                  handleReject
                }
              />
            )
          )
        )}
      </div>
    </DashboardLayout>
  );
}