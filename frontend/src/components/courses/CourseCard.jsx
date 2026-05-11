import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-card-header">
        <Link to={`/cursos/${course.id}`} className="course-title">
          {course.title}
        </Link>
        <span className="platform-name">{course.platform}</span>
      </div>
      
      <div className="course-card-body">
        <div className="course-info">
          <span className="info-item">
            <strong>Nivel:</strong> {course.level}
          </span>
          <span className="info-item">
            <strong>Duración:</strong> {course.duration}
          </span>
          <span className="info-item">
            <strong>Formato:</strong> {course.format}
          </span>
          <span className="info-item">
            <strong>Precio:</strong> {course.price}
          </span>
        </div>
        
        <p className="course-description">{course.description}</p>
        
        <div className="course-tags">
          <span className="tag technology">{course.technology}</span>
          {course.certification && (
            <span className="tag certification">Certificación incluida</span>
          )}
        </div>

        <div className="course-stats">
          <div className="stat">
            <span className="stat-value">⭐ {course.rating}</span>
            <span className="stat-label">Rating</span>
          </div>
          <div className="stat">
            <span className="stat-value">{course.students.toLocaleString()}</span>
            <span className="stat-label">Estudiantes</span>
          </div>
        </div>
      </div>
      
      <div className="course-card-footer">
        <span className="instructor">Instructor: {course.instructor}</span>
        <a 
          href={course.externalLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-enroll"
        >
          Ver curso
        </a>
      </div>
    </div>
  );
};

export default CourseCard;
