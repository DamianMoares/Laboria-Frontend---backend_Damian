import React from 'react';
import styles from './Spinner.module.css';

const Spinner = ({ size = 40 }) => (
  <div
    className={styles.spinner}
    style={{ width: size, height: size }}
    role="status"
    aria-label="Cargando"
  />
);

export default Spinner;
