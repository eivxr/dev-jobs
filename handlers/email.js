const emailConfig = require("../config/email.js");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});
