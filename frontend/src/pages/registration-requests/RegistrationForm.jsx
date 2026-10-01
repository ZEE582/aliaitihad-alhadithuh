import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRegistrationRequests } from "../../context/RegistrationRequestsContext";

import { strings as S } from "../../constants/strings";

const STEPS = [
  S.registrationForm.stepChildData,
  S.registrationForm.stepHealthAndFamily,
  S.registrationForm.stepBehaviorAndCommunication,
];

const HEALTH_CONDITIONS = [
  "سكري أطفال",
  "صرع",
  "حساسية",
  "أزمة",
  "القلب",
  "فطريات",
  "جدري",
  "تقمل",
];

const SPECIAL_NEEDS = ["حركية", "سمعية", "بصرية", "نطقية"];

const PARENTS_STATUS = [
  "متزوجين",
  "مطلقين",
  "منفصلين",
  "أحدهما متوفى",
];

function Section({ title, children }) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-5 mb-3 sm:mb-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EDE7D9",
      }}
    >
      <h3
        className="text-xs sm:text-sm font-bold mb-3 sm:mb-4"
        style={{ color: "#2F3A36" }}
      >
        {title}
      </h3>

      <div className="space-y-3 sm:space-y-4">{children}</div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  id,
  name,
  autoComplete,
}) {
  // Auto-generate id and name if not provided
  const fieldId = id || name || label?.replace(/\s+/g, '-').toLowerCase();
  const fieldName = name || fieldId;
  const autoComp = autoComplete || (type === 'email' ? 'email' : type === 'tel' ? 'tel' : type === 'date' ? 'bday' : 'off');

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium mb-1.5"
        style={{ color: "#2F3A36" }}
      >
        {label}
        {required && (
          <span style={{ color: "#C25B4A" }}> *</span>
        )}
      </label>

      <input
        id={fieldId}
        name={fieldName}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComp}
        className="w-full rounded-xl py-2.5 px-3 text-sm outline-none transition"
        style={{
          border: "1px solid #E2DCCC",
          backgroundColor: "#FCFAF4",
          color: "#2F3A36",
        }}
      />
    </div>
  );
}

