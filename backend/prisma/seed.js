const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const demoAccounts = [
    { email: 'admin@laboria.com', password: 'admin123', name: 'Admin Laboria', role: 'ADMIN' },
    { email: 'candidate@laboria.com', password: 'candidate123', name: 'Carlos García', role: 'CANDIDATE' },
    { email: 'company@laboria.com', password: 'company123', name: 'TechCorp Solutions', role: 'COMPANY_EMPLOYEES' },
    { email: 'recruiter@laboria.com', password: 'recruiter123', name: 'EduNext Academy', role: 'COMPANY_STUDENTS' },
    { email: 'hybrid@laboria.com', password: 'hybrid123', name: 'InnovaGroup', role: 'COMPANY_HYBRID' },
  ];

  for (const acc of demoAccounts) {
    const hashed = await bcrypt.hash(acc.password, 10);
    await prisma.user.upsert({
      where: { email: acc.email },
      update: {},
      create: {
        email: acc.email,
        password: hashed,
        name: acc.name,
        role: acc.role,
      },
    });
  }

  console.log('✅ Seed completado');
  demoAccounts.forEach(a => console.log(`   ${a.email} / ${a.password} → ${a.name} (${a.role})`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
