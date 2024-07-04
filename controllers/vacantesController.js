//modelos
const Vacante = require("../models/Vacantes.js");
const multer = require("multer");
const shortid = require("shortid");

exports.formularioNuevaVacante = (req, res) => {
  res.render("nueva-vacante", {
    nombrePagina: "Nueva vacante",
    tagline: "Llena el formulario para publicar una nueva vacante",
    nombre: req.user.nombre,
    cerrarSesion: true,
    imagen: req.user.imagen,
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
  const vacante = await Vacante.findOne({ url: req.params.url }).populate(
    "autor"
  );
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
    imagen: req.user.imagen,
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

//acciones en la vista de vacante
exports.subirCV = (req, res, next) => {
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
      res.redirect("back");
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
      cb(null, __dirname + "../../public/uploads/cv");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Formato de archivo no válido"), false);
    }
  },
};

const upload = multer(configuracionMulter).single("cv");

exports.contactarReclutador = async (req, res, next) => {
  //almacenamos los candidatos en la base de datos
  const vacante = await Vacante.findOne({ url: req.params.url });

  //verificamos que la vacante exista
  if (!vacante) return next();

  //creamos el nuevo candidato
  const nuevoCandidato = {
    nombre: req.body.nombre,
    email: req.body.correo,
    cv: req.file.filename,
  };

  //almacenamos el candidato dentro de la bd (candidatos es un array con atributos)
  vacante.candidatos.push(nuevoCandidato);
  await vacante.save();

  req.flash("correcto", "Te has postulado con éxito");
  res.redirect("/");
};

exports.mostrarCandidatos = async (req, res, next) => {
  const vacante = await Vacante.findById(req.params.id);

  if (vacante.autor != req.user._id.toString()) {
    return next();
  }

  if (!vacante) {
    return next();
  }

  res.render("candidatos", {
    nombrePagina: `Candidatos para ${vacante.titulo}`,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
    cerrarSesion: true,
    candidatos: vacante.candidatos,
  });
};

exports.buscarVacantes = async (req, res) => {
  
  const vacantes = await Vacante.find({
    $text:{
      $search: req.body.q
    }
  }).lean();

  res.render('home',{
    nombrePagina: `Resultados para la búsqueda "${req.body.q}"`,
    vacantes,
    barra: true
  })
};
