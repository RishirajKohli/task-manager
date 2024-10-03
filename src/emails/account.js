const sgMail = require("@sendgrid/mail");

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ENABLE_SENDING_EMAIL = process.env.ENABLE_SENDING_EMAIL_ || false;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  if (!ENABLE_SENDING_EMAIL) return null;
  sgMail.send({
    to: email,
    from: "kohli.rishiraj@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancelationEmail = (email, name) => {
  if (!ENABLE_SENDING_EMAIL) return null;

  sgMail.send({
    to: email,
    from: "kohli.rishiraj@gmail.com",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
