const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");

//mostrar formmulario de sign in
exports.formCrearCuenta = (req, res, next) => {
  res.render("crear-cuenta", {
    nombrePagina: "Crear cuenta en devJobs",
    tagline: "Para publicar y acceder a vacantes, solo debes crear tu cuenta.",
  });
};

//creacion de usuarios en bd
exports.validarRegistro = (req, res, next) => {
  //sanitizacion para guardado seguro en bd

  req.sanitizeBody("nombre").escape();
  req.sanitizeBody("email").escape();
  req.sanitizeBody("password").escape();
  req.sanitizeBody("confirmar").escape();

  //validar campos del formulario
  req.checkBody("nombre", "El nombre es obligatorio").notEmpty();
  req.checkBody("email", "Debe introducir un correo válido").isEmail();
  req.checkBody("password", "Password es un campo obligatorio").notEmpty();
  req.checkBody("confirmar", "Confirme su password").notEmpty();
  req
    .checkBody("confirmar", "Los password no coinciden")
    .equals(req.body.password);

  const errores = req.validationErrors();
  console.log(errores);

  if (errores) {
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );
    res.render("crear-cuenta", {
      nombrePagina: "Crear cuenta en devJobs",
      tagline:
        "Para publicar y acceder a vacantes, solo debes crear tu cuenta.",
      mensajes: req.flash(),
    });

    return;
  }
  //se aprueba la validacion
  next();

  return;
};

exports.crearUsuario = async (req, res, next) => {
  const usuario = new Usuario(req.body);

  try {
    await usuario.save();
    res.redirect("/iniciar-sesion");
  } catch (error) {
    req.flash("error", error);
    res.redirect("/crear-cuenta");
  }
};
