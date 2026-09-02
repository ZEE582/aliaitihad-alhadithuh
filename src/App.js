import { useState } from "react";
import LoginPage from "./login";

import Dashboard from "./pages/dashboard/Dashboard";
import ChildrenList from "./pages/children/ChildrenList";
import ChildDetails from "./pages/children/Childdetails";
import MyChildPage from "./pages/children/MyChildPage";

import ParentsList from "./pages/parents/ParentsList";
import TeachersList from "./pages/teachers/TeachersList";
import ClassesList from "./pages/classes/ClassesList";
import SubjectsList from "./pages/subjects/SubjectsList";
import SessionsList from "./pages/sessions/SessionsList";

import AttendancePage from "./pages/attendance/AttendancePage";

import NotesList from "./pages/notes/NotesList";

import ReportsPage from "./pages/reports/ReportsPage";

import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/settings/SettingsPage";

import MessagesPage from "./pages/messages/MessagesPage";

import TeacherRating from "./pages/Rating/TeacherRating";

import RegistrationRequestsPage from "./pages/registration-requests/RegistrationRequestsPage";

import ComingSoon from "./pages/ComingSoon";

import { ChildrenProvider } from "./context/ChildrenContext";
import { ParentsProvider } from "./context/ParentsContext";
import { TeachersProvider } from "./context/TeachersContext";
import { ClassesProvider } from "./context/ClassesContext";
import { MessagesProvider } from "./context/MessagesContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { NotesProvider } from "./context/NotesContext";
import { TeacherRatingsProvider } from "./context/TeacherRatingsContext";
import { RegistrationRequestsProvider } from "./context/RegistrationRequestsContext";
import { UserProvider, useUser } from "./context/UserContext";

// ==========================================
// محتوى التطبيق بعد تسجيل الدخول
// ==========================================

function AppContent() {
  const { user, logout } = useUser();

  const getDefaultPage = () => {
    return user.roleType === "parent"
      ? "children"
      : "dashboard";
  };

  const [activePage, setActivePage] = useState(getDefaultPage());
  const [selectedChild, setSelectedChild] = useState(null);

  const handleNavigate = (pageKey) => {
    setSelectedChild(null);
    setActivePage(pageKey);
  };

  // ==========================================
  // تفاصيل الطفل
  // ==========================================

  if (activePage === "children" && selectedChild) {
    return (
      <ChildDetails
        child={selectedChild}
        onNavigate={handleNavigate}
        onLogout={logout}
        onBack={() => setSelectedChild(null)}
      />
    );
  }

  // ==========================================
  // Dashboard
  // ==========================================

  if (activePage === "dashboard") {
    if (user.roleType === "parent") {
      return (
        <MyChildPage
          onNavigate={handleNavigate}
          onLogout={logout}
          onOpenChild={(child) => setSelectedChild(child)}
        />
      );
    }

    return (
      <Dashboard
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Children
  // ==========================================

  if (activePage === "children") {
    if (user.roleType === "parent") {
      return (
        <MyChildPage
          onNavigate={handleNavigate}
          onLogout={logout}
          onOpenChild={(child) => setSelectedChild(child)}
        />
      );
    }

    return (
      <ChildrenList
        onNavigate={handleNavigate}
        onLogout={logout}
        onOpenChild={(child) => setSelectedChild(child)}
      />
    );
  }

  // ==========================================
  // Parents
  // ==========================================

  if (activePage === "parents") {
    return (
      <ParentsList
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Teachers
  // ==========================================

  if (activePage === "teachers") {
    return (
      <TeachersList
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Classes
  // ==========================================

  if (activePage === "classes") {
    return (
      <ClassesList
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Subjects
  // ==========================================

  if (activePage === "subjects") {
    return (
      <SubjectsList
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Sessions
  // ==========================================

  if (activePage === "sessions") {
    return (
      <SessionsList
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Attendance
  // ==========================================

  if (activePage === "attendance") {
    return (
      <AttendancePage
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Notes
  // ==========================================

  if (activePage === "notes") {
    return (
      <NotesList
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Messages
  // ==========================================

  if (activePage === "messages") {
    return (
      <MessagesPage
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Registration Requests
  // ==========================================

  if (activePage === "registration-requests") {
    return (
      <RegistrationRequestsPage
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Reports
  // ==========================================

  if (activePage === "reports") {
    return (
      <ReportsPage
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Teacher Rating
  // ==========================================

  if (activePage === "rate-teacher") {
    return (
      <TeacherRating
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Profile
  // ==========================================

  if (activePage === "profile") {
    return (
      <ProfilePage
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Settings
  // ==========================================

  if (activePage === "settings") {
    return (
      <SettingsPage
        onNavigate={handleNavigate}
        onLogout={logout}
      />
    );
  }

  // ==========================================
  // Coming Soon
  // ==========================================

  return (
    <ComingSoon
      pageKey={activePage}
      onNavigate={handleNavigate}
      onLogout={logout}
    />
  );
}

// ==========================================
// بوابة الدخول
// ==========================================

function AppGate() {
  const { user, login } = useUser();

  // ==========================================
  // إذا لم يسجل الدخول
  // ==========================================

  if (!user) {
    return (
      <LoginPage
        onLoginSuccess={(role) => login(role)}
      />
    );
  }

  // ==========================================
  // بعد تسجيل الدخول
  // ==========================================

  return (
    <ChildrenProvider>
      <ParentsProvider>
        <TeachersProvider>
          <ClassesProvider>
            <MessagesProvider>
              <AttendanceProvider>
                <NotesProvider>
                  <TeacherRatingsProvider>
                    <AppContent />
                  </TeacherRatingsProvider>
                </NotesProvider>
              </AttendanceProvider>
            </MessagesProvider>
          </ClassesProvider>
        </TeachersProvider>
      </ParentsProvider>
    </ChildrenProvider>
  );
}

// ==========================================
// App
// ==========================================

function App() {
  return (
    <UserProvider>
      <RegistrationRequestsProvider>
        <AppGate />
      </RegistrationRequestsProvider>
    </UserProvider>
  );
}

export default App;