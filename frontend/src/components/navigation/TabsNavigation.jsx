import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './TabsNavigation.css';

const TabsNavigation = () => {
  const { user, isCandidate, isCompanyEmployees, isCompanyStudents, isCompanyHybrid } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return null;
  }

  const profile = user.profile || {};

  // Configuración de pestañas por rol
  const getCandidateTabs = () => [
    { id: 'jobs', label: 'Empleos', icon: '💼', link: '/empleos' },
    { id: 'courses', label: 'Cursos', icon: '📚', link: '/cursos' },
    { id: 'applications', label: 'Aplicaciones', icon: '📝', link: '/mis-aplicaciones' },
    { id: 'saved', label: 'Guardados', icon: '⭐', link: '/cursos-guardados' },
    { id: 'curriculum', label: 'Currículum', icon: '📄', link: '/curriculum' },
    { id: 'profile', label: 'Perfil', icon: '👤', link: '/perfil/candidato' }
  ];

  const getEmployeeTabs = () => [
    { id: 'post-job', label: 'Publicar Oferta', icon: '➕', link: '/publicar-oferta' },
    { id: 'my-jobs', label: 'Mis Ofertas', icon: '📋', link: '/mis-ofertas' },
    { id: 'browse-jobs', label: 'Ver Ofertas', icon: '🔍', link: '/empleos' },
    { id: 'profile', label: 'Perfil', icon: '🏢', link: '/perfil/empresa' }
  ];

  const getStudentTabs = () => [
    { id: 'post-course', label: 'Publicar Curso', icon: '➕', link: '/publicar-curso' },
    { id: 'my-courses', label: 'Mis Cursos', icon: '📚', link: '/mis-cursos' },
    { id: 'browse-courses', label: 'Ver Cursos', icon: '🔍', link: '/cursos' },
    { id: 'profile', label: 'Perfil', icon: '🏢', link: '/perfil/empresa' }
  ];

  const getHybridTabs = () => [
    { id: 'post-job', label: 'Publicar Oferta', icon: '➕', link: '/publicar-oferta' },
    { id: 'my-jobs', label: 'Mis Ofertas', icon: '📋', link: '/mis-ofertas' },
    { id: 'post-course', label: 'Publicar Curso', icon: '➕', link: '/publicar-curso' },
    { id: 'my-courses', label: 'Mis Cursos', icon: '📚', link: '/mis-cursos' },
    { id: 'browse-jobs', label: 'Ver Ofertas', icon: '🔍', link: '/empleos' },
    { id: 'browse-courses', label: 'Ver Cursos', icon: '🔍', link: '/cursos' },
    { id: 'profile', label: 'Perfil', icon: '🏢', link: '/perfil/empresa' }
  ];

  const getTabs = () => {
    if (isCandidate()) return getCandidateTabs();
    if (isCompanyEmployees()) return getEmployeeTabs();
    if (isCompanyStudents()) return getStudentTabs();
    if (isCompanyHybrid()) return getHybridTabs();
    return [];
  };

  const tabs = getTabs();

  return (
    <nav className="tabs-navigation">
      <div className="container">
        <div className="tabs-container">
          {tabs.map(tab => (
            <Link
              key={tab.id}
              to={tab.link}
              className={`tab-link ${window.location.pathname === tab.link ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TabsNavigation;
