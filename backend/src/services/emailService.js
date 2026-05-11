const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const emailService = {
  // Enviar email de bienvenida
  sendWelcome: async (to, name) => {
    try {
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
