const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");
const multer = require("multer");
const shortid = require("shortid");

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

//iniciar sesion y autenticacion

exports.formIniciarSesion = (req, res, next) => {
  res.render("iniciar-sesion", {
    nombrePagina: "Inicia sesión en devJobs",
  });
};

//perfil del usuario
exports.formEditarPerfilUsuario = (req, res) => {
  res.render("editar-perfil", {
    nombrePagina: "Edita tu perfil dentro de devJobs",
    usuario: req.user,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
    cerrarSesion: true,
  });
};

exports.subirImagen = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "El archivo es muy grande: Máximo 100kb ");
        } else {
          req.flash("error", error.message);
        }
      } else {
        req.flash("error", error.message);
      }
      res.redirect("/administracion");
      return;
    } else {
      return next();
    }
  });
};
const configuracionMulter = {
  limits: { fileSize: 100000 },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + "../../public/uploads/perfiles");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Formato de archivo no válido"), false);
    }
  },
};

const upload = multer(configuracionMulter).single("imagen");

exports.editarPerfil = async (req, res) => {
  const usuario = await Usuario.findById(req.user._id);

  usuario.nombre = req.body.nombre;
  usuario.correo = req.body.correo;
  if (req.body.password) {
    usuario.password = req.body.password;
  }

  if (req.file) {
    usuario.imagen = req.file.filename;
  }
  await usuario.save();

  req.flash("correcto", "Cambios guardados correctamente");

  res.redirect("/administracion");
};

exports.cerrarSesionUsuario = (req, res, next) => {
  req.logout(function (error) {
    if (error) {
      return next(error);
    }
    req.flash("correcto", "sesión cerrada correctamente");
    return res.redirect("/iniciar-sesion");
  });
};

exports.validarEditarPerfil = (req, res) => {
  //sanitizar campos
  req.sanitizeBody("nombre").escape();
  req.sanitizeBody("nombre").escape();
  if (req.body.password) {
    req.sanitizeBody("password").escape();
  }

  req.checkBody("nombre", "Nombre no puede ir vacío").notEmpty();
  req.checkBody("password", "Contraseña es un campo obligatorio").notEmpty();

  const errores = req.validationErrors();

  if (errores) {
    res.render("editar-perfil", {
      nombrePagina: "Edita tu perfil dentro de devJobs",
      usuario: req.user,
      nombre: req.user.nombre,
      imagen: req.user.imagen,
      cerrarSesion: true,
      mensajes: req.flash(),
    });

    return;
  }

  next();
};
