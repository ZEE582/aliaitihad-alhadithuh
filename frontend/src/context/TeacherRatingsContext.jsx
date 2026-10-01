import { createContext, useContext, useState } from "react";

const TeacherRatingsContext = createContext(null);

export function TeacherRatingsProvider({ children }) {
  const [ratings, setRatings] = useState([]);

  const addRating = (ratingData) => {
    const newRating = {
      id: Date.now(),
      date: new Date().toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      ...ratingData,
    };

    setRatings((prev) => [newRating, ...prev]);

    return newRating;
  };

  const getParentRating = (parentId, teacherId, childId) => {
    return ratings.find(
      (rating) =>
        rating.parentId === parentId &&
        rating.teacherId === teacherId &&
        rating.childId === childId
    );
  };

  return (
    <TeacherRatingsContext.Provider
      value={{
        ratings,
        addRating,
        getParentRating,
      }}
    >
      {children}
    </TeacherRatingsContext.Provider>
  );
}

export function useTeacherRatings() {
  const context = useContext(TeacherRatingsContext);

  if (!context) {
    throw new Error(
      "useTeacherRatings لازم تستخدم جوا TeacherRatingsProvider"
    );
  }

  return context;
}