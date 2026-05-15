let Resend;
try {
  Resend = require('resend').Resend;
} catch (e) {
  console.warn('⚠️ Paquete resend no disponible - emails desactivados');
}

// Solo inicializar Resend si la API key está configurada
let resend = null;
if (Resend && process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

const emailService = {
  // Enviar email de bienvenida
  sendWelcome: async (to, name) => {
    try {
      if (!resend) {
        console.log('Email service no configurado - omitiendo envío de email');
        return;
      }
      await resend.emails.send({
        from: 'Laboria <onboarding@resend.dev>',
        to,
        subject: '¡Bienvenido a Laboria!',
        html: `
          <h1>¡Hola ${name}!</h1>
          <p>Gracias por registrarte en Laboria. Tu plataforma de empleo y cursos.</p>
          <p>Empieza a explorar oportunidades hoy mismo.</p>
        `
      });
    } catch (error) {
      console.error('Error enviando email:', error);
    }
  },

  // Notificar cuando aplican a empleo
  sendApplicationReceived: async (to, jobTitle, applicantName) => {
    try {
      if (!resend) {
        console.log('Email service no configurado - omitiendo envío de notificación');
        return;
      }
      await resend.emails.send({
        from: 'Laboria <notifications@resend.dev>',
        to,
        subject: `Nueva aplicación para: ${jobTitle}`,
        html: `
          <h1>Nueva Aplicación</h1>
          <p><strong>${applicantName}</strong> ha aplicado a tu oferta: <strong>${jobTitle}</strong></p>
          <p>Revisa tu panel de control para más detalles.</p>
        `
      });
    } catch (error) {
      console.error('Error enviando notificación:', error);
    }
  }
};

module.exports = emailService;
