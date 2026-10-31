import { useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout.jsx';
import { AdminLayout } from './layouts/AdminLayout.jsx';
import { ProtectedRoute } from './components/admin/ProtectedRoute.jsx';
import { HomePage } from './pages/public/HomePage.jsx';
import { ProjectsPage } from './pages/public/ProjectsPage.jsx';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage.jsx';
import { NotFoundPage } from './pages/public/NotFoundPage.jsx';
import { LoginPage } from './pages/admin/LoginPage.jsx';
import { DashboardPage } from './pages/admin/DashboardPage.jsx';
import { ProfilePage } from './pages/admin/ProfilePage.jsx';
import { ProjectsPage as AdminProjectsPage } from './pages/admin/ProjectsPage.jsx';
import { ProjectFormPage } from './pages/admin/ProjectFormPage.jsx';
import { ExperiencesPage } from './pages/admin/ExperiencesPage.jsx';
import { EducationPage } from './pages/admin/EducationPage.jsx';
import { ContactPage } from './pages/admin/ContactPage.jsx';

function ScrollManager() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => window.clearTimeout(timer);
    }

    if (previousPath.current !== location.pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    previousPath.current = location.pathname;
    return undefined;
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="projects/new" element={<ProjectFormPage />} />
            <Route path="projects/:id/edit" element={<ProjectFormPage />} />
            <Route path="experiences" element={<ExperiencesPage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
