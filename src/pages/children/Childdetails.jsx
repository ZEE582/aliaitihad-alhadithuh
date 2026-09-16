import { useMemo, useState } from "react";
import {
  ArrowRight,
  Phone,
  Users,
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Heart,
  ClipboardCheck,
  MessageCircle,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import NoteForm from "../notes/NoteForm";
import { useChildren } from "../../context/ChildrenContext";
import { useUser } from "../../context/UserContext";
import { strings as S } from "../../constants/strings";

const defaultAttendance = [
  { date: "2026-07-14", status: "حاضر" },
  { date: "2026-07-13", status: "حاضر" },
  { date: "2026-07-12", status: "غائب" },
  { date: "2026-07-11", status: "حاضر" },
];

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: "#F4F8F7" }}
      >
        <Icon size={17} style={{ color: "#4C8577" }} />
      </div>

      <div className="min-w-0">
        <p
          className="text-[11px] mb-0.5"
          style={{ color: "#A8B0AB" }}
        >
          {label}
        </p>

        <p
          className="text-sm font-semibold truncate"
          style={{ color: "#2F3A36" }}
        >
          {value || S.common.notSpecified}
        </p>
      </div>
    </div>
  );
}

function BehaviorBadge({ type }) {
  const styles = {
    إيجابي: {
      backgroundColor: "#4C857718",
      color: "#4C8577",
      icon: Heart,
    },

    تنبيه: {
      backgroundColor: "#C25B4A18",
      color: "#C25B4A",
      icon: MessageCircle,
    },
  };

  const style = styles[type] || {
    backgroundColor: "#E8B24D20",
    color: "#B8862F",
    icon: MessageCircle,
  };

  const Icon = style.icon;

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
      }}
    >
      <Icon size={12} />
      {type}
    </span>
  );
}

