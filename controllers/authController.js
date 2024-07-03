const passport = require("passport");
const mongoose = require("mongoose");
const crypto = require("crypto");

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

  usuario.token = crypto.randomBytes(20).toString('hex'); //generamos el token para el usuario 
  usuario.expira = Date.now() + 3600000; //configuramos el tiempo de expiracion para el token

  //actualizamos el usuario en bd y generamos la url
  await usuario.save()
  const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

  req.flash('correcto', 'Revisa la bandeja de entrada en tu correo');
  res.redirect('/iniciar-sesion');

  

};
