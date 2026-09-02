import { useState } from "react";
import {
  Star,
  Send,
  CheckCircle2,
  UserRound,
  Baby,
  MessageSquareText,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import { useUser } from "../../context/UserContext";
import { useChildren } from "../../context/ChildrenContext";
import { useTeachers } from "../../context/TeachersContext";
import { useTeacherRatings } from "../../context/TeacherRatingsContext";

const criteria = [
  {
    key: "interaction",
    label: "التعامل مع الطفل",
  },
  {
    key: "care",
    label: "الاهتمام والمتابعة",
  },
  {
    key: "communication",
    label: "التواصل مع ولي الأمر",
  },
  {
    key: "activities",
    label: "الأنشطة والتعليم",
  },
];

function Stars({
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex items-center gap-1.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110 disabled:cursor-default"
          aria-label={`تقييم ${star} من 5`}
        >
          <Star
            size={24}
            strokeWidth={1.8}
            fill={
              star <= value
                ? "#E8B24D"
                : "transparent"
            }
            style={{
              color:
                star <= value
                  ? "#E8B24D"
                  : "#C8CEC9",
            }}
          />
        </button>
      ))}
    </div>
  );
}

function RatingCard({
  label,
  value,
  onChange,
}) {
  return (
    <div
      className="rounded-xl p-4 flex items-center justify-between gap-4"
      style={{
        backgroundColor: "#FCFAF4",
        border: "1px solid #EDE7D9",
      }}
    >
      <p
        className="text-sm font-medium"
        style={{ color: "#2F3A36" }}
      >
        {label}
      </p>

      <Stars
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default function TeacherRating({
  onNavigate,
  onLogout,
}) {
  const { user } = useUser();
  const { childrenList } = useChildren();
  const { teachersList } = useTeachers();
  const {
    addRating,
    getParentRating,
  } = useTeacherRatings();

  const [submitted, setSubmitted] =
    useState(false);

  const [ratings, setRatings] = useState({
    interaction: 0,
    care: 0,
    communication: 0,
    activities: 0,
  });

  const [comment, setComment] =
    useState("");

  /*
   * ================================
   * تحديد أطفال ولي الأمر
   * ================================
   */

  const myChildren = childrenList.filter(
    (child) =>
      child.parent === user?.name
  );

  /*
   * إذا كان UserContext يحتوي childIds
   * نستخدمها أيضًا كربط إضافي.
   */

  const childrenById = childrenList.filter(
    (child) =>
      user?.childIds?.includes(child.id)
  );

  const parentChildren =
    childrenById.length > 0
      ? childrenById
      : myChildren;

  /*
   * ================================
   * تحديد المعلمين المرتبطين بالأطفال
   * ================================
   */

  const teacherConnections =
    parentChildren
      .map((child) => {
        const teacher = teachersList.find(
          (teacher) =>
            teacher.classroom ===
            child.classroom
        );

        if (!teacher) return null;

        return {
          child,
          teacher,
        };
      })
      .filter(Boolean);

  /*
   * منع أي شخص غير ولي الأمر
   */

  if (user?.roleType !== "parent") {
    return (
      <DashboardLayout
        activePage="rate-teacher"
        onNavigate={onNavigate}
        onLogout={onLogout}
        pageTitle="تقييم المعلم"
      >
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
            style={{
              backgroundColor: "#FBEDEA",
            }}
          >
            <Star
              size={25}
              style={{ color: "#C25B4A" }}
            />
          </div>

          <h2
            className="text-base font-bold"
            style={{ color: "#2F3A36" }}
          >
            هذه الصفحة متاحة لأولياء الأمور فقط
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  /*
   * لا يوجد أطفال مرتبطون بولي الأمر
   */

  if (teacherConnections.length === 0) {
    return (
      <DashboardLayout
        activePage="rate-teacher"
        onNavigate={onNavigate}
        onLogout={onLogout}
        pageTitle="تقييم المعلم"
      >
        <div className="mb-6">
          <h2
            className="text-lg font-bold"
            style={{ color: "#2F3A36" }}
          >
            تقييم المعلم ⭐
          </h2>

          <p
            className="text-xs mt-1"
            style={{ color: "#A8B0AB" }}
          >
            شاركينا رأيك حول تجربة طفلك مع معلمه.
          </p>
        </div>

        <div
          className="rounded-2xl p-8 text-center"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
            style={{
              backgroundColor: "#FCFAF4",
            }}
          >
            <Baby
              size={25}
              style={{ color: "#A8B0AB" }}
            />
          </div>

          <p
            className="text-sm font-semibold"
            style={{ color: "#4A5551" }}
          >
            لا يوجد معلم مرتبط بطفلك حاليًا
          </p>

          <p
            className="text-xs mt-1.5"
            style={{ color: "#A8B0AB" }}
          >
            سيتم عرض المعلم هنا عند ربط الطفل بصفه.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const handleRatingChange = (
    criterion,
    value
  ) => {
    setRatings((prev) => ({
      ...prev,
      [criterion]: value,
    }));
  };

  const handleSubmit = (connection) => {
    const {
      teacher,
      child,
    } = connection;

    const allRated = Object.values(
      ratings
    ).every((value) => value > 0);

    if (!allRated) {
      window.alert(
        "يرجى تقييم جميع الجوانب قبل إرسال التقييم."
      );
      return;
    }

    addRating({
      parentId: user.id || user.email,
      parentName: user.name,
      childId: child.id,
      childName: child.name,
      teacherId: teacher.id,
      teacherName: teacher.name,
      teacherClassroom: teacher.classroom,
      ratings,
      comment: comment.trim(),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <DashboardLayout
        activePage="rate-teacher"
        onNavigate={onNavigate}
        onLogout={onLogout}
        pageTitle="تقييم المعلم"
      >
        <div
          className="max-w-2xl mx-auto rounded-3xl p-8 text-center"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE7D9",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5"
            style={{
              backgroundColor: "#EAF4F0",
            }}
          >
            <CheckCircle2
              size={30}
              style={{ color: "#4C8577" }}
            />
          </div>

          <h2
            className="text-lg font-bold"
            style={{ color: "#2F3A36" }}
          >
            تم إرسال تقييمك بنجاح 🌷
          </h2>

          <p
            className="text-sm mt-2 leading-6"
            style={{ color: "#7A8580" }}
          >
            شكرًا لمساهمتك في تحسين تجربة أطفالنا.
          </p>

          <button
            onClick={() =>
              onNavigate("children")
            }
            className="mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            style={{
              backgroundColor: "#4C8577",
            }}
          >
            العودة إلى ملف طفلي
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activePage="rate-teacher"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle="تقييم المعلم"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "#FCF3DE",
            }}
          >
            <Star
              size={18}
              style={{ color: "#B8862F" }}
            />
          </div>

          <h2
            className="text-lg font-bold"
            style={{ color: "#2F3A36" }}
          >
            تقييم المعلم
          </h2>
        </div>

        <p
          className="text-xs mt-2"
          style={{ color: "#A8B0AB" }}
        >
          شاركينا رأيك حول تجربة طفلك مع معلمه.
        </p>
      </div>

      <div className="space-y-5">
        {teacherConnections.map(
          (connection) => {
            const {
              teacher,
              child,
            } = connection;

            const existingRating =
              getParentRating(
                user.id || user.email,
                teacher.id,
                child.id
              );

            if (existingRating) {
              return (
                <div
                  key={`${teacher.id}-${child.id}`}
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor:
                      "#FFFFFF",
                    border:
                      "1px solid #EDE7D9",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor:
                          "#EAF2EF",
                      }}
                    >
                      <UserRound
                        size={20}
                        style={{
                          color: "#4C8577",
                        }}
                      />
                    </div>

                    <div>
                      <p
                        className="text-sm font-bold"
                        style={{
                          color: "#2F3A36",
                        }}
                      >
                        {teacher.name}
                      </p>

                      <p
                        className="text-xs mt-0.5"
                        style={{
                          color: "#A8B0AB",
                        }}
                      >
                        {teacher.classroom} ·{" "}
                        {child.name}
                      </p>
                    </div>
                  </div>

                  <div
                    className="mt-4 rounded-xl p-4 flex items-center gap-3"
                    style={{
                      backgroundColor:
                        "#EAF4F0",
                    }}
                  >
                    <CheckCircle2
                      size={18}
                      style={{
                        color: "#4C8577",
                      }}
                    />

                    <p
                      className="text-sm font-medium"
                      style={{
                        color: "#4C8577",
                      }}
                    >
                      تم إرسال تقييمك لهذا المعلم مسبقًا.
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`${teacher.id}-${child.id}`}
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: "#FFFFFF",
                  border:
                    "1px solid #EDE7D9",
                }}
              >
                {/* معلومات المعلم */}

                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor:
                          "#EAF2EF",
                      }}
                    >
                      <UserRound
                        size={21}
                        style={{
                          color: "#4C8577",
                        }}
                      />
                    </div>

                    <div>
                      <p
                        className="text-sm font-bold"
                        style={{
                          color: "#2F3A36",
                        }}
                      >
                        {teacher.name}
                      </p>

                      <p
                        className="text-xs mt-1"
                        style={{
                          color: "#A8B0AB",
                        }}
                      >
                        {teacher.classroom}
                      </p>

                      <p
                        className="text-xs mt-0.5"
                        style={{
                          color: "#A8B0AB",
                        }}
                      >
                        تقييم خاص بـ {child.name}
                      </p>
                    </div>
                  </div>

                  <div
                    className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center"
                    style={{
                      backgroundColor:
                        "#FCF3DE",
                    }}
                  >
                    <Star
                      size={18}
                      style={{
                        color: "#B8862F",
                      }}
                    />
                  </div>
                </div>

                {/* معايير التقييم */}

                <div className="space-y-2.5">
                  {criteria.map(
                    (criterion) => (
                      <RatingCard
                        key={criterion.key}
                        label={criterion.label}
                        value={
                          ratings[
                            criterion.key
                          ]
                        }
                        onChange={(value) =>
                          handleRatingChange(
                            criterion.key,
                            value
                          )
                        }
                      />
                    )
                  )}
                </div>

                {/* الملاحظة */}

                <div className="mt-5">
                  <label
                    className="flex items-center gap-2 text-sm font-semibold mb-2"
                    style={{
                      color: "#2F3A36",
                    }}
                  >
                    <MessageSquareText
                      size={16}
                      style={{
                        color: "#4C8577",
                      }}
                    />

                    ملاحظتك
                    <span
                      className="text-xs font-normal"
                      style={{
                        color: "#A8B0AB",
                      }}
                    >
                      (اختياري)
                    </span>
                  </label>

                  <textarea
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    rows={4}
                    placeholder="اكتبي أي ملاحظات أو اقتراحات..."
                    className="w-full rounded-xl py-2.5 px-3 text-sm outline-none resize-none"
                    style={{
                      border:
                        "1px solid #E2DCCC",
                      backgroundColor:
                        "#FCFAF4",
                      color: "#2F3A36",
                    }}
                  />
                </div>

                {/* إرسال */}

                <button
                  onClick={() =>
                    handleSubmit(connection)
                  }
                  className="w-full mt-5 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{
                    backgroundColor:
                      "#4C8577",
                  }}
                >
                  <Send size={16} />
                  إرسال التقييم
                </button>
              </div>
            );
          }
        )}
      </div>
    </DashboardLayout>
  );
}