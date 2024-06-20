//modelos
const Vacante = require("../models/Vacantes.js");

exports.formularioNuevaVacante = (req, res) => {
  res.render("nueva-vacante", {
    nombrePagina: "Nueva vacante",
    tagline: "Llena el formulario para publicar una nueva vacante",
  });
};

exports.agregarVacante = async (req, res) => {
  const vacante = new Vacante(req.body);
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
    nombrePagina: vacante.titulo
  });
};
