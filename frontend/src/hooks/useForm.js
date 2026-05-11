import { useState, useCallback } from 'react';

/**
 * Reglas de validación predefinidas para formularios.
 * Todas retornan string vacío si es válido, o mensaje de error si no.
 */
const validationRules = {
  /**
   * Valida que el campo no esté vacío.
   * @param {*} value - Valor a validar
   * @param {string} label - Etiqueta del campo para el mensaje de error
   * @returns {string} Mensaje de error o string vacío
   */
  required: (value, label) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${label || 'Este campo'} es obligatorio`;
    }
    return '';
  },
  /**
   * Valida formato de email.
   * @param {string} value - Email a validar
   * @returns {string} Mensaje de error o string vacío
   */
  email: (value) => {
    if (!value) return 'El email es obligatorio';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Email inválido (ej: usuario@dominio.com)';
    return '';
  },
  /**
   * Valida formato de teléfono español.
   * @param {string} value - Teléfono a validar
   * @returns {string} Mensaje de error o string vacío
   */
  phone: (value) => {
    if (!value) return '';
    if (!/^[+]?[\d\s()-]{6,20}$/.test(value)) return 'Teléfono inválido (ej: +34 600 000 000)';
    return '';
  },
  /**
   * Valida contraseña (mínimo 6 caracteres).
   * @param {string} value - Contraseña a validar
   * @returns {string} Mensaje de error o string vacío
   */
  password: (value) => {
    if (!value) return 'La contraseña es obligatoria';
    if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  },
  /**
   * Valida que coincida con el campo password.
   * @param {string} value - Confirmación de contraseña
   * @param {Object} values - Todos los valores del formulario
   * @returns {string} Mensaje de error o string vacío
   */
  confirmPassword: (value, values) => {
    if (!value) return 'Confirma tu contraseña';
    if (value !== values.password) return 'Las contraseñas no coinciden';
    return '';
  },
  /**
   * Valida formato de URL.
   * @param {string} value - URL a validar
   * @returns {string} Mensaje de error o string vacío
   */
  url: (value) => {
    if (!value) return '';
    try {
      new URL(value);
      return '';
    } catch {
      return 'URL inválida (ej: https://ejemplo.com)';
    }
  },
  /**
   * Valida longitud mínima.
   * @param {string} value - Valor a validar
   * @param {number} min - Longitud mínima
   * @param {string} label - Etiqueta del campo
   * @returns {string} Mensaje de error o string vacío
   */
  minLength: (value, min, label) => {
    if (value && value.length < min) return `${label || 'Este campo'} debe tener al menos ${min} caracteres`;
    return '';
  }
};

/**
 * Hook para manejo de formularios con validación.
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Function|null} validate - Función de validación personalizada
 * @returns {Object} Estado y funciones del formulario
 */
const useForm = (initialValues = {}, validate = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Maneja cambios en inputs (text, email, checkbox, etc.).
   * @param {Event} e - Evento del input
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({ ...prev, [name]: fieldValue }));

    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [errors]);

  /**
   * Maneja el evento blur (pierde foco) para validar campo.
   * @param {Event} e - Evento del input
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    if (validate) {
      const validationErrors = validate(values);
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] || '' }));
    }
  }, [values, validate]);

  /**
   * Maneja el submit del formulario con validación previa.
   * @param {Function} onSubmit - Función a ejecutar si es válido
   * @returns {Function} Handler para el evento onSubmit
   */
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await onSubmit(values);
    } catch (error) {
      setErrors(prev => ({ ...prev, general: error.message || 'Error al enviar el formulario' }));
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  /**
   * Restablece el formulario a valores iniciales o personalizados.
   * @param {Object} newValues - Valores para restablecer (opcional)
   */
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Actualiza un campo específico del formulario.
   * @param {string} name - Nombre del campo
   * @param {*} value - Nuevo valor
   */
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const hasErrors = Object.keys(errors).some(key => errors[key]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    hasErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setValues
  };
};

export { validationRules };
export default useForm;
