import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <header className="about-header">
          <h1>Acerca de Laboria</h1>
          <p className="about-subtitle">
            Tu portal de empleo y formación profesional en España
          </p>
        </header>

        <section className="about-section">
          <h2>Nuestra Misión</h2>
          <p>
            Laboria nace con la misión de conectar profesionales españoles con oportunidades laborales 
            y formación de calidad. Creemos que el desarrollo profesional es un camino continuo que 
            combina experiencia laboral con aprendizaje constante.
          </p>
        </section>

        <section className="about-section">
          <h2>Por qué Laboria</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">💼</div>
              <h3>Empleo</h3>
              <p>
                Miles de ofertas de trabajo actualizadas diariamente, con filtros avanzados para 
                encontrar la oportunidad perfecta.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📚</div>
              <h3>Formación</h3>
              <p>
                Cursos, bootcamps y certificaciones de las mejores plataformas para mejorar tus 
                habilidades y perfil profesional.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h3>Enfoque Integral</h3>
              <p>
                Diferente de otros portales, integramos empleo y formación en una sola plataforma 
                para un desarrollo profesional completo.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🇪🇸</div>
              <h3>100% Español</h3>
              <p>
                Diseñado específicamente para el mercado español, con contenido y ofertas 
                totalmente en español.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Nuestros Valores</h2>
          <div className="values-list">
            <div className="value-item">
              <h3>Transparencia</h3>
              <p>Información clara y honesta sobre ofertas y cursos.</p>
            </div>
            <div className="value-item">
              <h3>Calidad</h3>
              <p>Curación rigurosa de contenido para garantizar la mejor experiencia.</p>
            </div>
            <div className="value-item">
              <h3>Accesibilidad</h3>
              <p>Plataforma fácil de usar para todos los niveles profesionales.</p>
            </div>
            <div className="value-item">
              <h3>Innovación</h3>
              <p>Mejora continua basada en feedback de nuestra comunidad.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Contacto</h2>
          <p className="contact-text">
            ¿Tienes preguntas o sugerencias? Nos encantaría saber de ti.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <strong>Email:</strong> contacto@laboria.com
            </div>
            <div className="contact-item">
              <strong>Ubicación:</strong> Madrid, España
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