function AttendanceSummary({ attendance }) {
  const presentCount = attendance.filter(
    (item) => item.status === "حاضر"
  ).length;

  const absentCount =
    attendance.length - presentCount;

  const percentage =
    attendance.length > 0
      ? Math.round(
          (presentCount / attendance.length) * 100
        )
      : 0;

  return (
    <div
      className="rounded-2xl p-4 mb-4"
      style={{
        backgroundColor: "#F8FBFA",
        border: "1px solid #E6EFEC",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#EAF2EF" }}
          >
            <ClipboardCheck
              size={17}
              style={{ color: "#4C8577" }}
            />
          </div>

          <div>
            <p
              className="text-xs font-semibold"
              style={{ color: "#2F3A36" }}
            >
              {S.childDetails.attendanceSummaryTitle}
            </p>

            <p
              className="text-[11px]"
              style={{ color: "#A8B0AB" }}
            >
              {S.childDetails.attendanceLastDays(attendance.length)}
            </p>
          </div>
        </div>

        <span
          className="text-sm font-bold"
          style={{ color: "#4C8577" }}
        >
{S.childDetails.attendancePercentage(percentage)}
        </span>
      </div>

      <div
        className="h-2 rounded-full overflow-hidden mb-3"
        style={{ backgroundColor: "#E8EFEC" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: "#4C8577",
          }}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <CheckCircle2
            size={14}
            style={{ color: "#4C8577" }}
          />

          <span
            className="text-xs"
            style={{ color: "#4A5551" }}
          >
            {S.childDetails.attendancePresentCount(presentCount)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <XCircle
            size={14}
            style={{ color: "#C25B4A" }}
          />

          <span
            className="text-xs"
            style={{ color: "#4A5551" }}
          >
            {S.childDetails.attendanceAbsentCount(absentCount)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChildDetails({
  child,
  onNavigate,
  onBack,
  onLogout,
}) {
  const { childrenList, addChildNote } =
    useChildren();

  const { user } = useUser();

  const [tab, setTab] = useState("behavior");
  const [noteFormOpen, setNoteFormOpen] =
    useState(false);

  const attendance = useMemo(
    () => defaultAttendance,
    []
  );

  // نجيب النسخة الحالية من الطفل من الـ Context
  // حتى أي ملاحظة تنضاف من صفحة الحصص تظهر هنا
  const currentChild =
    childrenList.find(
      (item) => item.id === child?.id
    ) || child;

  if (!currentChild) {
    return (
      <DashboardLayout
        activePage="children"
        onNavigate={onNavigate}
        onLogout={onLogout}
        pageTitle={S.childDetails.pageTitle}
      >
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
          }}
        >
          <div
            className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#F4F8F7" }}
          >
            <Users
              size={24}
              style={{ color: "#4C8577" }}
            />
          </div>

          <p
            className="text-sm"
            style={{ color: "#7A8580" }}
          >
            {S.childDetails.noChildSelected}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const notes = currentChild.notes || [];

  const handleAddNote = (formData) => {
    const today =
      new Date().toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    addChildNote(currentChild.id, {
      author: user?.name || S.childDetails.noteAuthorFallback,
      date: today,
      type: formData.type,
      text: formData.text,
      source: "child-profile",
    });

    setNoteFormOpen(false);
  };

  return (
    <DashboardLayout
      activePage="children"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle={S.childDetails.pageTitle}
    >
      {/* Back */}

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold mb-5 hover:opacity-70"
        style={{ color: "#4C8577" }}
      >
        <ArrowRight size={17} />
        {S.childDetails.backButton}
      </button>

      {/* Child Hero */}

      <div
        className="rounded-3xl p-5 mb-5 overflow-hidden relative"
        style={{
          background:
            "linear-gradient(135deg, #F4F8F7 0%, #FCFAF4 100%)",
          border: "1px solid #E5EDE9",
        }}
      >
        <div
          className="absolute -left-10 -top-10 w-32 h-32 rounded-full opacity-50"
          style={{ backgroundColor: "#EAF2EF" }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-bold shrink-0"
              style={{
                backgroundColor: "#4C8577",
                color: "#FBF7EF",
                boxShadow:
                  "0 8px 20px rgba(76,133,119,0.18)",
              }}
            >
              {currentChild.name?.charAt(0) || S.childDetails.avatarFallback}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  className="text-xl font-bold"
                  style={{ color: "#2F3A36" }}
                >
                  {currentChild.name}
                </h2>

                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      currentChild.status === "نشط"
                        ? "#4C857718"
                        : "#C25B4A18",
                    color:
                      currentChild.status === "نشط"
                        ? "#4C8577"
                        : "#C25B4A",
                  }}
                >
                  {currentChild.status || S.childDetails.heroStatusFallback}
                </span>
              </div>

              <p
                className="text-sm mt-1"
                style={{ color: "#7A8580" }}
              >
                {currentChild.classroom || S.childDetails.heroClassroomFallback}
              </p>

              <p
                className="text-xs mt-2"
                style={{ color: "#A8B0AB" }}
              >
                {S.childDetails.heroSubtitle}
              </p>
            </div>
          </div>

          <div
            className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Heart
              size={21}
              style={{ color: "#4C8577" }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sidebar */}

        <div className="lg:col-span-1 space-y-4">
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EDE7D9",
            }}
          >
            <div className="mb-4">
              <h3
                className="text-sm font-bold"
                style={{ color: "#2F3A36" }}
              >
                {S.childDetails.infoCardTitle}
              </h3>

              <p
                className="text-[11px] mt-1"
                style={{ color: "#A8B0AB" }}
              >
                {S.childDetails.infoCardSubtitle}
              </p>
            </div>

            <div className="space-y-4">
              <InfoRow
                icon={CalendarDays}
                label={S.childDetails.infoAgeLabel}
                value={
                  currentChild.age
                    ? S.childDetails.infoAgeValue(currentChild.age)
                    : null
                }
              />

              <InfoRow
                icon={Users}
                label={S.childDetails.infoParentLabel}
                value={currentChild.parent}
              />

              <InfoRow
                icon={Phone}
                label={S.childDetails.infoPhoneLabel}
                value={currentChild.parentPhone}
              />

              <InfoRow
                icon={ClipboardCheck}
                label={S.childDetails.infoStatusLabel}
                value={currentChild.status}
              />
            </div>

            {currentChild.healthNotes && (
              <div
                className="mt-5 rounded-2xl p-4"
                style={{
                  backgroundColor: "#FFF8F6",
                  border: "1px solid #F3E2DE",
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Heart
                    size={14}
                    style={{ color: "#C25B4A" }}
                  />

                  <p
                    className="text-xs font-semibold"
                    style={{ color: "#C25B4A" }}
                  >
                    {S.childDetails.healthNotesTitle}
                  </p>
                </div>

                <p
                  className="text-sm leading-6"
                  style={{ color: "#4A5551" }}
                >
                  {currentChild.healthNotes}
                </p>
              </div>
            )}
          </div>

          <AttendanceSummary
            attendance={attendance}
          />
        </div>

        {/* Main */}

        <div className="lg:col-span-2">
          {/* Tabs */}

          <div
            className="flex gap-2 p-1.5 rounded-2xl mb-4"
            style={{
              backgroundColor: "#F4F8F7",
              border: "1px solid #E6EFEC",
            }}
          >
            <button
              onClick={() => setTab("behavior")}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all"
              style={{
                backgroundColor:
                  tab === "behavior"
                    ? "#FFFFFF"
                    : "transparent",
                color:
                  tab === "behavior"
                    ? "#2F3A36"
                    : "#7A8580",
                boxShadow:
                  tab === "behavior"
                    ? "0 2px 8px rgba(47,58,54,0.06)"
                    : "none",
              }}
            >
              <MessageCircle size={15} />
              {S.childDetails.tabBehaviors}
            </button>

            <button
              onClick={() => setTab("attendance")}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all"
              style={{
                backgroundColor:
                  tab === "attendance"
                    ? "#FFFFFF"
                    : "transparent",
                color:
                  tab === "attendance"
                    ? "#2F3A36"
                    : "#7A8580",
                boxShadow:
                  tab === "attendance"
                    ? "0 2px 8px rgba(47,58,54,0.06)"
                    : "none",
              }}
            >
              <ClipboardCheck size={15} />
              {S.childDetails.tabAttendance}
            </button>
          </div>

          {/* Behavior */}

          {tab === "behavior" && (
            <div
              className="rounded-2xl p-5"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EDE7D9",
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h4
                    className="text-sm font-bold"
                    style={{ color: "#2F3A36" }}
                  >
                    {S.childDetails.behaviorsTitle}
                  </h4>

                  <p
                    className="text-[11px] mt-1"
                    style={{ color: "#A8B0AB" }}
                  >
                    {S.childDetails.behaviorsSubtitle}
                  </p>
                </div>

                <button
                  onClick={() => setNoteFormOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold hover:opacity-80"
                  style={{
                    backgroundColor: "#EAF2EF",
                    color: "#4C8577",
                  }}
                >
                  <Plus size={15} />
                  {S.childDetails.addNoteButton}
                </button>
              </div>

              {notes.length === 0 ? (
                <div
                  className="rounded-2xl py-10 text-center"
                  style={{
                    backgroundColor: "#FCFAF4",
                    border: "1px dashed #E2DCCC",
                  }}
                >
                  <div
                    className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: "#F4F8F7",
                    }}
                  >
                    <MessageCircle
                      size={21}
                      style={{ color: "#A8B0AB" }}
                    />
                  </div>

                  <p
                    className="text-sm font-medium"
                    style={{ color: "#7A8580" }}
                  >
                    {S.childDetails.noNotes}
                  </p>

                  <p
                    className="text-xs mt-1"
                    style={{ color: "#A8B0AB" }}
                  >
                    {S.childDetails.noNotesHint}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note, index) => (
                    <div
                      key={note.id}
                      className="relative flex gap-3"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: "#F4F8F7",
                          }}
                        >
                          <MessageCircle
                            size={15}
                            style={{
                              color: "#4C8577",
                            }}
                          />
                        </div>

                        {index !==
                          notes.length - 1 && (
                          <div
                            className="w-px flex-1 mt-1"
                            style={{
                              backgroundColor:
                                "#EDE7D9",
                            }}
                          />
                        )}
                      </div>

                      <div
                        className="flex-1 rounded-2xl p-4 mb-1"
                        style={{
                          backgroundColor: "#FCFAF4",
                          border:
                            "1px solid #F3EFE3",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p
                            className="text-sm font-medium leading-6"
                            style={{
                              color: "#2F3A36",
                            }}
                          >
                            {note.text}
                          </p>

                          <BehaviorBadge
                            type={note.type}
                          />
                        </div>

                        <p
                          className="text-[11px]"
                          style={{
                            color: "#A8B0AB",
                          }}
                        >
                          {note.author} · {note.date}
                        </p>

                        {note.source === "session" &&
                          note.sessionSubject && (
                            <p
                              className="text-[10px] mt-1"
                              style={{
                                color: "#A8B0AB",
                              }}
                            >
                              {S.childDetails.noteFromSession(note.sessionSubject)}
                            </p>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attendance */}

          {tab === "attendance" && (
            <div
              className="rounded-2xl p-5"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EDE7D9",
              }}
            >
              <div className="mb-5">
                <h4
                  className="text-sm font-bold"
                  style={{ color: "#2F3A36" }}
                >
                  {S.childDetails.attendanceTitle}
                </h4>

                <p
                  className="text-[11px] mt-1"
                  style={{ color: "#A8B0AB" }}
                >
                  {S.childDetails.attendanceSubtitle}
                </p>
              </div>

              <div className="space-y-2">
                {attendance.map((item) => {
                  const isPresent =
                    item.status === "حاضر";

                  return (
                    <div
                      key={item.date}
                      className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{
                        backgroundColor: isPresent
                          ? "#F7FBF9"
                          : "#FFF9F7",
                        border: `1px solid ${
                          isPresent
                            ? "#E5F0EC"
                            : "#F3E4E0"
                        }`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor:
                              isPresent
                                ? "#EAF2EF"
                                : "#FBECEA",
                          }}
                        >
                          {isPresent ? (
                            <CheckCircle2
                              size={17}
                              style={{
                                color: "#4C8577",
                              }}
                            />
                          ) : (
                            <XCircle
                              size={17}
                              style={{
                                color: "#C25B4A",
                              }}
                            />
                          )}
                        </div>

                        <span
                          className="text-sm font-medium"
                          style={{
                            color: "#4A5551",
                          }}
                        >
                          {item.date}
                        </span>
                      </div>

                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: isPresent
                            ? "#4C857718"
                            : "#C25B4A18",
                          color: isPresent
                            ? "#4C8577"
                            : "#C25B4A",
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {noteFormOpen && (
        <NoteForm
          initialData={{
            childName: currentChild.name,
            type: S.childDetails.noteDefaultType,
            text: "",
          }}
          onClose={() =>
            setNoteFormOpen(false)
          }
          onSave={handleAddNote}
        />
      )}
    </DashboardLayout>
  );
}