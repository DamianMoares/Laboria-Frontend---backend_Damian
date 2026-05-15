const prisma = require('../src/config/database');
const bcrypt = require('bcryptjs');

const seedDemoUsers = async () => {
  
  try {
    console.log('🌱 Creando usuarios de demostración...');
    
    // Usuarios de demostración
    const demoUsers = [
      {
        email: 'admin@laboria.com',
        password: 'admin123',
        name: 'Administrador Laboria',
        role: 'ADMIN'
      },
      {
        email: 'candidate@laboria.com',
        password: 'candidate123',
        name: 'Juan Pérez',
        role: 'CANDIDATE'
      },
      {
        email: 'company@laboria.com',
        password: 'company123',
        name: 'Tech Solutions S.A.',
        role: 'COMPANY_EMPLOYEES'
      },
      {
        email: 'recruiter@laboria.com',
        password: 'recruiter123',
        name: 'María González',
        role: 'COMPANY_STUDENTS'
      },
      {
        email: 'hybrid@laboria.com',
        password: 'hybrid123',
        name: 'Carlos Rodríguez',
        role: 'COMPANY_HYBRID'
      }
    ];
    
    // Crear o actualizar usuarios de demostración (no elimina existentes)
    for (const user of demoUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          role: user.role
        },
        create: {
          email: user.email,
          password: hashedPassword,
          name: user.name,
          role: user.role
        }
      });
      
      console.log(`✅ Usuario asegurado: ${user.email} (${user.role})`);
    }
    
    console.log('\n🎉 Usuarios de demostración creados exitosamente!');
    console.log('\n📋 CREDENCIALES DE DEMO:');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│ EMAIL                  │ CONTRASEÑA     │ ROL                │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log('│ admin@laboria.com      │ admin123       │ ADMIN              │');
    console.log('│ candidate@laboria.com  │ candidate123   │ CANDIDATE          │');
    console.log('│ company@laboria.com    │ company123     │ COMPANY_EMPLOYEES  │');
    console.log('│ recruiter@laboria.com  │ recruiter123   │ COMPANY_STUDENTS   │');
    console.log('│ hybrid@laboria.com     │ hybrid123      │ COMPANY_HYBRID     │');
    console.log('└─────────────────────────────────────────────────────┘');
    
  } catch (error) {
    console.error('❌ Error creando usuarios de demostración:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seedDemoUsers();
