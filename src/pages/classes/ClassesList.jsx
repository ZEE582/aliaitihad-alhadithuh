import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Eye,
  Trash2,
  Users,
  UserRound,
  School,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import ClassForm from "./ClassForm";

import { useClasses } from "../../context/ClassesContext";
import { useChildren } from "../../context/ChildrenContext";

function CapacityBadge({ current, capacity }) {
  const percentage =
    capacity > 0
      ? Math.round((current / capacity) * 100)
      : 0;

  let label = "متاح";
  let bgColor = "#4C857720";
  let textColor = "#4C8577";

  if (percentage >= 100) {
    label = "ممتلئ";
    bgColor = "#C25B4A20";
    textColor = "#C25B4A";
  } else if (percentage >= 80) {
    label = "قارب على الامتلاء";
    bgColor = "#D99A2020";
    textColor = "#B27A00";
  }

  return (
    <div className="flex flex-col gap-1">
      <span
        className="w-fit text-xs font-medium px-2.5 py-1 rounded-full"
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {label}
      </span>

      <span
        className="text-xs"
        style={{ color: "#7A8580" }}
      >
        {current} / {capacity} طفل
      </span>
    </div>
  );
}

export default function ClassesList({
  onNavigate,
  onLogout,
}) {
  const {
    classesList,
    addClass,
    updateClass,
    deleteClass,
  } = useClasses();

  const { childrenList } = useChildren();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // ======================================================
  // عدد الأطفال داخل الصف
  // ======================================================

  const getChildrenForClass = (className) => {
    return childrenList.filter(
      (child) =>
        child.classroom === className &&
        child.status === "نشط"
    );
  };

  // ======================================================
  // البحث
  // ======================================================

  const filtered = classesList.filter((item) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      item.name?.toLowerCase().includes(query) ||
      item.teacher?.toLowerCase().includes(query)
    );
  });

  // ======================================================
  // إضافة
  // ======================================================

  const handleAddClick = () => {
    setEditingClass(null);
    setFormOpen(true);
  };

  // ======================================================
  // تعديل
  // ======================================================

  const handleEditClick = (classItem) => {
    setEditingClass(classItem);
    setFormOpen(true);
  };

  // ======================================================
  // حفظ
  // ======================================================

  const handleSave = (formData) => {
    const cleanedData = {
      ...formData,
      capacity: Number(formData.capacity),
    };

    if (editingClass) {
      updateClass(
        editingClass.id,
        cleanedData
      );
    } else {
      addClass(cleanedData);
    }

    setFormOpen(false);
    setEditingClass(null);
  };

  // ======================================================
  // حذف
  // ======================================================

  const handleDelete = (classId) => {
    const classItem = classesList.find(
      (item) => item.id === classId
    );

    if (!classItem) return;

    const classChildren =
      getChildrenForClass(classItem.name);

    if (classChildren.length > 0) {
      window.alert(
        `لا يمكن حذف "${classItem.name}" لأنه يحتوي على ${classChildren.length} طفل نشط.`
      );
      return;
    }

    if (
      window.confirm(
        `متأكدة إنك بدك تحذفي "${classItem.name}"؟`
      )
    ) {
      deleteClass(classId);

      if (
        selectedClass?.id === classId
      ) {
        setSelectedClass(null);
      }
    }
  };

  // ======================================================
  // فتح تفاصيل الصف
  // ======================================================

  const handleViewClass = (classItem) => {
    setSelectedClass(classItem);
  };

  return (
    <DashboardLayout
      activePage="classes"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pageTitle="الصفوف"
    >
      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute top-1/2 -translate-y-1/2 right-3"
            style={{
              color: "#A8B0AB",
            }}
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="ابحث باسم الصف أو المعلم..."
            className="w-full rounded-xl py-2.5 pr-9 pl-3 text-sm outline-none"
            style={{
              border:
                "1px solid #E2DCCC",
              backgroundColor:
                "#FFFFFF",
              color: "#2F3A36",
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shrink-0"
          style={{
            backgroundColor:
              "#4C8577",
          }}
        >
          <Plus size={18} />
          إضافة صف
        </button>
      </div>

      {/* ==================================================
          Summary Cards
      ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor:
              "#FFFFFF",
            border:
              "1px solid #EDE7D9",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "#EAF2EF",
              }}
            >
              <School
                size={19}
                style={{
                  color: "#4C8577",
                }}
              />
            </div>

            <div>
              <p
                className="text-xs"
                style={{
                  color: "#7A8580",
                }}
              >
                إجمالي الصفوف
              </p>

              <p
                className="text-xl font-bold mt-1"
                style={{
                  color: "#2F3A36",
                }}
              >
                {classesList.length}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor:
              "#FFFFFF",
            border:
              "1px solid #EDE7D9",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "#F0F4F8",
              }}
            >
              <Users
                size={19}
                style={{
                  color: "#6E8FB0",
                }}
              />
            </div>

            <div>
              <p
                className="text-xs"
                style={{
                  color: "#7A8580",
                }}
              >
                الأطفال المسجلون
              </p>

              <p
                className="text-xl font-bold mt-1"
                style={{
                  color: "#2F3A36",
                }}
              >
                {
                  childrenList.filter(
                    (child) =>
                      child.status ===
                      "نشط"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor:
              "#FFFFFF",
            border:
              "1px solid #EDE7D9",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "#FFF6E8",
              }}
            >
              <UserRound
                size={19}
                style={{
                  color: "#B27A00",
                }}
              />
            </div>

            <div>
              <p
                className="text-xs"
                style={{
                  color: "#7A8580",
                }}
              >
                المقاعد المتاحة
              </p>

              <p
                className="text-xl font-bold mt-1"
                style={{
                  color: "#2F3A36",
                }}
              >
                {classesList.reduce(
                  (total, classItem) => {
                    const count =
                      getChildrenForClass(
                        classItem.name
                      ).length;

                    return (
                      total +
                      Math.max(
                        0,
                        Number(
                          classItem.capacity
                        ) - count
                      )
                    );
                  },
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          Classes Table
      ================================================== */}

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor:
            "#FFFFFF",
          border:
            "1px solid #EDE7D9",
        }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                backgroundColor:
                  "#FCFAF4",
                borderBottom:
                  "1px solid #EDE7D9",
              }}
            >
              <th
                className="text-right px-5 py-3 font-medium"
                style={{
                  color: "#7A8580",
                }}
              >
                اسم الصف
              </th>

              <th
                className="text-right px-5 py-3 font-medium"
                style={{
                  color: "#7A8580",
                }}
              >
                المعلمة المسؤولة
              </th>

              <th
                className="text-right px-5 py-3 font-medium"
                style={{
                  color: "#7A8580",
                }}
              >
                الأطفال
              </th>

              <th
                className="text-right px-5 py-3 font-medium"
                style={{
                  color: "#7A8580",
                }}
              >
                السعة
              </th>

              <th
                className="text-right px-5 py-3 font-medium"
                style={{
                  color: "#7A8580",
                }}
              >
                الحالة
              </th>

              <th
                className="text-right px-5 py-3 font-medium"
                style={{
                  color: "#7A8580",
                }}
              >
                إجراءات
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((classItem) => {
              const classChildren =
                getChildrenForClass(
                  classItem.name
                );

              const capacity =
                Number(
                  classItem.capacity
                ) || 0;

              const availableSeats =
                Math.max(
                  0,
                  capacity -
                    classChildren.length
                );

              return (
                <tr
                  key={classItem.id}
                  style={{
                    borderBottom:
                      "1px solid #F3EFE3",
                  }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor:
                            "#EAF2EF",
                        }}
                      >
                        <School
                          size={17}
                          style={{
                            color:
                              "#4C8577",
                          }}
                        />
                      </div>

                      <span
                        className="font-semibold"
                        style={{
                          color:
                            "#2F3A36",
                        }}
                      >
                        {classItem.name}
                      </span>
                    </div>
                  </td>

                  <td
                    className="px-5 py-4"
                    style={{
                      color:
                        "#4A5551",
                    }}
                  >
                    {classItem.teacher}
                  </td>

                  <td
                    className="px-5 py-4"
                    style={{
                      color:
                        "#4A5551",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Users size={15} />

                      <span>
                        {classChildren.length}
                      </span>
                    </div>
                  </td>

                  <td
                    className="px-5 py-4"
                    style={{
                      color:
                        "#4A5551",
                    }}
                  >
                    <div>
                      <span>
                        {classChildren.length} /{" "}
                        {capacity}
                      </span>

                      <p
                        className="text-xs mt-1"
                        style={{
                          color:
                            "#A8B0AB",
                        }}
                      >
                        {availableSeats > 0
                          ? `${availableSeats} مقعد متاح`
                          : "لا توجد مقاعد"}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <CapacityBadge
                      current={
                        classChildren.length
                      }
                      capacity={capacity}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {/* عرض */}
                      <button
                        type="button"
                        onClick={() =>
                          handleViewClass(
                            classItem
                          )
                        }
                        className="p-1.5 rounded-lg hover:opacity-70"
                        style={{
                          color:
                            "#6E8FB0",
                        }}
                        title="عرض تفاصيل الصف"
                      >
                        <Eye size={16} />
                      </button>

                      {/* تعديل */}
                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(
                            classItem
                          )
                        }
                        className="p-1.5 rounded-lg hover:opacity-70"
                        style={{
                          color:
                            "#4C8577",
                        }}
                        title="تعديل الصف"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* حذف */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            classItem.id
                          )
                        }
                        className="p-1.5 rounded-lg hover:opacity-70"
                        style={{
                          color:
                            "#C25B4A",
                        }}
                        title="حذف الصف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p
            className="text-center text-sm py-8"
            style={{
              color: "#A8B0AB",
            }}
          >
            لا يوجد صفوف مطابقة للبحث
          </p>
        )}
      </div>

      {/* ==================================================
          تفاصيل الصف
      ================================================== */}

      {selectedClass && (
        <div
          dir="rtl"
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backgroundColor:
              "#00000040",
          }}
        >
          <div
            className="w-full max-w-2xl rounded-3xl overflow-hidden"
            style={{
              backgroundColor:
                "#FFFFFF",
              boxShadow:
                "0 20px 60px rgba(47,58,54,0.15)",
            }}
          >
            <div
              className="p-6"
              style={{
                backgroundColor:
                  "#FCFAF4",
                borderBottom:
                  "1px solid #EDE7D9",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor:
                          "#EAF2EF",
                      }}
                    >
                      <School
                        size={20}
                        style={{
                          color:
                            "#4C8577",
                        }}
                      />
                    </div>

                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{
                          color:
                            "#2F3A36",
                        }}
                      >
                        {selectedClass.name}
                      </h3>

                      <p
                        className="text-xs mt-1"
                        style={{
                          color:
                            "#7A8580",
                        }}
                      >
                        المعلمة:{" "}
                        {selectedClass.teacher}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedClass(null)
                  }
                  className="px-3 py-2 rounded-xl text-sm"
                  style={{
                    color:
                      "#7A8580",
                    backgroundColor:
                      "#FFFFFF",
                    border:
                      "1px solid #E2DCCC",
                  }}
                >
                  إغلاق
                </button>
              </div>
            </div>

            <div className="p-6">
              {(() => {
                const classChildren =
                  getChildrenForClass(
                    selectedClass.name
                  );

                return (
                  <>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div
                        className="rounded-2xl p-4 text-center"
                        style={{
                          backgroundColor:
                            "#F4F8F7",
                        }}
                      >
                        <p
                          className="text-xl font-bold"
                          style={{
                            color:
                              "#2F3A36",
                          }}
                        >
                          {
                            classChildren.length
                          }
                        </p>

                        <p
                          className="text-xs mt-1"
                          style={{
                            color:
                              "#7A8580",
                          }}
                        >
                          الأطفال
                        </p>
                      </div>

                      <div
                        className="rounded-2xl p-4 text-center"
                        style={{
                          backgroundColor:
                            "#F4F8F7",
                        }}
                      >
                        <p
                          className="text-xl font-bold"
                          style={{
                            color:
                              "#2F3A36",
                          }}
                        >
                          {
                            selectedClass.capacity
                          }
                        </p>

                        <p
                          className="text-xs mt-1"
                          style={{
                            color:
                              "#7A8580",
                          }}
                        >
                          السعة
                        </p>
                      </div>

                      <div
                        className="rounded-2xl p-4 text-center"
                        style={{
                          backgroundColor:
                            "#F4F8F7",
                        }}
                      >
                        <p
                          className="text-xl font-bold"
                          style={{
                            color:
                              "#4C8577",
                          }}
                        >
                          {Math.max(
                            0,
                            Number(
                              selectedClass.capacity
                            ) -
                              classChildren.length
                          )}
                        </p>

                        <p
                          className="text-xs mt-1"
                          style={{
                            color:
                              "#7A8580",
                          }}
                        >
                          مقاعد متاحة
                        </p>
                      </div>
                    </div>

                    <h4
                      className="text-sm font-bold mb-3"
                      style={{
                        color:
                          "#2F3A36",
                      }}
                    >
                      أطفال الصف
                    </h4>

                    {classChildren.length >
                    0 ? (
                      <div className="space-y-2">
                        {classChildren.map(
                          (child) => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between rounded-2xl p-3"
                              style={{
                                backgroundColor:
                                  "#FCFAF4",
                                border:
                                  "1px solid #EDE7D9",
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                                  style={{
                                    backgroundColor:
                                      "#EAF2EF",
                                  }}
                                >
                                  <Users
                                    size={16}
                                    style={{
                                      color:
                                        "#4C8577",
                                    }}
                                  />
                                </div>

                                <div>
                                  <p
                                    className="text-sm font-semibold"
                                    style={{
                                      color:
                                        "#2F3A36",
                                    }}
                                  >
                                    {child.name}
                                  </p>

                                  <p
                                    className="text-xs mt-0.5"
                                    style={{
                                      color:
                                        "#7A8580",
                                    }}
                                  >
                                    العمر:{" "}
                                    {child.age}{" "}
                                    سنوات
                                  </p>
                                </div>
                              </div>

                              <span
                                className="text-xs px-2.5 py-1 rounded-full"
                                style={{
                                  backgroundColor:
                                    "#4C857720",
                                  color:
                                    "#4C8577",
                                }}
                              >
                                نشط
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div
                        className="text-center rounded-2xl py-8"
                        style={{
                          backgroundColor:
                            "#FCFAF4",
                          border:
                            "1px solid #EDE7D9",
                        }}
                      >
                        <Users
                          size={28}
                          className="mx-auto mb-2"
                          style={{
                            color:
                              "#A8B0AB",
                          }}
                        />

                        <p
                          className="text-sm"
                          style={{
                            color:
                              "#7A8580",
                          }}
                        >
                          لا يوجد أطفال
                          مسجلون في هذا الصف
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          Add / Edit Form
      ================================================== */}

      {formOpen && (
        <ClassForm
          initialData={editingClass}
          onClose={() => {
            setFormOpen(false);
            setEditingClass(null);
          }}
          onSave={handleSave}
        />
      )}
    </DashboardLayout>
  );
}