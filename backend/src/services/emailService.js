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
  },

  sendPasswordReset: async (to, name, resetUrl) => {
    try {
      if (!resend) {
        console.log('Email service no configurado - omitiendo envío de reset');
        return;
      }
      await resend.emails.send({
        from: 'Laboria <onboarding@resend.dev>',
        to,
        subject: 'Recupera tu contraseña en Laboria',
        html: `
          <h1>Hola ${name}</h1>
          <p>Recibimos una solicitud para restablecer tu contraseña en Laboria.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#d4af37;color:#000;text-decoration:none;border-radius:6px;font-weight:bold;">Restablecer contraseña</a></p>
          <p>Este enlace expira en 1 hora.</p>
          <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        `
      });
    } catch (error) {
      console.error('Error enviando email de reset:', error);
    }
  }
};

module.exports = emailService;
