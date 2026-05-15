const testDemoUsers = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🔍 VERIFICANDO USUARIOS DE DEMOSTRACIÓN\n');
  
  // Credenciales de demostración
  const demoUsers = [
    {
      email: 'admin@laboria.com',
      password: 'admin123',
      role: 'ADMIN'
    },
    {
      email: 'candidate@laboria.com',
      password: 'candidate123',
      role: 'CANDIDATE'
    },
    {
      email: 'company@laboria.com',
      password: 'company123',
      role: 'COMPANY_EMPLOYEES'
    },
    {
      email: 'recruiter@laboria.com',
      password: 'recruiter123',
      role: 'COMPANY_STUDENTS'
    },
    {
      email: 'hybrid@laboria.com',
      password: 'hybrid123',
      role: 'COMPANY_HYBRID'
    }
  ];
  
  console.log('📋 Probando login con usuarios de demostración...\n');
  
  for (const user of demoUsers) {
    try {
      const response = await fetch(`${baseURL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        })
      });
      
      const data = await response.json();
      
      console.log(`👤 ${user.email}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Rol: ${user.role}`);
      
      if (response.status === 200) {
        console.log(`   ✅ Login exitoso`);
        console.log(`   🎫 Token: ${data.token ? data.token.substring(0, 30) + '...' : 'No recibido'}`);
        console.log(`   👋 Usuario: ${data.user?.name || 'No disponible'}`);
      } else {
        console.log(`   ❌ Error: ${data.error || 'Error desconocido'}`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`❌ Error probando ${user.email}: ${error.message}\n`);
    }
  }
  
  console.log('🎉 VERIFICACIÓN DE USUARIOS DEMO COMPLETADA');
  console.log('\n📋 RESUMEN DE CREDENCIALES:');
  console.log('┌─────────────────────────────────────────────────┐');
  console.log('│ EMAIL                    │ CONTRASEÑA    │ ROL       │');
  console.log('├─────────────────────────────────────────────────┤');
  console.log('│ admin@laboria.com       │ admin123      │ ADMIN     │');
  console.log('│ candidate@laboria.com    │ candidate123  │ CANDIDATE │');
  console.log('│ company@laboria.com     │ company123    │ COMPANY   │');
  console.log('│ recruiter@laboria.com   │ recruiter123  │ RECRUITER │');
  console.log('│ hybrid@laboria.com      │ hybrid123     │ HYBRID    │');
  console.log('└─────────────────────────────────────────────────┘');
};

testDemoUsers();
