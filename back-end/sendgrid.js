require('dotenv').config(); // Importa le variabili d'ambiente

const sgMail = require('@sendgrid/mail');

// Imposta la tua chiave API da .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Funzione per inviare una mail
const sendRegistrationEmail = (toEmail, userName) => {
  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_SENDER_EMAIL, // Il mittente verificato
    subject: 'Benvenuto su Strive Blog!',
    text: `Ciao ${userName}, grazie per esserti registrato su Strive Blog!`,
    html: `<strong>Ciao ${userName}</strong>,<br>Grazie per esserti registrato su <em>Strive Blog</em>!`,
  };

  sgMail
    .send(msg)
    .then(() => console.log('Email inviata'))
    .catch((error) => console.error('Errore invio email:', error));
};

module.exports = { sendRegistrationEmail };
