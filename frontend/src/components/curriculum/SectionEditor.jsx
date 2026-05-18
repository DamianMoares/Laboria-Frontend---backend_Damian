import React, { useState } from 'react';
import styles from '../../pages/curriculo/CurriculumPage.module.css';

const FIELD_TYPES = {
  text: { tag: 'input', props: { type: 'text' } },
  date: { tag: 'input', props: { type: 'date' } },
  textarea: { tag: 'textarea', props: { rows: 3 } },
  select: { tag: 'select', props: {} },
};

const SectionEditor = ({ title, sectionName, items, fields, hook, editingItems, setEditingItems, expandedItems, setExpandedItems }) => {
  const [localExpanded, setLocalExpanded] = useState({});

  const toggleExpanded = (id) => {
    const key = `${sectionName}_${id}`;
    setLocalExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    if (setExpandedItems) setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isExpanded = (id) => {
    const key = `${sectionName}_${id}`;
    if (setExpandedItems) return expandedItems[key] || editingItems[`${sectionName}_${id}`];
    return localExpanded[key] || editingItems[`${sectionName}_${id}`];
  };

  const renderField = (item, field, isNew) => {
    const id = item.id;
    const value = item[field.name] || '';
    const onChange = (e) => hook.update(id, field.name, e.target.value);
    const fieldType = FIELD_TYPES[field.type] || FIELD_TYPES.text;

    if (field.type === 'select') {
      return (
        <select value={value} onChange={onChange}>
          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return <textarea value={value} onChange={onChange} placeholder={field.label} rows={field.rows || 3} />;
    }

    return <input type={field.type || 'text'} value={value} onChange={onChange} placeholder={field.label} />;
  };

  return (
    <section className={styles['curriculum-section']}>
      <div className={styles['section-header']}>
        <h2>{title}</h2>
        <button className="btn btn-secondary" onClick={() => {
          const template = {};
          fields.forEach(f => { template[f.name] = ''; });
          if (fields.some(f => f.name === 'level')) template.level = 'intermedio';
          hook.add(template);
        }}>
          + Agregar {title}
        </button>
      </div>

      {hook.newItem && (
        <div className={`${styles['curriculum-item']} ${styles['editing']}`}>
          <div className={styles['item-header']}>
            <span className={styles['item-status']}>Nueva {title}</span>
          </div>
          <div className={styles['item-content']}>
            <div className={styles['form-row']}>
              {fields.filter(f => !f.fullWidth).map(f => (
                <div key={f.name} className={styles['field-wrapper']}>
                  {renderField(hook.newItem, f, true)}
                </div>
              ))}
            </div>
            {fields.filter(f => f.fullWidth).map(f => (
              <div key={f.name}>{renderField(hook.newItem, f, true)}</div>
            ))}
            {hook.validationErrors[`${sectionName}_${hook.newItem.id}`] && (
              <div className={styles['validation-error']}>{hook.validationErrors[`${sectionName}_${hook.newItem.id}`]}</div>
            )}
            <div className={styles['form-actions']}>
              <button className="btn btn-primary" onClick={hook.saveNew}>Guardar</button>
              <button className="btn btn-secondary" onClick={hook.cancelNew}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {items.map((item) => {
        const isEditing = editingItems[`${sectionName}_${item.id}`];
        const expanded = isExpanded(item.id);
        return (
          <div key={item.id} className={`${styles['curriculum-item']} ${isEditing ? styles['editing'] : styles['read-only']} ${!expanded ? styles['collapsed'] : ''}`}>
            <div className={styles['item-header']} onClick={() => !isEditing && toggleExpanded(item.id)}>
              <input type="checkbox" checked={item.sendToApplication}
                onChange={(e) => { e.stopPropagation(); hook.toggleSendToApplication(item.id); }}
                className={styles['send-checkbox']} title="Enviar en aplicación" />
              <span className={styles['item-title']}>
                {fields.filter(f => f.main).map(f => item[f.name]).filter(Boolean).join(' - ') || 'Sin título'}
              </span>
              {isEditing ? (
                <button className={styles['btn-delete']} onClick={(e) => { e.stopPropagation(); hook.remove(item.id); }}>🗑️ Eliminar</button>
              ) : (
                <button className={styles['btn-edit']} onClick={(e) => { e.stopPropagation(); hook.startEditing(item.id, setEditingItems); }}>✏️ Editar</button>
              )}
            </div>

            {(expanded || isEditing) && (
              <div className={styles['item-content']}>
                {isEditing ? (
                  <>
                    <div className={styles['form-row']}>
                      {fields.filter(f => !f.fullWidth).map(f => (
                        <div key={f.name}>{renderField(item, f, false)}</div>
                      ))}
                    </div>
                    {fields.filter(f => f.fullWidth).map(f => (
                      <div key={f.name}>{renderField(item, f, false)}</div>
                    ))}
                    <div className={styles['form-actions']}>
                      <button className="btn btn-primary" onClick={() => hook.saveEdit(item.id, setEditingItems)}>Guardar</button>
                      <button className="btn btn-secondary" onClick={() => hook.cancelEdit(item.id, setEditingItems)}>Cancelar</button>
                    </div>
                  </>
                ) : (
                  <div className={styles['item-details']}>
                    {fields.filter(f => f.show).map(f => {
                      const val = item[f.name];
                      if (!val) return null;
                      const label = f.label.endsWith(':') ? f.label : `${f.label}:`;
                      return <p key={f.name}><strong>{label}</strong> {val}</p>;
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default SectionEditor;
