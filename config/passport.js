const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return done(null, false, {
          message: "Usuario no existente",
        });
      }

      //si el usuario fue encontrado verificamos su contrasena
      const verficarPass = usuario.compararPassword(password);
      if (!verficarPass)
        return done(null, false, {
          message: "Contraseña incorrecta",
        });

      // si el usuario existe y su contrasena es correcta
      return done(null, usuario); //podemos unterpretar a done como una especie de next() que skippea al siguiente middleware done(mensaje,retorno,{opciones})
    }
  )
);

passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {
  const user = await Usuario.findById(id).exec();
  return done(null, user);
});

module.exports = passport;
