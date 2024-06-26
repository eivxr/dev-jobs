const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController.js");
const vacantesController = require("../controllers/vacantesController.js");
const usuarioController = require("../controllers/usuarioController.js")

module.exports = () => {
  router.get("/", homeController.mostrarTrabajos);

  //formulario de nuevas vacantes
  router.get("/vacantes/nueva", vacantesController.formularioNuevaVacante);
  router.post("/vacantes/nueva", vacantesController.agregarVacante);

  //mostrar una vacante
  router.get("/vacantes/:url", vacantesController.mostrarVacante);
  //editar una vacante
  router.get("/vacantes/editar/:url", vacantesController.formEditarVacante);
  router.post("/vacantes/editar/:url", vacantesController.editarVacante);

  //formulario de sign in
  router.get('/crear-cuenta', usuarioController.formCrearCuenta)
  router.post('/crear-cuenta', usuarioController.crearUsuario)

  return router;
};
