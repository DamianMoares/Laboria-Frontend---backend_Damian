const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@laboria.com' },
    update: {},
    create: {
      email: 'admin@laboria.com',
      password: hashedPassword,
      name: 'Admin Laboria',
      role: 'ADMIN'
    }
  });
  
  console.log('✅ Seed completado - Admin creado');
  console.log('📧 Email: admin@laboria.com');
  console.log('🔑 Password: admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
