const mongoose = require("mongoose");

require("./config/db");

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("dotenv").config({ path: "variables.env" });
const app = express();

// Habilitar handlebars como template engine
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" , helpers: require('./helpers/handlebars.js')}));

app.set("view engine", "handlebars");

// Archivos estáticos (hojas de estilo, JavaScript, imágenes, etc.)
app.use(express.static(path.join(__dirname, "public")));

//DB session
app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
      mongoUrl: process.env.DATABASE, 
      mongooseConnection: mongoose.connection,
    }),
  })
);

app.use("/", router());

app.listen(process.env.PUERTO, () => {
  console.log("Servidor iniciado en http://localhost:5000");
});
