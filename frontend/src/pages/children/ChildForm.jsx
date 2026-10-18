import { useMemo, useState } from "react";
import { X, AlertCircle, UserRound, CalendarDays, School, Users } from "lucide-react";
import { strings as S } from "../../constants/strings";
import { useClasses } from "../../context/ClassesContext";
import { useParents } from "../../context/ParentsContext";

// الحد القانوني لعمر القبول بالروضة: من 3 سنين و8 أشهر لغاية 5 سنين بالضبط
const MIN_AGE_MONTHS = 3 * 12 + 8; // 44 شهر
const MAX_AGE_MONTHS = 5 * 12; // 60 شهر

function calculateAgeInMonths(birthDateStr) {
  if (!birthDateStr) return null;
  const birth = new Date(birthDateStr);
  const today = new Date();
  let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  if (today.getDate() < birth.getDate()) months -= 1;
  return months;
}

function formatAge(months) {
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years === 0) return S.childForm.ageFormatMonths(remMonths);
  if (remMonths === 0) return S.childForm.ageFormatYears(years);
  return S.childForm.ageFormatYearsMonths({ years, months: remMonths });
}

export default function ChildForm({ initialData = null, onClose, onSave }) {
  const isEdit = !!initialData;

  const { classesList, sectionsList } = useClasses();
  const { parentsList } = useParents();

  const [form, setForm] = useState({
    F_name: initialData?.F_name || "",
    S_name: initialData?.S_name || "",
    Th_name: initialData?.Th_name || "",
    L_name: initialData?.L_name || "",
    gender: initialData?.gender || "Male",
    birth_date: initialData?.birthDate || "",
    classID: initialData?.classID ?? "",
    section_id: initialData?.section_id ?? "",
    guardianId: "",
  });

  const [ageError, setAgeError] = useState("");

  const classSections = useMemo(
    () =>
      sectionsList.filter(
        (section) => Number(section.classID) === Number(form.classID)
      ),
    [sectionsList, form.classID]
  );

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "classID") {
      setForm((prev) => {
        const validSection = sectionsList.some(
          (section) =>
            Number(section.classID) === Number(value) &&
            Number(section.id) === Number(prev.section_id)
        );
        return {
          ...prev,
          classID: value,
          section_id: validSection ? prev.section_id : "",
        };
      });
      return;
    }

    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "birth_date") {
      validateAge(value);
    }
  };

  const validateAge = (birthDateStr) => {
    const months = calculateAgeInMonths(birthDateStr);
    if (months === null) {
      setAgeError("");
      return true;
    }
    if (months < MIN_AGE_MONTHS) {
      setAgeError(S.childForm.ageErrorTooYoung(formatAge(months)));
      return false;
    }
    if (months > MAX_AGE_MONTHS) {
      setAgeError(S.childForm.ageErrorTooOld(formatAge(months)));
      return false;
    }
    setAgeError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.F_name.trim() || !form.L_name.trim()) return;
    if (!validateAge(form.birth_date)) return;

    onSave &&
      onSave({
        F_name: form.F_name,
        S_name: form.S_name,
        Th_name: form.Th_name,
        L_name: form.L_name,
        gender: form.gender,
        birth_date: form.birth_date,
        classID: form.classID,
        section_id: form.section_id,
        guardianId: isEdit ? undefined : form.guardianId,
      });
  };

  const currentMonths = calculateAgeInMonths(form.birth_date);

  const inputStyle = {
    border: "1px solid #E2DCCC",
    backgroundColor: "#FCFAF4",
    color: "#2F3A36",
  };

  const labelClass = "block text-sm font-medium mb-1.5";

  return (
    <div
      dir="rtl"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: "#00000040" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: "#2F3A36" }}>
            {isEdit ? S.childForm.modalTitleEdit : S.childForm.modalTitleAdd}
          </h3>
          <button onClick={onClose} style={{ color: "#A8B0AB" }}>
            <X size={20} />
          </button>
        </div>

        <p className="text-xs mb-4" style={{ color: "#A8B0AB" }}>
          {S.childForm.requiredFieldsHint}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={{ color: "#2F3A36" }}>
                {S.childForm.fieldFirstNameLabel} *
              </label>
              <div className="relative">
                <UserRound size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: "#A8B0AB" }} />
                <input
                  type="text"
                  value={form.F_name}
                  onChange={handleChange("F_name")}
                  className="w-full rounded-xl py-2.5 pr-10 pl-3 text-sm outline-none"
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass} style={{ color: "#2F3A36" }}>
                {S.childForm.fieldLastNameLabel} *
              </label>
              <input
                type="text"
                value={form.L_name}
                onChange={handleChange("L_name")}
                className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label className={labelClass} style={{ color: "#2F3A36" }}>
                {S.childForm.fieldSecondNameLabel}
              </label>
              <input
                type="text"
                value={form.S_name}
                onChange={handleChange("S_name")}
                className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className={labelClass} style={{ color: "#2F3A36" }}>
                {S.childForm.fieldThirdNameLabel}
              </label>
              <input
                type="text"
                value={form.Th_name}
                onChange={handleChange("Th_name")}
                className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={{ color: "#2F3A36" }}>
                {S.childForm.fieldGenderLabel} *
              </label>
              <select
                value={form.gender}
                onChange={handleChange("gender")}
                className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                style={inputStyle}
              >
                <option value="Male">{S.childForm.genderMale}</option>
                <option value="Female">{S.childForm.genderFemale}</option>
              </select>
            </div>

            <div>
              <label className={labelClass} style={{ color: "#2F3A36" }}>
                {S.childForm.fieldBirthDateLabel} *
              </label>
              <div className="relative">
                <CalendarDays size={16} className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" style={{ color: "#A8B0AB" }} />
                <input
                  type="date"
                  value={form.birth_date}
                  onChange={handleChange("birth_date")}
                  className="w-full rounded-xl py-2.5 pr-10 pl-3 text-sm outline-none"
                  style={{
                    ...inputStyle,
                    border: `1px solid ${ageError ? "#C25B4A" : "#E2DCCC"}`,
                  }}
                  required
                />
              </div>
              {currentMonths !== null && !ageError && (
                <p className="text-xs mt-1.5" style={{ color: "#7A8580" }}>
                  {S.childForm.currentAgeHint(formatAge(currentMonths))}
                </p>
              )}
              {ageError && (
                <p className="text-xs mt-1.5 flex items-start gap-1.5" style={{ color: "#C25B4A" }}>
                  <AlertCircle size={13} className="shrink-0 mt-0.5" />
                  <span>{ageError}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={{ color: "#2F3A36" }}>
                {S.childForm.fieldClassLabel} *
              </label>
              <div className="relative">
                <School size={16} className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" style={{ color: "#A8B0AB" }} />
                <select
                  value={form.classID}
                  onChange={handleChange("classID")}
                  className="w-full rounded-xl py-2.5 pr-10 pl-3 text-sm outline-none"
                  style={inputStyle}
                  required
                >
                  <option value="">{S.childForm.selectClassOption}</option>
                  {classesList.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass} style={{ color: "#2F3A36" }}>
                {S.childForm.fieldSectionLabel}
              </label>
              <select
                value={form.section_id}
                onChange={handleChange("section_id")}
                className="w-full rounded-xl py-2.5 px-3 text-sm outline-none"
                style={inputStyle}
                disabled={!form.classID}
              >
                <option value="">{S.childForm.selectSectionOption}</option>
                {classSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
              {(() => {
                const selected = classSections.find(
                  (section) => Number(section.id) === Number(form.section_id)
                );
                return selected?.teacherName ? (
                  <p className="text-xs mt-1.5" style={{ color: "#7A8580" }}>
                    {S.childForm.sectionTeacherHint(selected.teacherName)}
                  </p>
                ) : null;
              })()}
            </div>
          </div>

          {!isEdit && parentsList.length > 0 && (
            <div>
              <label className={labelClass} style={{ color: "#2F3A36" }}>
                {S.childForm.fieldGuardianLabel}
              </label>
              <div className="relative">
                <Users size={16} className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" style={{ color: "#A8B0AB" }} />
                <select
                  value={form.guardianId}
                  onChange={handleChange("guardianId")}
                  className="w-full rounded-xl py-2.5 pr-10 pl-3 text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="">{S.childForm.selectGuardianOption}</option>
                  {parentsList.map((parent) => (
                    <option key={parent.GID} value={parent.GID}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <p className="text-[11px]" style={{ color: "#A8B0AB" }}>
            {S.childForm.legalAgeHint}
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
              style={{ border: "1px solid #E2DCCC", color: "#4A5551" }}
            >
              {S.childForm.cancelButton}
            </button>
            <button
              type="submit"
              disabled={!!ageError}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "#4C8577" }}
            >
              {isEdit ? S.childForm.saveButton : S.childForm.addButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
