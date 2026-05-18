import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ROLES } from './config/enums';
import { Toaster } from 'react-hot-toast';
import { ConfirmProvider } from './context/ConfirmContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar/Navbar';
import CookieConsent from './components/CookieConsent';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/inicio/Home'));
const JobSearchPage = lazy(() => import('./pages/empleos/JobSearchPage'));
const CourseSearchPage = lazy(() => import('./pages/cursos/CourseSearchPage'));
const JobDetailPage = lazy(() => import('./pages/empleos/JobDetailPage'));
const CourseDetailPage = lazy(() => import('./pages/cursos/CourseDetailPage'));
const AboutPage = lazy(() => import('./pages/informacion/AboutPage'));
const FAQPage = lazy(() => import('./pages/informacion/FAQPage'));
const LoginPage = lazy(() => import('./pages/autenticacion/LoginPage'));
const RegisterPage = lazy(() => import('./pages/autenticacion/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/autenticacion/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/autenticacion/ResetPasswordPage'));
const CandidateProfilePage = lazy(() => import('./pages/perfiles/CandidateProfilePage'));
const CompanyProfilePage = lazy(() => import('./pages/perfiles/CompanyProfilePage'));
const DashboardPage = lazy(() => import('./pages/panel/DashboardPage'));
const PostJobPage = lazy(() => import('./pages/empleos/PostJobPage'));
const MyJobsPage = lazy(() => import('./pages/empleos/MyJobsPage'));
const PostCoursePage = lazy(() => import('./pages/cursos/PostCoursePage'));
const MyCoursesPage = lazy(() => import('./pages/cursos/MyCoursesPage'));
const MyApplicationsPage = lazy(() => import('./pages/aplicaciones/MyApplicationsPage'));
const SavedCoursesPage = lazy(() => import('./pages/cursos/SavedCoursesPage'));
const CurriculumPage = lazy(() => import('./pages/curriculo/CurriculumPage'));
const SettingsPage = lazy(() => import('./pages/configuracion/SettingsPage'));
const ApiStatusPage = lazy(() => import('./pages/admin/ApiStatusPage'));
const ProtectedAdminRoute = lazy(() => import('./pages/admin/ProtectedAdminRoute'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminJobs = lazy(() => import('./pages/admin/AdminJobs'));
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));

import styles from './App.module.css';

const PageLoader = () => (
  <div className={styles.loadingScreen}>
    <div className={styles.spinner}></div>
    <p>Cargando...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ConfirmProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className={styles.app}>
          <ErrorBoundary>
          <Navbar />
          <main className={styles.mainContent}>
            <Suspense fallback={<PageLoader />}>
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
              <Route path="/configuracion" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
              <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
              <Route path="/admin/jobs" element={<ProtectedAdminRoute><AdminJobs /></ProtectedAdminRoute>} />
              <Route path="/admin/courses" element={<ProtectedAdminRoute><AdminCourses /></ProtectedAdminRoute>} />
              <Route path="/admin/applications" element={<ProtectedAdminRoute><AdminApplications /></ProtectedAdminRoute>} />
              <Route path="/admin/api-status" element={<ProtectedAdminRoute><ApiStatusPage /></ProtectedAdminRoute>} />
            </Routes>
            </Suspense>
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
          </ErrorBoundary>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #3a3a3a',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
            }}
          />
        </div>
      </Router>
      </ConfirmProvider>
    </AuthProvider>
  );
}

export default App;
