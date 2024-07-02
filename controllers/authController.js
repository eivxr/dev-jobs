const passport = require("passport");
const mongoose = require("mongoose");
const Vacante = mongoose.model("Vacantes");

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
