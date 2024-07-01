//modelos
const Vacante = require("../models/Vacantes.js");

exports.formularioNuevaVacante = (req, res) => {
  res.render("nueva-vacante", {
    nombrePagina: "Nueva vacante",
    tagline: "Llena el formulario para publicar una nueva vacante",
    nombre: req.user.nombre,
    cerrarSesion: true,
  });
};

exports.agregarVacante = async (req, res) => {
  const vacante = new Vacante(req.body);

  vacante.autor = req.user._id;

  vacante.skills = req.body.skills.split(","); //creamos un arreglo usando el objeto de skills

  //almacenamos en la base de datos
  const nuevaVacante = await vacante.save();

  //redireccion
  res.redirect(`/vacantes/${nuevaVacante.url}`);
};

exports.mostrarVacante = async (req, res, next) => {
  const vacante = await Vacante.findOne({ url: req.params.url });

  if (!vacante) return next();

  res.render("vacante", {
    vacante,
    barra: true,
    nombrePagina: vacante.titulo,
  });
};

exports.formEditarVacante = async (req, res, next) => {
  const vacante = await Vacante.findOne({ url: req.params.url });

  if (!vacante) return next();

  res.render("editar-vacante", {
    nombrePagina: `Editar - ${vacante.titulo}`,
    vacante,
    nombre: req.user.nombre,
    cerrarSesion: true,
  });
};

exports.editarVacante = async (req, res) => {
  const vacanteActualizada = req.body;
  vacanteActualizada.skills = req.body.skills.split(",");

  //actualizacion de la vacante en la base de datos
  const vacante = await Vacante.findOneAndUpdate(
    { url: req.params.url }, //encontramos la vacante
    vacanteActualizada, // el objeto por el que vamos a actualizar
    {
      //configuracion para la actualizacion
      new: true,
      runValidators: true,
    }
  );

  res.redirect(`/vacantes/${vacante.url}`);
};

exports.eliminarVacante = async (req, res) => {
  const { id } = req.params;

  const vacante = await Vacante.findById(id);

  if (verificarAutor(vacante, req.user)) {
    await Vacante.findByIdAndDelete(id);
    res.status(200).send("Vacante eliminada correctamente");
  } else {
    res.status(403).send("Error");
  }
};

const verificarAutor = (vacante = {}, usuario = {}) => {
  if (!usuario._id.equals(vacante.autor)) {
    return false;
  }
  return true;
};

//validacion y sanitizacion des los campos en vacantes
exports.validarVacante = (req, res, next) => {
  // sanitizacion de los campos enviados en el request
  req.sanitizeBody("titulo").escape();
  req.sanitizeBody("empresa").escape();
  req.sanitizeBody("ubicacion").escape();
  req.sanitizeBody("salario").escape();
  req.sanitizeBody("contrato").escape();
  req.sanitizeBody("skills").escape();

  req.checkBody("nombre", "Agregue un titulo a la vacante").notEmpty();
  req.checkBody("empresa", "Agregue un nombre de empresa").notEmpty();
  req.checkBody("ubicacion", "Agregue una ubicación").notEmpty();
  req.checkBody("contrato", "Seleccione el tipo de contrato").notEmpty();
  req.checkBody("skills", "Elija al menos una habilidad").notEmpty();

  const errores = req.validationErrors();

  if (errores) {
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );

    res.render("nueva-vacante", {
      nombrePagina: "Nueva vacante",
      tagline: "Llena el formulario para publicar una nueva vacante",
      nombre: req.user.nombre,
      cerrarSesion: true,
      mensajes: req.flash(),
    });

    return;
  }

  next();
};
