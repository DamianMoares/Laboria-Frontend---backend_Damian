import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import jobsData from '../../data/jobs.json';
import './JobDetailPage.css';

const JobDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isCandidate } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const foundJob = jobsData.find(j => j.id === parseInt(id));
    setJob(foundJob);

    // Check if user has already applied
    if (user && isCandidate()) {
      const savedApplications = JSON.parse(localStorage.getItem('user_applications') || '[]');
      const alreadyApplied = savedApplications.some(
        app => app.userId === user.id && app.jobId === parseInt(id)
      );
      setHasApplied(alreadyApplied);
    }
  }, [id, user, isCandidate]);

  if (!job) {
    return (
      <div className="detail-page not-found">
        <div className="container">
          <h1>Oferta no encontrada</h1>
          <p>La oferta de empleo que buscas no existe.</p>
          <Link to="/empleos" className="btn btn-primary">
            Volver a empleos
          </Link>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isCandidate()) {
      alert('Solo los candidatos pueden aplicar a ofertas de empleo');
      return;
    }

    // Get user's curriculum
    const savedCurriculum = JSON.parse(localStorage.getItem(`curriculum_${user.id}`) || '{}');
    
    // Filter curriculum items that are marked to send in application
    const curriculumToSend = {
      experience: savedCurriculum.experience?.filter(item => item.sendToApplication) || [],
      education: savedCurriculum.education?.filter(item => item.sendToApplication) || [],
      skills: savedCurriculum.skills?.filter(item => item.sendToApplication) || [],
      projects: savedCurriculum.projects?.filter(item => item.sendToApplication) || [],
      languages: savedCurriculum.languages?.filter(item => item.sendToApplication) || []
    };

    const savedApplications = JSON.parse(localStorage.getItem('user_applications') || '[]');
    const newApplication = {
      userId: user.id,
      jobId: job.id,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'pendiente',
      curriculum: curriculumToSend
    };
    
    savedApplications.push(newApplication);
    localStorage.setItem('user_applications', JSON.stringify(savedApplications));
    
    setHasApplied(true);
    
    const hasCurriculum = Object.keys(curriculumToSend).some(key => curriculumToSend[key].length > 0);
    alert(hasCurriculum 
      ? 'Has aplicado a esta oferta con tu currículum personalizado' 
      : 'Has aplicado a esta oferta (sin currículum personalizado)');
  };

  return (
    <div className="detail-page job-detail-page">
      <div className="container">
        <Link to="/empleos" className="back-link">
          ← Volver a empleos
        </Link>

        <div className="detail-header">
          <h1 className="detail-title">{job.title}</h1>
          <div className="detail-meta">
            <span className="meta-item company">{job.company}</span>
            <span className="meta-item location">{job.location}</span>
            <span className="meta-item posted-date">Publicado: {job.postedDate}</span>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-main">
            <section className="detail-section">
              <h2>Descripción</h2>
              <p className="description-text">{job.description}</p>
            </section>

            <section className="detail-section">
              <h2>Requisitos</h2>
              <ul className="requirements-list">
                {job.requirements.map((req, index) => (
                  <li key={index} className="requirement-item">{req}</li>
                ))}
              </ul>
            </section>

            <section className="detail-section">
              <h2>Beneficios</h2>
              <ul className="benefits-list">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="benefit-item">{benefit}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <h3>Información de la oferta</h3>
              
              <div className="info-row">
                <span className="info-label">Modalidad:</span>
                <span className="info-value">{job.workMode}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Jornada:</span>
                <span className="info-value">{job.schedule}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Nivel:</span>
                <span className="info-value">{job.experienceLevel}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Salario:</span>
                <span className="info-value salary">{job.salary}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Contrato:</span>
                <span className="info-value">{job.contractType}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Sector:</span>
                <span className="info-value">{job.sector}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Tecnología:</span>
                <span className="info-value technology">{job.technology}</span>
              </div>

              {hasApplied ? (
                <button className="btn-apply-sidebar applied" disabled>
                  ✓ Ya has aplicado
                </button>
              ) : (
                <button className="btn-apply-sidebar" onClick={handleApply}>
                  Aplicar a esta oferta
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
