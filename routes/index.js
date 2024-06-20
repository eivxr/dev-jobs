const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController.js");
const vacantesController = require('../controllers/vacantesController.js')

module.exports = () => {
  router.get("/", homeController.mostrarTrabajos);

  //formulario de nuevas vacantes
  router.get("/vacantes/nueva", vacantesController.formularioNuevaVacante);
  router.post('/vacantes/nueva', vacantesController.agregarVacante)

  return router;
};
