const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController.js");
const vacantesController = require("../controllers/vacantesController.js");
const usuarioController = require("../controllers/usuarioController.js");
const authController = require("../controllers/authController.js");

module.exports = () => {
  router.get("/", homeController.mostrarTrabajos);

  //formulario de nuevas vacantes
  router.get(
    "/vacantes/nueva",
    authController.verificarUsuario,
    vacantesController.formularioNuevaVacante
  );
  router.post(
    "/vacantes/nueva",
    authController.verificarUsuario,
    vacantesController.validarVacante,
    vacantesController.agregarVacante
  );

  //mostrar una vacante
  router.get("/vacantes/:url", vacantesController.mostrarVacante);
  //editar una vacante
  router.get(
    "/vacantes/editar/:url",
    authController.verificarUsuario,
    vacantesController.formEditarVacante
  );
  router.post(
    "/vacantes/editar/:url",
    authController.verificarUsuario,
    vacantesController.validarVacante,
    vacantesController.editarVacante
  );

  //borrar una vacante
  router.delete('/vacantes/eliminar/:id', vacantesController.eliminarVacante)

  //formulario de sign up
  router.get("/crear-cuenta", usuarioController.formCrearCuenta);
  router.post(
    "/crear-cuenta",
    usuarioController.validarRegistro,
    usuarioController.crearUsuario
  );

  //formulario de sign in
  router.get("/iniciar-sesion", usuarioController.formIniciarSesion);
  router.post("/iniciar-sesion", authController.autenticarUsuario);

  //panel de administracion
  router.get(
    "/administracion",
    authController.verificarUsuario,
    authController.mostrarPanel
  );

  //editar informacion del usuario (perfil)
  router.get(
    "/editar-perfil",
    authController.verificarUsuario,
    usuarioController.formEditarPerfilUsuario
  );

  return router;
};

router.post(
  "/editar-perfil",
  authController.verificarUsuario,
  usuarioController.validarEditarPerfil,
  usuarioController.editarPerfil
);

//cerrar sesion
router.get('/cerrar-sesion', authController.verificarUsuario, usuarioController.cerrarSesionUsuario)