import React from 'react';
import styles from './EmptyState.module.css';

const EmptyState = ({ icon, title, message, action }) => (
  <div className={styles.emptyState}>
    {icon && <div className={styles.icon}>{icon}</div>}
    <h3 className={styles.title}>{title}</h3>
    <p className={styles.message}>{message}</p>
    {action && <div className={styles.action}>{action}</div>}
  </div>
);

export default EmptyState;
