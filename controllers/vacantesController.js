//modelos
const mongoose = require("mongoose");
const Vacante = mongoose.model("Vacante");

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
    res.redirect(`/vacantes/${nuevaVacante.url}`)
};
