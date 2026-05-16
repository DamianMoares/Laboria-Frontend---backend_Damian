import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CourseCard.module.css';

const CourseCard = ({ course }) => {
  return (
    <div className={styles['course-card']}>
      <div className={styles['course-card-header']}>
        <Link to={`/cursos/${course.id}`} className={styles['course-title']}>
          {course.title}
        </Link>
        <span className={styles['platform-name']}>{course.platform}</span>
      </div>
      
      <div className={styles['course-card-body']}>
        <div className={styles['course-info']}>
          <span className={styles['info-item']}>
            <strong>Nivel:</strong> {course.level}
          </span>
          <span className={styles['info-item']}>
            <strong>Duración:</strong> {course.duration}
          </span>
          <span className={styles['info-item']}>
            <strong>Formato:</strong> {course.format}
          </span>
          <span className={styles['info-item']}>
            <strong>Precio:</strong> {course.price}
          </span>
        </div>
        
        <p className={styles['course-description']}>{course.description}</p>
        
        <div className={styles['course-tags']}>
          <span className={styles['tag'] + ' ' + styles['technology']}>{course.technology}</span>
          {course.certification && (
            <span className={styles['tag'] + ' ' + styles['certification']}>Certificación incluida</span>
          )}
        </div>

        <div className={styles['course-stats']}>
          <div className={styles['stat']}>
            <span className={styles['stat-value']}>⭐ {course.rating}</span>
            <span className={styles['stat-label']}>Rating</span>
          </div>
          <div className={styles['stat']}>
            <span className={styles['stat-value']}>{course.students.toLocaleString()}</span>
            <span className={styles['stat-label']}>Estudiantes</span>
          </div>
        </div>
      </div>
      
      <div className={styles['course-card-footer']}>
        <span className={styles['instructor']}>Instructor: {course.instructor}</span>
        <a 
          href={course.externalLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles['btn-enroll']}
        >
          Ver curso
        </a>
      </div>
    </div>
  );
};

export default CourseCard;
