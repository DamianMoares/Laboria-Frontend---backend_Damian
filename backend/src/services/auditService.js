const prisma = require('../config/database');

const logAction = async ({ action, entity, entityId, details, adminId, adminName }) => {
  return prisma.auditLog.create({
    data: { action, entity, entityId, details, adminId, adminName }
  });
};

module.exports = { logAction };