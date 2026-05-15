export const ROLES = {
  CANDIDATE: 'CANDIDATE',
  COMPANY_EMPLOYEES: 'COMPANY_EMPLOYEES',
  COMPANY_STUDENTS: 'COMPANY_STUDENTS',
  COMPANY_HYBRID: 'COMPANY_HYBRID',
  ADMIN: 'ADMIN',
};

export const WORK_MODES = {
  REMOTE: 'REMOTE',
  HYBRID: 'HYBRID',
  ONSITE: 'ONSITE',
};

export const LEVELS = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
};

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

export const ROLE_LABELS = {
  [ROLES.CANDIDATE]: 'Candidato',
  [ROLES.COMPANY_EMPLOYEES]: 'Empresa (Empleados)',
  [ROLES.COMPANY_STUDENTS]: 'Empresa (Estudiantes)',
  [ROLES.COMPANY_HYBRID]: 'Empresa (Híbrido)',
  [ROLES.ADMIN]: 'Administrador',
};

export const WORK_MODE_LABELS = {
  [WORK_MODES.REMOTE]: 'Remoto',
  [WORK_MODES.HYBRID]: 'Híbrido',
  [WORK_MODES.ONSITE]: 'Presencial',
};

export const LEVEL_LABELS = {
  [LEVELS.BEGINNER]: 'Principiante',
  [LEVELS.INTERMEDIATE]: 'Intermedio',
  [LEVELS.ADVANCED]: 'Avanzado',
};

export const STATUS_LABELS = {
  [APPLICATION_STATUS.PENDING]: 'Pendiente',
  [APPLICATION_STATUS.ACCEPTED]: 'Aceptada',
  [APPLICATION_STATUS.REJECTED]: 'Rechazada',
};