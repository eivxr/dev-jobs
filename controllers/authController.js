const passport = require("passport");
const mongoose = require("mongoose");
const crypto = require("crypto");

const enviarEmail = require("../handlers/email.js");

//models
const Vacante = mongoose.model("Vacantes");
const Usuario = mongoose.model("Usuarios");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/administracion",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios",
});

//ver si el usuario tiene autorizacion y esta autenticado
exports.verificarUsuario = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/iniciar-sesion");
};

exports.mostrarPanel = async (req, res) => {
  //consultamos el usuario en la bd
  const vacantes = await Vacante.find({ autor: req.user._id });

  res.render("administracion", {
    tagline: "Crea y administra tus vacantes",
    nombrePagina: "Panel de administracion",
    vacantes,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
    cerrarSesion: true,
  });
};

exports.formReestablecerPassword = (req, res, next) => {
  res.render("reestablecer-password", {
    nombrePagina: "Reestablece tu contraseña",
    tagline:
      "Enviaremos un correo a la dirección que proporciones para que recuperes el acceso a tu cuenta",
  });
};

exports.enviarToken = async (req, res, next) => {
  const usuario = await Usuario.findOne({ email: req.body.email });

  //verificamos que el usuario con ese correo exista en la bd
  if (!usuario) {
    req.flash("error", "Esta cuenta no existe");
    return res.redirect("/iniciar-sesion");
  }

  usuario.token = crypto.randomBytes(20).toString("hex"); //generamos el token para el usuario
  usuario.expira = Date.now() + 3600000; //configuramos el tiempo de expiracion para el token

  //actualizamos el usuario en bd y generamos la url
  await usuario.save();
  const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

  //notificacion por medio de email
  await enviarEmail.enviar({
    usuario,
    subject: "Reestablecer contraseña",
    resetUrl,
    archivo: "reset",
  });

  req.flash("correcto", "Revisa la bandeja de entrada en tu correo");
  res.redirect("/iniciar-sesion");
};

//valida si el usuario existe y reestablece su password en bd
exports.reestablecerPassword = async (req, res, next) => {
  const usuario = await Usuario.findOne({
    token: req.params.token,
    expira: {
      $gt: Date.now(),
    },
  });

  if (!usuario) {
    req.flash("error", "Petición inválida, reenvíe el correo");
    res.redirect("/reestablecer-password");
  }

  res.render("nuevo-password", {
    nombrePagina: "Reestablezca su contraseña",
  });
};

//almacenar nuevo password

exports.guardarNuevoPassword = async (req, res) => {
  const usuario = await Usuario.findOne({
    token: req.params.token,
    expira: {
      $gt: Date.now(),
    },
  });

  if (!usuario) {
    req.flash("error", "Petición inválida, reenvíe el correo");
    res.redirect("/reestablecer-password");
  }

  //asignamos el nuevo password y limpiamos valores de token y expira
  usuario.password = req.body.password;
  usuario.expira = undefined;
  usuario.token = undefined;

  //guardamos camvbios en la bd
  await usuario.save();

  //redirigimos
  req.flash('correcto','Contraseña reestablecida correctamente');
  res.redirect('/iniciar-sesion')
};
