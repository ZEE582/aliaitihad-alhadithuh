import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRegistrationRequests } from "../../context/RegistrationRequestsContext";

const STEPS = [
  "بيانات الطفل",
  "الحالة الصحية والعائلية",
  "السلوكيات والتواصل",
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
      className="rounded-2xl p-5 mb-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EDE7D9",
      }}
    >
      <h3
        className="text-sm font-bold mb-4"
        style={{ color: "#2F3A36" }}
      >
        {title}
      </h3>

      <div className="space-y-4">{children}</div>
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
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-1.5"
        style={{ color: "#2F3A36" }}
      >
        {label}
        {required && (
          <span style={{ color: "#C25B4A" }}> *</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
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
    <div className="flex items-center justify-between gap-4 py-1">
      <span
        className="text-sm"
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
            تم إرسال طلب التسجيل بنجاح
          </h2>

          <p
            className="text-sm leading-6 mb-6"
            style={{ color: "#7A8580" }}
          >
            شكرًا لتقديم طلب التسجيل في روضة الاتحاد الحديثة.
            ستقوم إدارة الروضة بمراجعة الطلب والتواصل معكم
            لتحديد موعد المقابلة واستكمال إجراءات التسجيل.
          </p>

          <div
            className="rounded-xl px-4 py-3 mb-6 text-xs leading-5"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EDE7D9",
              color: "#7A8580",
            }}
          >
            يرجى الاحتفاظ بمعلومات التواصل الخاصة بكم، حيث
            سيتم استخدامها من قبل إدارة الروضة للتواصل معكم
            بخصوص الطلب.
          </div>

          <button
            onClick={onBack}
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition"
            style={{ backgroundColor: "#4C8577" }}
          >
            رجوع لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full px-4 py-8"
      style={{ backgroundColor: "#FBF7EF" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* العودة */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium mb-5 transition"
          style={{ color: "#4C8577" }}
        >
          <ArrowRight size={16} />
          رجوع لتسجيل الدخول
        </button>

        {/* العنوان */}
        <div className="mb-6">
          <h1
            className="text-xl font-bold mb-1"
            style={{ color: "#2F3A36" }}
          >
            طلب تسجيل طفل جديد
          </h1>

          <p
            className="text-sm leading-6"
            style={{ color: "#7A8580" }}
          >
            يرجى تعبئة البيانات التالية لتقديم طلب التسجيل.
            بعد إرسال الطلب ستقوم إدارة الروضة بمراجعته
            والتواصل معكم لاستكمال إجراءات التسجيل.
          </p>
        </div>

        {/* شريط الخطوات */}
        <div className="flex items-start gap-2 mb-7">
          {STEPS.map((label, index) => {
            const active = index <= step;

            return (
              <div
                key={label}
                className="flex-1"
              >
                <div
                  className="h-1.5 rounded-full mb-1.5"
                  style={{
                    backgroundColor: active
                      ? "#4C8577"
                      : "#EDE7D9",
                  }}
                />

                <p
                  className="text-[11px] font-medium text-center"
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
              <Section title="بيانات الطفل الأساسية">
                <TextField
                  label="اسم الطفل الرباعي"
                  value={form.childName}
                  onChange={update("childName")}
                  required
                  placeholder="أدخل اسم الطفل الكامل"
                />

                <RadioGroup
                  label="الجنس"
                  options={["ذكر", "أنثى"]}
                  value={form.gender}
                  onChange={update("gender")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label="تاريخ الميلاد"
                    type="date"
                    value={form.birthDate}
                    onChange={update("birthDate")}
                    required
                  />

                  <TextField
                    label="مكان الولادة"
                    value={form.birthPlace}
                    onChange={update("birthPlace")}
                    placeholder="مثال: مستشفى النجاح"
                  />
                </div>

                <TextField
                  label="تاريخ دخول الروضة المتوقع"
                  type="date"
                  value={form.enrollDate}
                  onChange={update("enrollDate")}
                />
              </Section>

              <Section title="عنوان السكن والتواصل">
                <TextField
                  label="عنوان السكن الحالي"
                  value={form.address}
                  onChange={update("address")}
                  placeholder="المدينة / المنطقة"
                />

                <TextField
                  label="هاتف البيت"
                  value={form.homePhone}
                  onChange={update("homePhone")}
                  type="tel"
                  placeholder="059-XXXXXXX"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label="عدد الإخوة"
                    type="number"
                    value={form.siblingsCount}
                    onChange={update("siblingsCount")}
                  />

                  <TextField
                    label="ترتيب الطفل في الأسرة"
                    type="number"
                    value={form.childOrder}
                    onChange={update("childOrder")}
                  />
                </div>
              </Section>

              <Section title="بيانات الأب">
                <TextField
                  label="اسم الأب"
                  value={form.fatherName}
                  onChange={update("fatherName")}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label="عمل الأب"
                    value={form.fatherJob}
                    onChange={update("fatherJob")}
                  />

                  <TextField
                    label="مكان العمل"
                    value={form.fatherWorkplace}
                    onChange={update("fatherWorkplace")}
                  />
                </div>

                <TextField
                  label="جوال الأب"
                  value={form.fatherPhone}
                  onChange={update("fatherPhone")}
                  type="tel"
                  required
                  placeholder="059-XXXXXXX"
                />
              </Section>

              <Section title="بيانات الأم">
                <TextField
                  label="اسم الأم"
                  value={form.motherName}
                  onChange={update("motherName")}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label="عمل الأم"
                    value={form.motherJob}
                    onChange={update("motherJob")}
                  />

                  <TextField
                    label="مكان العمل"
                    value={form.motherWorkplace}
                    onChange={update("motherWorkplace")}
                  />
                </div>

                <TextField
                  label="جوال الأم"
                  value={form.motherPhone}
                  onChange={update("motherPhone")}
                  type="tel"
                  required
                  placeholder="059-XXXXXXX"
                />
              </Section>

              <Section title="الوضع الحالي للوالدين">
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
              <Section title="الحالة العائلية">
                <RadioGroup
                  label="هل أحد الوالدين مسافر؟"
                  options={["الأب", "الأم", "لا يوجد"]}
                  value={form.travelingParent}
                  onChange={update("travelingParent")}
                />

                <RadioGroup
                  label="هل أحد الوالدين متوفى؟"
                  options={["الأب", "الأم", "لا يوجد"]}
                  value={form.deceasedParent}
                  onChange={update("deceasedParent")}
                />

                <TextField
                  label="صلة القرابة بين الوالدين"
                  value={form.parentsRelation}
                  onChange={update("parentsRelation")}
                  placeholder="إن وجدت"
                />
              </Section>

              <Section title="الحالة الصحية">
                <CheckboxGroup
                  label="هل يعاني الطفل من أي أمراض أو حالات صحية؟"
                  options={HEALTH_CONDITIONS}
                  values={form.healthConditions}
                  onToggle={toggleCheckbox("healthConditions")}
                />

                <TextField
                  label="حالة صحية أخرى"
                  value={form.otherCondition}
                  onChange={update("otherCondition")}
                  placeholder="اذكر أي حالة غير موجودة في القائمة"
                />

                <YesNo
                  label="هل سبق وأجريت للطفل عملية؟"
                  value={form.hadSurgery}
                  onChange={update("hadSurgery")}
                />

                {form.hadSurgery === "نعم" && (
                  <TextField
                    label="تفاصيل العملية"
                    value={form.surgeryDetails}
                    onChange={update("surgeryDetails")}
                    placeholder="اذكر نوع العملية وتاريخها إن أمكن"
                  />
                )}

                <YesNo
                  label="هل يتناول الطفل أدوية حاليًا؟"
                  value={form.takesMedicine}
                  onChange={update("takesMedicine")}
                />

                {form.takesMedicine === "نعم" && (
                  <TextField
                    label="تفاصيل الأدوية"
                    value={form.medicineDetails}
                    onChange={update("medicineDetails")}
                    placeholder="اسم الدواء أو الأدوية"
                  />
                )}

                <YesNo
                  label="هل أخذ الطفل جميع التطعيمات اللازمة؟"
                  value={form.vaccinated}
                  onChange={update("vaccinated")}
                />
              </Section>

              <Section title="الاحتياجات الخاصة">
                <CheckboxGroup
                  label="هل لدى الطفل أي احتياجات خاصة؟"
                  options={SPECIAL_NEEDS}
                  values={form.specialNeeds}
                  onToggle={toggleCheckbox("specialNeeds")}
                />

                {form.specialNeeds.length > 0 && (
                  <TextField
                    label="الجهة المشرفة على الحالة"
                    value={form.specialNeedsSupervisor}
                    onChange={update(
                      "specialNeedsSupervisor"
                    )}
                    placeholder="اسم المركز أو الجهة إن وجدت"
                  />
                )}

                <YesNo
                  label="هل يوجد في الأسرة شخص من ذوي الاحتياجات الخاصة؟"
                  value={form.familyHasSpecialNeeds}
                  onChange={update(
                    "familyHasSpecialNeeds"
                  )}
                />

                {form.familyHasSpecialNeeds === "نعم" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextField
                      label="العدد"
                      type="number"
                      value={
                        form.familySpecialNeedsCount
                      }
                      onChange={update(
                        "familySpecialNeedsCount"
                      )}
                    />

                    <TextField
                      label="نوع الحالة"
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
              <Section title="سلوكيات وعادات الطفل">
                <YesNo
                  label="هل يبلل فراشه؟"
                  value={form.bedwetting}
                  onChange={update("bedwetting")}
                />

                <YesNo
                  label="هل يتناول فطوره بانتظام؟"
                  value={form.eatsBreakfast}
                  onChange={update("eatsBreakfast")}
                />

                <YesNo
                  label="هل ينام بشكل طبيعي؟"
                  value={form.sleepsNormally}
                  onChange={update("sleepsNormally")}
                />

                <YesNo
                  label="هل يتصف بالعصبية؟"
                  value={form.nervous}
                  onChange={update("nervous")}
                />

                <YesNo
                  label="هل يميل للانطواء أو الخجل؟"
                  value={form.introvertShy}
                  onChange={update("introvertShy")}
                />

                <YesNo
                  label="هل تظهر عليه سلوكيات عدوانية؟"
                  value={form.aggressive}
                  onChange={update("aggressive")}
                />

                <YesNo
                  label="هل يعاني من التأتأة؟"
                  value={form.stuttering}
                  onChange={update("stuttering")}
                />
              </Section>

              <Section title="وسيلة الاتصال في حالات الطوارئ">
                <TextField
                  label="اسم ورقم الشخص الذي يتم التواصل معه"
                  value={form.emergencyContact}
                  onChange={update(
                    "emergencyContact"
                  )}
                  required
                  placeholder="الاسم - رقم الهاتف"
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
                نود إعلامكم بأن المعلومات الواردة في هذه
                الاستمارة تستخدم لأغراض التسجيل والتواصل
                مع إدارة الروضة، وسيتم التعامل معها بسرية.
                ويتحمل ولي الأمر مسؤولية صحة البيانات
                المقدمة.
              </div>
            </>
          )}

          {/* أزرار التنقل */}
          <div className="flex gap-3 mt-2">
            {step > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition"
                style={{
                  border: "1px solid #E2DCCC",
                  backgroundColor: "#FFFFFF",
                  color: "#4A5551",
                }}
              >
                السابق
                <ArrowRight size={16} />
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition"
                style={{
                  backgroundColor: "#4C8577",
                }}
              >
                التالي
                <ArrowLeft size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition"
                style={{
                  backgroundColor: "#4C8577",
                }}
              >
                إرسال طلب التسجيل
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}