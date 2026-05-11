import React, { useState } from 'react';
import './FAQPage.css';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿Qué es Laboria?",
      answer: "Laboria es un portal web de búsqueda de empleo y formación profesional orientado al mercado español. Combina ofertas laborales con cursos de formación para ofrecer un desarrollo profesional integral."
    },
    {
      question: "¿Es gratuito usar Laboria?",
      answer: "Sí, Laboria es completamente gratuito para usuarios que buscan empleo o formación. No cobramos por acceder a las ofertas de trabajo o información de cursos."
    },
    {
      question: "¿Cómo puedo aplicar a una oferta de empleo?",
      answer: "Actualmente, el botón de aplicación es una simulación en el frontend. En una versión completa, este botón te redirigiría al proceso de aplicación de la empresa o a un formulario de contacto."
    },
    {
      question: "¿Los cursos son impartidos por Laboria?",
      answer: "No, Laboria actúa como un directorio de cursos de terceros (Udemy, Coursera, Platzi, etc.). Al hacer clic en un curso, serás redirigido a la plataforma original donde se imparte."
    },
    {
      question: "¿Con qué frecuencia se actualizan las ofertas de empleo?",
      answer: "En esta versión demo, las ofertas de empleo son datos de ejemplo estáticos. En una versión completa, las ofertas se actualizarían diariamente desde APIs de empresas o scraping legal de portales de empleo."
    },
    {
      question: "¿Puedo guardar ofertas o cursos como favoritos?",
      answer: "Esta funcionalidad está planificada para futuras versiones. Permitirá guardar ofertas y cursos en tu perfil usando localStorage para un acceso rápido."
    },
    {
      question: "¿Laboria tiene versión móvil?",
      answer: "El diseño de Laboria es completamente responsive y se adapta a dispositivos móviles, tablets y escritorio. No necesitas descargar una app adicional."
    },
    {
      question: "¿Cómo puedo contactar con Laboria?",
      answer: "Puedes contactarnos a través del email contacto@laboria.com o visitando nuestra página 'Acerca de' para más información."
    },
    {
      question: "¿Ofrece Laboria servicios de orientación laboral?",
      answer: "Actualmente no ofrecemos servicios de orientación laboral directa, pero planeamos incorporar recursos y guías para ayudar en la búsqueda de empleo en futuras actualizaciones."
    },
    {
      question: "¿Puedo publicar ofertas de empleo en Laboria?",
      answer: "Esta funcionalidad está en desarrollo. En el futuro, las empresas podrán registrar sus cuentas y publicar ofertas de empleo directamente en la plataforma."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="container">
        <header className="faq-header">
          <h1>Preguntas Frecuentes</h1>
          <p className="faq-subtitle">
            Encuentra respuestas a las dudas más comunes sobre Laboria 
          </p>
        </header>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="question-text">{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="faq-contact">
          <h2>¿No encuentras tu respuesta?</h2>
          <p>
            Si tienes alguna otra pregunta, no dudes en contactarnos.
          </p>
          <a href="mailto:contacto@laboria .com" className="btn btn-primary">
            Contactar con soporte
          </a>
        </section>
      </div>
    </div>
  );
};

export default FAQPage;
