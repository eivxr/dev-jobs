exports.mostrarTrabajos = (req, res) => {
  res.render("home", {
    nombrePagina: "devJobs",
    tagline: "Encuentra tu trabajo ideal como desarrollador con devJobs",
    barra: true,
    boton: true,
  });
};
