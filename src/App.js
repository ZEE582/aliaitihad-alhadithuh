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
import ComingSoon from "./pages/ComingSoon";
import { ChildrenProvider } from "./context/ChildrenContext";
import { ParentsProvider } from "./context/ParentsContext";
import { TeachersProvider } from "./context/TeachersContext";
import { ClassesProvider } from "./context/ClassesContext";
import { MessagesProvider } from "./context/MessagesContext";
import { UserProvider, useUser } from "./context/UserContext";

function AppContent() {
  const { user, logout } = useUser();

    const getDefaultPage = () => (user.roleType === "parent" ? "children" : "dashboard");

  const [activePage, setActivePage] = useState(getDefaultPage());
  const [selectedChild, setSelectedChild] = useState(null);

  const handleNavigate = (pageKey) => {
    setSelectedChild(null);
    setActivePage(pageKey);
  };

  if (activePage === "children" && selectedChild) {
    return <ChildDetails child={selectedChild} onNavigate={handleNavigate} onLogout={logout} onBack={() => setSelectedChild(null)} />;
  }

  if (activePage === "dashboard") {
    if (user.roleType === "parent") {
      return <MyChildPage onNavigate={handleNavigate} onLogout={logout} onOpenChild={(child) => setSelectedChild(child)} />;
    }
    return <Dashboard onNavigate={handleNavigate} onLogout={logout} />;
  }

  if (activePage === "children") {
    if (user.roleType === "parent") {
      return <MyChildPage onNavigate={handleNavigate} onLogout={logout} onOpenChild={(child) => setSelectedChild(child)} />;
    }
    return <ChildrenList onNavigate={handleNavigate} onLogout={logout} onOpenChild={(child) => setSelectedChild(child)} />;
  }

  if (activePage === "parents") {
    return <ParentsList onNavigate={handleNavigate} onLogout={logout} />;
  }

  if (activePage === "teachers") {
    return <TeachersList onNavigate={handleNavigate} onLogout={logout} />;
  }

  if (activePage === "classes") {
    return <ClassesList onNavigate={handleNavigate} onLogout={logout} />;
  }

  if (activePage === "subjects") {
    return <SubjectsList onNavigate={handleNavigate} onLogout={logout} />;
  }

  if (activePage === "sessions") {
    return <SessionsList onNavigate={handleNavigate} onLogout={logout} />;
  }

  if (activePage === "attendance") {
    return <AttendancePage onNavigate={handleNavigate} onLogout={logout} />;
  }

  if (activePage === "notes") {
    return <NotesList onNavigate={handleNavigate} onLogout={logout} />;
  }

  if (activePage === "messages") {
    return <MessagesPage onNavigate={handleNavigate} onLogout={logout} />;
  }

  if (activePage === "reports") {
    return <ReportsPage onNavigate={handleNavigate} onLogout={logout} />;
  }

  if (activePage === "profile") {
    return <ProfilePage onNavigate={handleNavigate} onLogout={logout} />;
  }

  if (activePage === "settings") {
    return <SettingsPage onNavigate={handleNavigate} onLogout={logout} />;
  }

  return <ComingSoon pageKey={activePage} onNavigate={handleNavigate} onLogout={logout} />;


}



// بوابة الدخول: بتقرر تعرض صفحة تسجيل الدخول أو محتوى التطبيق حسب وجود مستخدم بالـ UserContext
function AppGate() {
  const { user, login } = useUser();

  if (!user) {
    return <LoginPage onLoginSuccess={(role) => login(role)} />;
  }

  return (
    <ChildrenProvider>
      <ParentsProvider>
        <TeachersProvider>
          <ClassesProvider>
            <MessagesProvider>
              <AppContent />
            </MessagesProvider>
          </ClassesProvider>
        </TeachersProvider>
      </ParentsProvider>
    </ChildrenProvider>
  );
}

function App() {
  return (
    <UserProvider>
      <AppGate />
    </UserProvider>
  );
}

export default App;