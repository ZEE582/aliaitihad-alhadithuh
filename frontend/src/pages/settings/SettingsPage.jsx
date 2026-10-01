import { useState } from "react";
import {
  Bell,
  Lock,
  Globe,
  ChevronLeft,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { strings as S } from "../../constants/strings";

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-4"
      style={{ borderBottom: "1px solid #F3EFE3" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: checked ? "#EAF2EF" : "#FCFAF4",
          }}
        >
          <Icon
            size={17}
            style={{
              color: checked ? "#4C8577" : "#A8B0AB",
            }}
          />
        </div>

        <div className="min-w-0">
          <p
            className="text-sm font-semibold"
            style={{ color: "#2F3A36" }}
          >
            {label}
          </p>

          <p
            className="text-xs mt-1 leading-5"
            style={{ color: "#A8B0AB" }}
          >
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        className="w-11 h-6 rounded-full relative transition-all shrink-0"
        style={{
          backgroundColor: checked ? "#4C8577" : "#E2DCCC",
        }}
        aria-pressed={checked}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
          style={{
            right: checked ? "2px" : "22px",
            boxShadow: "0 1px 4px rgba(47,58,54,0.12)",
          }}
        />
      </button>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: "#F4F8F7" }}
      >
        <Icon size={18} style={{ color: "#4C8577" }} />
      </div>

      <div>
        <h3
          className="text-sm font-bold"
          style={{ color: "#2F3A36" }}
        >
          {title}
        </h3>

        {description && (
          <p
            className="text-xs mt-0.5"
            style={{ color: "#A8B0AB" }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage({ onNavigate, onLogout }) {
  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  return (
    <DashboardLayout
      activePage="settings"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.settings.pageTitle}
    >
      <div dir="rtl" className="max-w-2xl space-y-5">
        {/* Intro */}
        <div
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{
            backgroundColor: "#F4F8F7",
            border: "1px solid #E2ECE8",
          }}
        >
          <div
            className="absolute -left-8 -top-8 w-28 h-28 rounded-full"
            style={{ backgroundColor: "#4C857710" }}
          />

          <div className="relative flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#EAF2EF" }}
            >
              <Settings2 size={24} style={{ color: "#4C8577" }} />
            </div>

            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: "#2F3A36" }}
              >
                {S.settings.systemSettingsTitle}
              </h2>

              <p
                className="text-xs mt-1 leading-5"
                style={{ color: "#7A8580" }}
              >
                {S.settings.introDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div
          className="rounded-3xl p-6"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
          }}
        >
          <SectionHeader
            icon={Bell}
            title={S.settings.notificationsSectionTitle}
            description={S.settings.notificationsSectionDesc}
          />

          <ToggleRow
            icon={Bell}
            label={S.settings.inAppNotificationsLabel}
            description={S.settings.inAppNotificationsDesc}
            checked={notifications}
            onChange={() => setNotifications((v) => !v)}
          />

          <div style={{ borderBottom: "none" }}>
            <ToggleRow
              icon={Bell}
              label={S.settings.smsAlertsLabel}
              description={S.settings.smsAlertsDesc}
              checked={smsAlerts}
              onChange={() => setSmsAlerts((v) => !v)}
            />
          </div>
        </div>

        {/* Security */}
        <div
          className="rounded-3xl p-6"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
          }}
        >
          <SectionHeader
            icon={ShieldCheck}
            title={S.settings.securitySectionTitle}
            description={S.settings.securitySectionDesc}
          />

          <button
            type="button"
            className="w-full flex items-center justify-between rounded-2xl p-3.5 transition-all hover:bg-[#FCFAF4]"
            style={{
              border: "1px solid #F0ECE2",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#FCFAF4" }}
              >
                <Lock size={16} style={{ color: "#4C8577" }} />
              </div>

              <div className="text-right">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#2F3A36" }}
                >
                  {S.settings.changePasswordLabel}
                </p>

                <p
                  className="text-xs mt-0.5"
                  style={{ color: "#A8B0AB" }}
                >
                  {S.settings.changePasswordDesc}
                </p>
              </div>
            </div>

            <ChevronLeft
              size={17}
              style={{ color: "#A8B0AB" }}
            />
          </button>
        </div>

        {/* Language */}
        <div
          className="rounded-3xl p-6"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
          }}
        >
          <SectionHeader
            icon={Globe}
            title={S.settings.languageSectionTitle}
            description={S.settings.languageSectionDesc}
          />

          <div
            className="flex items-center justify-between gap-4 rounded-2xl p-3.5"
            style={{
              backgroundColor: "#FCFAF4",
              border: "1px solid #EDE7D9",
            }}
          >
            <div className="flex items-center gap-3">
              <Globe
                size={17}
                style={{ color: "#4C8577" }}
              />

              <span
                className="text-sm font-medium"
                style={{ color: "#2F3A36" }}
              >
                {S.settings.systemLanguageLabel}
              </span>
            </div>

            <select
              className="rounded-xl py-2 px-3 text-sm outline-none"
              style={{
                border: "1px solid #E2DCCC",
                backgroundColor: "#FFFFFF",
                color: "#2F3A36",
              }}
            >
              <option>{S.settings.languageArabic}</option>
              <option>{S.settings.languageEnglish}</option>
            </select>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}