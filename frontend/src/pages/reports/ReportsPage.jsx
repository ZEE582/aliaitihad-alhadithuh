import { useState } from "react";
import {
  Download,
  Printer,
  FileBarChart,
  CalendarDays,
  Users,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

import { strings as S } from "../../constants/strings";

const reportTypes = [
  {
    key: "attendance",
    label: S.reports.reportAttendance,
    description: S.reports.reportAttendanceDesc,
    icon: ClipboardCheck,
  },
  {
    key: "children",
    label: S.reports.reportChildren,
    description: S.reports.reportChildrenDesc,
    icon: Users,
  },
  {
    key: "behavior",
    label: S.reports.reportBehavior,
    description: S.reports.reportBehaviorDesc,
    icon: Sparkles,
  },
];

export default function ReportsPage({ onNavigate, onLogout }) {
  const [reportType, setReportType] = useState("attendance");
  const [classroom, setClassroom] = useState("الكل");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const selectedReport = reportTypes.find(
    (report) => report.key === reportType
  );

  const SelectedIcon = selectedReport?.icon || FileBarChart;

  return (
    <DashboardLayout
      activePage="reports"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.reports.pageTitle}
    >
      {/* Header */}
      <div className="mb-6">
        <div
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{
            backgroundColor: "#F4F8F7",
            border: "1px solid #E2ECE8",
          }}
        >
          <div
            className="absolute -top-12 -left-12 w-32 h-32 rounded-full"
            style={{ backgroundColor: "#4C857710" }}
          />

          <div className="relative flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#EAF2EF" }}
            >
              <FileBarChart size={25} style={{ color: "#4C8577" }} />
            </div>

            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: "#2F3A36" }}
              >
                {S.reports.headerTitle}
              </h2>

              <p
                className="text-sm mt-1"
                style={{ color: "#7A8580" }}
              >
                {S.reports.headerDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="mb-5">
        <h3
          className="text-sm font-bold mb-3"
          style={{ color: "#2F3A36" }}
        >
          {S.reports.reportTypeLabel}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isSelected = reportType === report.key;

            return (
              <button
                key={report.key}
                type="button"
                onClick={() => setReportType(report.key)}
                className="text-right rounded-2xl p-4 transition-all"
                style={{
                  backgroundColor: isSelected ? "#F0F6F4" : "#FFFFFF",
                  border: `1px solid ${
                    isSelected ? "#BFD8D0" : "#EDE7D9"
                  }`,
                  boxShadow: isSelected
                    ? "0 8px 24px rgba(76,133,119,0.08)"
                    : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isSelected
                        ? "#E0EEE9"
                        : "#F7F6F0",
                    }}
                  >
                    <Icon
                      size={19}
                      style={{
                        color: isSelected ? "#4C8577" : "#7A8580",
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="text-sm font-bold"
                      style={{ color: "#2F3A36" }}
                    >
                      {report.label}
                    </p>

                    <p
                      className="text-xs mt-1"
                      style={{ color: "#8A9490" }}
                    >
                      {report.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-3xl p-5 mb-5"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EDE7D9",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#F4F8F7" }}
          >
            <CalendarDays size={17} style={{ color: "#4C8577" }} />
          </div>

          <div>
            <h3
              className="text-sm font-bold"
              style={{ color: "#2F3A36" }}
            >
              {S.reports.filterTitle}
            </h3>

            <p
              className="text-[11px] mt-0.5"
              style={{ color: "#A8B0AB" }}
            >
              {S.reports.filterDescription}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Classroom */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "#7A8580" }}
            >
              {S.reports.classroomLabel}
            </label>

            <select
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            >
              <option>الكل</option>
              <option>صف الفراشات</option>
              <option>صف النجوم</option>
              <option>صف القمر</option>
              <option>صف الشمس</option>
            </select>
          </div>

          {/* From */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "#7A8580" }}
            >
              {S.reports.fromDateLabel}
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            />
          </div>

          {/* To */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "#7A8580" }}
            >
              {S.reports.toDateLabel}
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FCFAF4",
                color: "#2F3A36",
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t" style={{ borderColor: "#F1EDE3" }}>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            style={{
              backgroundColor: "#4C8577",
              boxShadow: "0 6px 16px rgba(76,133,119,0.15)",
            }}
          >
            <FileBarChart size={16} />
            {S.reports.showReportButton}
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
            style={{
              border: "1px solid #E2DCCC",
              color: "#4A5551",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Download size={16} />
            {S.reports.exportPdfButton}
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
            style={{
              border: "1px solid #E2DCCC",
              color: "#4A5551",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Printer size={16} />
            {S.reports.printButton}
          </button>
        </div>
      </div>

      {/* Results Preview */}
      <div
          className="rounded-3xl p-6 sm:p-10 min-h-[260px] flex flex-col items-center justify-center text-center"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EDE7D9",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "#F4F8F7" }}
        >
          <SelectedIcon size={27} style={{ color: "#4C8577" }} />
        </div>

        <h3
          className="text-sm font-bold"
          style={{ color: "#2F3A36" }}
        >
          {selectedReport?.label}
        </h3>

        <p
          className="text-xs mt-2 max-w-sm leading-6"
          style={{ color: "#A8B0AB" }}
        >
          {S.reports.previewHintBefore}
          <span style={{ color: "#4C8577", fontWeight: 600 }}>
            {" "}
            {S.reports.previewHintAction}
          </span>{" "}
          {S.reports.previewHintAfter}
        </p>
      </div>
    </DashboardLayout>
  );
}