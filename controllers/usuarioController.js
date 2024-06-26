const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");

exports.formCrearCuenta = (req, res, next) => {
  res.render("crear-cuenta", {
    nombrePagina: "Crear cuenta en devJobs",
    tagline: "Para publicar y acceder a vacantes, solo debes crear tu cuenta.",
  });
};

exports.crearUsuario = async (req, res, next) => {
  const usuario = new Usuario(req.body);

  const nuevoUsuario = await usuario.save();

  if (!nuevoUsuario) {
    return next();
  }

  res.redirect("/iniciar-sesion");
};
