const Vacante = require("../models/Vacantes.js");

exports.mostrarTrabajos = async (req, res, next) => {
  try {
    const vacantes = await Vacante.find();

    if (!vacantes) return next();

    res.render("home", {
      nombrePagina: "devJobs",
      tagline: "Encuentra tu trabajo ideal como desarrollador con devJobs",
      barra: true,
      boton: true,
      vacantes,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
