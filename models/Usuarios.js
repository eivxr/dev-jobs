const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  token: String,
  expira: Date,
  imagen: String
});

//hasheo de contrasenas en mongoose

usuarioSchema.pre("save", async function (next) {
  //anterior a guardar en la bd
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

usuarioSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next("Ese usuario ya ha sido registrado");
  } else {
    next(error);
  }
});

//autenticacion de usuarios

usuarioSchema.methods = {
  compararPassword: function (password) {
    return bcrypt.compareSync(password, this.password);
  },
};

module.exports = mongoose.model("Usuarios", usuarioSchema);
