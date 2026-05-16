import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ROLES } from './config/enums';
import Navbar from './components/Navbar/Navbar';
import TabsNavigation from './components/navigation/TabsNavigation';
import CookieConsent from './components/CookieConsent';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/inicio/Home';
import JobSearchPage from './pages/empleos/JobSearchPage';
import CourseSearchPage from './pages/cursos/CourseSearchPage';
import JobDetailPage from './pages/empleos/JobDetailPage';
import CourseDetailPage from './pages/cursos/CourseDetailPage';
import AboutPage from './pages/informacion/AboutPage';
import FAQPage from './pages/informacion/FAQPage';
import LoginPage from './pages/autenticacion/LoginPage';
import RegisterPage from './pages/autenticacion/RegisterPage';
import ForgotPasswordPage from './pages/autenticacion/ForgotPasswordPage';
import ResetPasswordPage from './pages/autenticacion/ResetPasswordPage';
import CandidateProfilePage from './pages/perfiles/CandidateProfilePage';
import CompanyProfilePage from './pages/perfiles/CompanyProfilePage';
import DashboardPage from './pages/panel/DashboardPage';
import PostJobPage from './pages/empleos/PostJobPage';
import MyJobsPage from './pages/empleos/MyJobsPage';
import PostCoursePage from './pages/cursos/PostCoursePage';
import MyCoursesPage from './pages/cursos/MyCoursesPage';
import MyApplicationsPage from './pages/aplicaciones/MyApplicationsPage';
import SavedCoursesPage from './pages/cursos/SavedCoursesPage';
import CurriculumPage from './pages/curriculo/CurriculumPage';
import ApiStatusPage from './pages/admin/ApiStatusPage';
import ProtectedAdminRoute from './pages/admin/ProtectedAdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminJobs from './pages/admin/AdminJobs';
import AdminCourses from './pages/admin/AdminCourses';
import AdminApplications from './pages/admin/AdminApplications';
import styles from './App.module.css';


function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className={styles.app}>
          <Navbar />
          <main className={styles.mainContent}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/empleos" element={<JobSearchPage />} />
              <Route path="/empleos/:id" element={<JobDetailPage />} />
              <Route path="/cursos" element={<CourseSearchPage />} />
              <Route path="/cursos/:id" element={<CourseDetailPage />} />
              <Route path="/acerca-de" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              <Route path="/olvide-mi-contrasena" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/perfil/candidato" element={<ProtectedRoute roles={[ROLES.CANDIDATE]}><CandidateProfilePage /></ProtectedRoute>} />
              <Route path="/perfil/empresa" element={<ProtectedRoute roles={[ROLES.COMPANY_EMPLOYEES, ROLES.COMPANY_STUDENTS, ROLES.COMPANY_HYBRID]}><CompanyProfilePage /></ProtectedRoute>} />
              <Route path="/panel" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/publicar-oferta" element={<ProtectedRoute roles={[ROLES.COMPANY_EMPLOYEES, ROLES.COMPANY_HYBRID]}><PostJobPage /></ProtectedRoute>} />
              <Route path="/mis-ofertas" element={<ProtectedRoute roles={[ROLES.COMPANY_EMPLOYEES, ROLES.COMPANY_HYBRID]}><MyJobsPage /></ProtectedRoute>} />
              <Route path="/publicar-curso" element={<ProtectedRoute roles={[ROLES.COMPANY_STUDENTS, ROLES.COMPANY_HYBRID]}><PostCoursePage /></ProtectedRoute>} />
              <Route path="/mis-cursos" element={<ProtectedRoute roles={[ROLES.COMPANY_STUDENTS, ROLES.COMPANY_HYBRID]}><MyCoursesPage /></ProtectedRoute>} />
              <Route path="/mis-aplicaciones" element={<ProtectedRoute roles={[ROLES.CANDIDATE]}><MyApplicationsPage /></ProtectedRoute>} />
              <Route path="/cursos-guardados" element={<ProtectedRoute roles={[ROLES.CANDIDATE]}><SavedCoursesPage /></ProtectedRoute>} />
              <Route path="/curriculum" element={<ProtectedRoute roles={[ROLES.CANDIDATE]}><CurriculumPage /></ProtectedRoute>} />
              {/* Rutas de Administración */}
              <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
              <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
              <Route path="/admin/jobs" element={<ProtectedAdminRoute><AdminJobs /></ProtectedAdminRoute>} />
              <Route path="/admin/courses" element={<ProtectedAdminRoute><AdminCourses /></ProtectedAdminRoute>} />
              <Route path="/admin/applications" element={<ProtectedAdminRoute><AdminApplications /></ProtectedAdminRoute>} />
              <Route path="/admin/api-status" element={<ProtectedAdminRoute><ApiStatusPage /></ProtectedAdminRoute>} />
            </Routes>
          </main>

          <footer className={styles.appFooter}>
            <div className="container">
              <div className={styles.footerContent}>
                <p>&copy; 2026 Laboria . Todos los derechos reservados.</p>
                <div className={styles.footerLegal}>
                  <a href={`${import.meta.env.BASE_URL}legal/aviso-legal.html`} target="_blank" rel="noopener noreferrer">Aviso Legal </a>
                  <span className="footer-separator">|</span>
                  <a href={`${import.meta.env.BASE_URL}legal/politica-privacidad.html`} target="_blank" rel="noopener noreferrer"> Política de Privacidad </a>
                  <span className="footer-separator">|</span>
                  <a href={`${import.meta.env.BASE_URL}legal/terminos-condiciones.html`} target="_blank" rel="noopener noreferrer"> Términos y Condiciones</a>
                </div>
              </div>
            </div>
          </footer>
          <CookieConsent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
