const mongoose = require("mongoose");

require("./config/db");

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const passport = require("./config/passport.js");
const createError = require("http-errors");

require("dotenv").config({ path: "variables.env" });
const app = express();

// Habilitar body parser para la lectura de campos en formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar handlebars como template engine
const helpers = require("./helpers/handlebars.js");

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    helpers: helpers,
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

app.set("view engine", "handlebars");

// Archivos estáticos (hojas de estilo, JavaScript, imágenes, etc.)
app.use(express.static(path.join(__dirname, "public")));

//validacion de campos
app.use(expressValidator());

// DB session
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE,
      mongooseConnection: mongoose.connection,
    }),
  })
);

//inicializacion de passport para inicios  de sesion
app.use(passport.initialize());
app.use(passport.session());

//alertas y mensajes de tipo flash y creacion del middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.mensajes = req.flash();
  next();
});

app.use("/", router());

//manejo de errores http 404
app.use((req, res, next) => {
  next(createError(404, "No encontrado"));
});

app.use((error, req, res, next) => {
  res.locals.mensaje = error.message;
  const status = error.status || 500;
  res.locals.status = status;
  res.status(status);

  res.render("error");
});

app.listen(process.env.PUERTO, () => {
  console.log("Servidor iniciado en http://localhost:5001");
});
