import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoSitio from '../../assets/img/Laboria_Fondo_Negro.png';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, isCandidate, isAnyCompany, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const menu = menuRef.current;
    if (!menu) return;
    const focusable = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { setMobileMenuOpen(false); toggleRef.current?.focus(); return; }
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const getHomeRoute = () => {
    if (isCandidate()) return '/perfil/candidato';
    if (isAnyCompany()) return '/perfil/empresa';
    if (isAdmin()) return '/admin';
    return '/panel';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.navbarLogo} onClick={closeMobileMenu}>
          <img src={logoSitio} alt="Laboria" className={styles.navbarLogoImg} />
        </Link>
        <button 
          ref={toggleRef}
          className={styles.navbarToggle} 
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        {mobileMenuOpen && (
          <div className={styles.navbarOverlay} onClick={closeMobileMenu}></div>
        )}
        <ul id="mobile-menu" ref={menuRef} className={`${styles.navbarMenu} ${mobileMenuOpen ? styles.open : ''}`}>
          {isAuthenticated ? (
            <>
              <li className={styles.navbarItem}>
                <Link to={getHomeRoute()} className={styles.navbarLink} onClick={closeMobileMenu}>
                  Inicio
                </Link>
              </li>
              <li className={styles.navbarItem}>
                <Link to="/empleos" className={styles.navbarLink} onClick={closeMobileMenu}>
                  Búsqueda empleo
                </Link>
              </li>
              <li className={styles.navbarItem}>
                <Link to="/cursos" className={styles.navbarLink} onClick={closeMobileMenu}>
                  Búsqueda cursos
                </Link>
              </li>
              {isCandidate() && (
                <li className={styles.navbarItem}>
                  <Link to="/curriculum" className={styles.navbarLink} onClick={closeMobileMenu}>
                    CV
                  </Link>
                </li>
              )}
              {isCandidate() && (
                <li className={styles.navbarItem}>
                  <Link to="/mis-aplicaciones" className={styles.navbarLink} onClick={closeMobileMenu}>
                    Postulaciones
                  </Link>
                </li>
              )}
              <li className={styles.navbarItem}>
                <Link to="/configuracion" className={styles.navbarLink} onClick={closeMobileMenu}>
                  Configuración
                </Link>
              </li>
              <li className={styles.navbarItem}>
                <button onClick={() => { handleLogout(); closeMobileMenu(); }} className={styles.navbarLinkLogoutButton}>
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li className={styles.navbarItem}>
                <Link to="/" className={styles.navbarLink} onClick={closeMobileMenu}>
                  Inicio
                </Link>
              </li>
              <li className={styles.navbarItem}>
                <Link to="/empleos" className={styles.navbarLink} onClick={closeMobileMenu}>
                  Empleos
                </Link>
              </li>
              <li className={styles.navbarItem}>
                <Link to="/cursos" className={styles.navbarLink} onClick={closeMobileMenu}>
                  Cursos
                </Link>
              </li>
              <li className={styles.navbarItem}>
                <Link to="/acerca-de" className={styles.navbarLink} onClick={closeMobileMenu}>
                  Acerca de
                </Link>
              </li>
              <li className={styles.navbarItem}>
                <Link to="/faq" className={styles.navbarLink} onClick={closeMobileMenu}>
                  FAQ
                </Link>
              </li>
              <li className={styles.navbarItem}>
                <Link to="/login" className={styles.navbarLinkLoginButton} onClick={closeMobileMenu}>
                  Iniciar Sesión
                </Link>
              </li>
              <li className={styles.navbarItem}>
                <Link to="/registro" className={styles.navbarLinkRegisterButton} onClick={closeMobileMenu}>
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
