import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { sessionService } from '../services/sessionService';
import styles from './SessionDurationChart.module.css';

const SessionDurationChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionService.getStats()
      .then(stats => {
        setData([
          { name: 'Candidatos', duracion: stats.candidates },
          { name: 'Empresas', duracion: stats.companies }
        ]);
      })
      .catch(() => {
        setData([
          { name: 'Candidatos', duracion: 0 },
          { name: 'Empresas', duracion: 0 }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0 min';
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Duración media de sesión</h3>
      {loading ? (
        <p className={styles.loading}>Cargando...</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.floor(v / 60)}m`} />
            <Tooltip formatter={(value) => formatDuration(value)} />
            <Bar dataKey="duracion" fill="#d4a843" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="duracion" position="top" formatter={formatDuration} style={{ fontSize: 11 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SessionDurationChart;
