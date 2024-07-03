const emailConfig = require("../config/email.js");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const util = require("util");

let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

//usar plantillas de handlebars
transport.use('compile',hbs({
    viewEngine: {
       extname: 'handlebars',
       defaultLayout: false,
    },
    viewPath: __dirname+'/../views/emails',
    extName: '.handlebars',
}));

exports.enviar = (opciones) => {
  const opcionesEmail = {
    from: "devjobs <noreply@debjobs.com",
    to: opciones.usuario.email,
    subject: opciones.subject,
    template: opciones.archivo,
    context: {
      resetUrl: opciones.resetUrl,
    },
  };

  const sendMail = util.promisify(transport.sendMail, transport);
  return sendMail.call(transport, opcionesEmail);
};
