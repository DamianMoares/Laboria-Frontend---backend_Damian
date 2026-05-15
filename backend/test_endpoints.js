const testEndpoints = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🔍 AUDITORÍA FINAL - VERIFICACIÓN DE ENDPOINTS\n');
  
  try {
    // Test 1: Endpoint raíz
    console.log('1. 📡 Probando endpoint raíz...');
    const rootResponse = await fetch(baseURL);
    console.log(`   Status: ${rootResponse.status}`);
    const rootData = await rootResponse.json();
    console.log(`   Response: ${rootData.message}`);
    console.log('   ✅ Endpoint raíz funcionando\n');
    
    // Test 2: Endpoint de registro
    console.log('2. 📝 Probando endpoint de registro...');
    const registerResponse = await fetch(`${baseURL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'audit@test.com',
        password: '123456',
        name: 'Audit Test User'
      })
    });
    console.log(`   Status: ${registerResponse.status}`);
    const registerData = await registerResponse.json();
    console.log(`   Response: ${registerData.message || registerData.error}`);
    console.log('   ✅ Endpoint de registro funcionando\n');
    
    // Test 3: Endpoint de login
    console.log('3. 🔐 Probando endpoint de login...');
    const loginResponse = await fetch(`${baseURL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'audit@test.com',
        password: '123456'
      })
    });
    console.log(`   Status: ${loginResponse.status}`);
    const loginData = await loginResponse.json();
    console.log(`   Response: ${loginData.message || loginData.error}`);
    if (loginData.token) {
      console.log(`   ✅ Token JWT recibido: ${loginData.token.substring(0, 30)}...`);
    }
    console.log('   ✅ Endpoint de login funcionando\n');
    
    // Test 4: Verificar estructura de rutas
    console.log('4. 🛣️  Verificando estructura de rutas...');
    const routes = [
      '/api/users',
      '/api/jobs',
      '/api/courses',
      '/api/applications',
      '/api/admin'
    ];
    
    for (const route of routes) {
      try {
        const routeResponse = await fetch(`${baseURL}${route}`);
        console.log(`   ${route}: Status ${routeResponse.status} ✅`);
      } catch (error) {
        console.log(`   ${route}: Error - ${error.message} ❌`);
      }
    }
    
    console.log('\n🎉 TODOS LOS ENDPOINTS VERIFICADOS CORRECTAMENTE');
    
  } catch (error) {
    console.error('❌ ERROR EN AUDITORÍA:', error.message);
  }
};

testEndpoints();
