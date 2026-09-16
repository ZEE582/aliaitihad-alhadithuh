import { strings as S } from "../constants/strings";
import { Construction } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

const pageTitles = {
  parents: S.common.parents,
  teachers: S.common.teachers,
  classes: S.common.classes,
  subjects: S.common.subjects,
  sessions: S.common.sessions,
  attendance: S.common.attendance,
  notes: S.common.notes,
  reports: S.common.reports,
  profile: S.common.profile,
  settings: S.common.settings,
};

export default function ComingSoon({ pageKey, onNavigate, onLogout }) {
  const title = pageTitles[pageKey] || S.comingSoon.fallbackPageTitle;

  return (
    <DashboardLayout
      activePage={pageKey}
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={title}
    >
      <div
        className="flex flex-col items-center justify-center rounded-2xl py-20"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE7D9" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "#FCFAF4" }}
        >
          <Construction size={24} style={{ color: "#4C8577" }} />
        </div>
        <h3 className="text-base font-bold mb-1" style={{ color: "#2F3A36" }}>
          {S.comingSoon.underConstruction(title)}
        </h3>
        <p className="text-sm" style={{ color: "#A8B0AB" }}>
          {S.comingSoon.soonReady}
        </p>
      </div>
    </DashboardLayout>
  );
}