function RadioGroup({
  label,
  options,
  value,
  onChange,
}) {
  return (
    <div>
      {label && (
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#2F3A36" }}
        >
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
              style={{
                backgroundColor: selected
                  ? "#4C8577"
                  : "#FCFAF4",
                color: selected
                  ? "#FBF7EF"
                  : "#4A5551",
                border: `1px solid ${
                  selected ? "#4C8577" : "#E2DCCC"
                }`,
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function YesNo({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 sm:gap-4 py-1">
      <span
        className="text-sm min-w-0 break-words"
        style={{ color: "#2F3A36" }}
      >
        {label}
      </span>

      <div className="flex gap-2 shrink-0">
        {["نعم", "لا"].map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className="px-3 py-1 rounded-lg text-xs font-medium transition"
              style={{
                backgroundColor: selected
                  ? "#4C8577"
                  : "#FCFAF4",
                color: selected
                  ? "#FBF7EF"
                  : "#4A5551",
                border: `1px solid ${
                  selected ? "#4C8577" : "#E2DCCC"
                }`,
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CheckboxGroup({
  label,
  options,
  values,
  onToggle,
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-1.5"
        style={{ color: "#2F3A36" }}
      >
        {label}
      </label>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = values.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
              style={{
                backgroundColor: checked
                  ? "#C25B4A20"
                  : "#FCFAF4",
                color: checked
                  ? "#C25B4A"
                  : "#4A5551",
                border: `1px solid ${
                  checked ? "#C25B4A" : "#E2DCCC"
                }`,
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const initialForm = {
  // بيانات الطفل
  childName: "",
  gender: "",
  birthDate: "",
  birthPlace: "",
  enrollDate: "",
  address: "",
  homePhone: "",
  siblingsCount: "",
  childOrder: "",

  // الأب
  fatherName: "",
  fatherJob: "",
  fatherWorkplace: "",
  fatherPhone: "",

  // الأم
  motherName: "",
  motherJob: "",
  motherWorkplace: "",
  motherPhone: "",

  // الوضع العائلي
  parentsStatus: "",
  travelingParent: "",
  deceasedParent: "",
  parentsRelation: "",

  // الحالة الصحية
  healthConditions: [],
  otherCondition: "",
  hadSurgery: "",
  surgeryDetails: "",
  takesMedicine: "",
  medicineDetails: "",
  vaccinated: "",

  // الاحتياجات الخاصة
  specialNeeds: [],
  specialNeedsSupervisor: "",
  familyHasSpecialNeeds: "",
  familySpecialNeedsCount: "",
  familySpecialNeedsType: "",

  // السلوكيات
  bedwetting: "",
  eatsBreakfast: "",
  sleepsNormally: "",
  nervous: "",
  introvertShy: "",
  aggressive: "",
  stuttering: "",

  // الطوارئ
  emergencyContact: "",
};

export default function RegistrationForm({
  onBack,
  onSubmitted,
}) {
  const { submitRequest } = useRegistrationRequests();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleCheckbox = (field) => (option) => {
    setForm((prev) => {
      const current = prev[field] || [];

      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];

      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  const handleNext = () => {
    setStep((current) =>
      Math.min(current + 1, STEPS.length - 1)
    );
  };

  const handlePrev = () => {
    setStep((current) =>
      Math.max(current - 1, 0)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newRequest = submitRequest(form);

    setSubmitted(true);

    if (onSubmitted) {
      onSubmitted(newRequest);
    }
  };

  if (submitted) {
    return (
      <div
        dir="rtl"
        className="min-h-screen w-full flex items-center justify-center px-4"
        style={{ backgroundColor: "#FBF7EF" }}
      >
        <div className="max-w-md w-full text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              backgroundColor: "#4C857720",
            }}
          >
            <CheckCircle2
              size={32}
              style={{ color: "#4C8577" }}
            />
          </div>

          <h2
            className="text-lg font-bold mb-2"
            style={{ color: "#2F3A36" }}
          >
            {S.registrationForm.submittedSuccessTitle}
          </h2>

          <p
            className="text-sm leading-6 mb-6"
            style={{ color: "#7A8580" }}
          >
            {S.registrationForm.submittedSuccessMessage}
          </p>

          <div
            className="rounded-xl px-4 py-3 mb-6 text-xs leading-5"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EDE7D9",
              color: "#7A8580",
            }}
          >
            {S.registrationForm.keepContactInfoMessage}
          </div>

          <button
            onClick={onBack}
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition"
            style={{ backgroundColor: "#4C8577" }}
          >
            {S.registrationForm.backToLoginButton}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full px-4 py-6 sm:py-8"
      style={{ backgroundColor: "#FBF7EF" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* العودة */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium mb-4 sm:mb-5 transition"
          style={{ color: "#4C8577" }}
        >
          <ArrowRight size={16} />
          {S.registrationForm.backToLoginButton}
        </button>

        {/* العنوان */}
        <div className="mb-5 sm:mb-6">
          <h1
            className="text-lg sm:text-xl font-bold mb-1"
            style={{ color: "#2F3A36" }}
          >
            {S.registrationForm.formTitle}
          </h1>

          <p
            className="text-xs sm:text-sm leading-6"
            style={{ color: "#7A8580" }}
          >
            {S.registrationForm.formIntro}
          </p>
        </div>

        {/* شريط الخطوات */}
        <div className="flex items-start gap-1 sm:gap-2 mb-6 sm:mb-7">
          {STEPS.map((label, index) => {
            const active = index <= step;

            return (
              <div
                key={label}
                className="flex-1"
              >
                <div
                  className="h-1.5 rounded-full mb-1 sm:mb-1.5"
                  style={{
                    backgroundColor: active
                      ? "#4C8577"
                      : "#EDE7D9",
                  }}
                />

                <p
                  className="text-[10px] sm:text-[11px] font-medium text-center hidden sm:block"
                  style={{
                    color: active
                      ? "#4C8577"
                      : "#A8B0AB",
                  }}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit}>
          {/* =========================================
              STEP 1
          ========================================= */}
          {step === 0 && (
            <>
              <Section title={S.registrationForm.sectionBasicChildData}>
                <TextField
                  label={S.registrationForm.childFullNameLabel}
                  value={form.childName}
                  onChange={update("childName")}
                  required
                  placeholder={S.registrationForm.childFullNamePlaceholder}
                />

                <RadioGroup
                  label={S.registrationForm.genderLabel}
                  options={["ذكر", "أنثى"]}
                  value={form.gender}
                  onChange={update("gender")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label={S.registrationForm.birthDateLabel}
                    type="date"
                    value={form.birthDate}
                    onChange={update("birthDate")}
                    required
                  />

                  <TextField
                    label={S.registrationForm.birthPlaceLabel}
                    value={form.birthPlace}
                    onChange={update("birthPlace")}
                    placeholder={S.registrationForm.birthPlacePlaceholder}
                  />
                </div>

                <TextField
                  label={S.registrationForm.expectedEnrollDateLabel}
                  type="date"
                  value={form.enrollDate}
                  onChange={update("enrollDate")}
                />
              </Section>

              <Section title={S.registrationForm.sectionAddressAndContact}>
                <TextField
                  label={S.registrationForm.currentAddressLabel}
                  value={form.address}
                  onChange={update("address")}
                  placeholder={S.registrationForm.currentAddressPlaceholder}
                />

                <TextField
                  label={S.registrationForm.homePhoneLabel}
                  value={form.homePhone}
                  onChange={update("homePhone")}
                  type="tel"
                  placeholder="059-XXXXXXX"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label={S.registrationForm.siblingsCountLabel}
                    type="number"
                    value={form.siblingsCount}
                    onChange={update("siblingsCount")}
                  />

                  <TextField
                    label={S.registrationForm.childOrderLabel}
                    type="number"
                    value={form.childOrder}
                    onChange={update("childOrder")}
                  />
                </div>
              </Section>

              <Section title={S.registrationForm.sectionFatherData}>
                <TextField
                  label={S.registrationForm.fatherNameLabel}
                  value={form.fatherName}
                  onChange={update("fatherName")}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label={S.registrationForm.fatherJobLabel}
                    value={form.fatherJob}
                    onChange={update("fatherJob")}
                  />

                  <TextField
                    label={S.registrationForm.workplaceLabel}
                    value={form.fatherWorkplace}
                    onChange={update("fatherWorkplace")}
                  />
                </div>

                <TextField
                  label={S.registrationForm.fatherPhoneLabel}
                  value={form.fatherPhone}
                  onChange={update("fatherPhone")}
                  type="tel"
                  required
                  placeholder="059-XXXXXXX"
                />
              </Section>

              <Section title={S.registrationForm.sectionMotherData}>
                <TextField
                  label={S.registrationForm.motherNameLabel}
                  value={form.motherName}
                  onChange={update("motherName")}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label={S.registrationForm.motherJobLabel}
                    value={form.motherJob}
                    onChange={update("motherJob")}
                  />

                  <TextField
                    label={S.registrationForm.workplaceLabel}
                    value={form.motherWorkplace}
                    onChange={update("motherWorkplace")}
                  />
                </div>

                <TextField
                  label={S.registrationForm.motherPhoneLabel}
                  value={form.motherPhone}
                  onChange={update("motherPhone")}
                  type="tel"
                  required
                  placeholder="059-XXXXXXX"
                />
              </Section>

              <Section title={S.registrationForm.sectionParentsStatus}>
                <RadioGroup
                  label=""
                  options={PARENTS_STATUS}
                  value={form.parentsStatus}
                  onChange={update("parentsStatus")}
                />
              </Section>
            </>
          )}

          {/* =========================================
              STEP 2
          ========================================= */}
          {step === 1 && (
            <>
              <Section title={S.registrationForm.sectionFamilyStatus}>
                <RadioGroup
                  label={S.registrationForm.travelingParentQuestion}
                  options={["الأب", "الأم", "لا يوجد"]}
                  value={form.travelingParent}
                  onChange={update("travelingParent")}
                />

                <RadioGroup
                  label={S.registrationForm.deceasedParentQuestion}
                  options={["الأب", "الأم", "لا يوجد"]}
                  value={form.deceasedParent}
                  onChange={update("deceasedParent")}
                />

                <TextField
                  label={S.registrationForm.parentsRelationLabel}
                  value={form.parentsRelation}
                  onChange={update("parentsRelation")}
                  placeholder={S.registrationForm.parentsRelationPlaceholder}
                />
              </Section>

              <Section title={S.registrationForm.sectionHealthStatus}>
                <CheckboxGroup
                  label={S.registrationForm.healthConditionsQuestion}
                  options={HEALTH_CONDITIONS}
                  values={form.healthConditions}
                  onToggle={toggleCheckbox("healthConditions")}
                />

                <TextField
                  label={S.registrationForm.otherConditionLabel}
                  value={form.otherCondition}
                  onChange={update("otherCondition")}
                  placeholder={S.registrationForm.otherConditionPlaceholder}
                />

                <YesNo
                  label={S.registrationForm.surgeryQuestion}
                  value={form.hadSurgery}
                  onChange={update("hadSurgery")}
                />

                {form.hadSurgery === "نعم" && (
                  <TextField
                    label={S.registrationForm.surgeryDetailsLabel}
                    value={form.surgeryDetails}
                    onChange={update("surgeryDetails")}
                    placeholder={S.registrationForm.surgeryDetailsPlaceholder}
                  />
                )}

                <YesNo
                  label={S.registrationForm.medicineQuestion}
                  value={form.takesMedicine}
                  onChange={update("takesMedicine")}
                />

                {form.takesMedicine === "نعم" && (
                  <TextField
                    label={S.registrationForm.medicineDetailsLabel}
                    value={form.medicineDetails}
                    onChange={update("medicineDetails")}
                    placeholder={S.registrationForm.medicineDetailsPlaceholder}
                  />
                )}

                <YesNo
                  label={S.registrationForm.vaccinationQuestion}
                  value={form.vaccinated}
                  onChange={update("vaccinated")}
                />
              </Section>

              <Section title={S.registrationForm.sectionSpecialNeeds}>
                <CheckboxGroup
                  label={S.registrationForm.specialNeedsQuestion}
                  options={SPECIAL_NEEDS}
                  values={form.specialNeeds}
                  onToggle={toggleCheckbox("specialNeeds")}
                />

                {form.specialNeeds.length > 0 && (
                  <TextField
                    label={S.registrationForm.specialNeedsSupervisorLabel}
                    value={form.specialNeedsSupervisor}
                    onChange={update(
                      "specialNeedsSupervisor"
                    )}
                    placeholder={S.registrationForm.specialNeedsSupervisorPlaceholder}
                  />
                )}

                <YesNo
                  label={S.registrationForm.familySpecialNeedsQuestion}
                  value={form.familyHasSpecialNeeds}
                  onChange={update(
                    "familyHasSpecialNeeds"
                  )}
                />

                {form.familyHasSpecialNeeds === "نعم" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextField
                      label={S.registrationForm.countLabel}
                      type="number"
                      value={
                        form.familySpecialNeedsCount
                      }
                      onChange={update(
                        "familySpecialNeedsCount"
                      )}
                    />

                    <TextField
                      label={S.registrationForm.conditionTypeLabel}
                      value={
                        form.familySpecialNeedsType
                      }
                      onChange={update(
                        "familySpecialNeedsType"
                      )}
                    />
                  </div>
                )}
              </Section>
            </>
          )}

          {/* =========================================
              STEP 3
          ========================================= */}
          {step === 2 && (
            <>
              <Section title={S.registrationForm.sectionBehaviorAndHabits}>
                <YesNo
                  label={S.registrationForm.bedwettingQuestion}
                  value={form.bedwetting}
                  onChange={update("bedwetting")}
                />

                <YesNo
                  label={S.registrationForm.breakfastQuestion}
                  value={form.eatsBreakfast}
                  onChange={update("eatsBreakfast")}
                />

                <YesNo
                  label={S.registrationForm.sleepQuestion}
                  value={form.sleepsNormally}
                  onChange={update("sleepsNormally")}
                />

                <YesNo
                  label={S.registrationForm.nervousQuestion}
                  value={form.nervous}
                  onChange={update("nervous")}
                />

                <YesNo
                  label={S.registrationForm.introvertShyQuestion}
                  value={form.introvertShy}
                  onChange={update("introvertShy")}
                />

                <YesNo
                  label={S.registrationForm.aggressiveQuestion}
                  value={form.aggressive}
                  onChange={update("aggressive")}
                />

                <YesNo
                  label={S.registrationForm.stutteringQuestion}
                  value={form.stuttering}
                  onChange={update("stuttering")}
                />
              </Section>

              <Section title={S.registrationForm.sectionEmergencyContact}>
                <TextField
                  label={S.registrationForm.emergencyContactLabel}
                  value={form.emergencyContact}
                  onChange={update(
                    "emergencyContact"
                  )}
                  required
                  placeholder={S.registrationForm.emergencyContactPlaceholder}
                />
              </Section>

              <div
                className="rounded-xl px-4 py-3 mb-4 text-xs leading-5"
                style={{
                  backgroundColor: "#FCFAF4",
                  border: "1px solid #F3EFE3",
                  color: "#7A8580",
                }}
              >
                {S.registrationForm.privacyNotice}
              </div>
            </>
          )}

          {/* أزرار التنقل */}
          <div className="flex gap-3 mt-2">
            {step > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition"
                style={{
                  border: "1px solid #E2DCCC",
                  backgroundColor: "#FFFFFF",
                  color: "#4A5551",
                }}
              >
                {S.registrationForm.prevStepButton}
                <ArrowRight size={16} />
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white transition"
                style={{
                  backgroundColor: "#4C8577",
                }}
              >
                {S.registrationForm.nextStepButton}
                <ArrowLeft size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 rounded-xl py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white transition"
                style={{
                  backgroundColor: "#4C8577",
                }}
              >
                {S.registrationForm.submitButton}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}