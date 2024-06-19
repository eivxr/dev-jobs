const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');


const vacantesScheme = new mongoose.Schema({
    titulo:{
        type: String,
        required: 'El título es obligatorio',
        trim: true
    },
    empresa:{
        type: String,
        trim: true
    },
    ubicacion:{
        type: String,
        required: 'La ubicación es obligatoria',
        trim: true
    },
    salario:{
        type: String,
        default: 0 ,
        trim: true
    },
    descripcion:{
        type: String,
        trim: true
    },
    url:{
        type: String,
        lowercase: true
    },
    skills: [String],
    candiadatos:[{
        nombre: String,
        email: String,
        cv: String
    }]
    
})

vacantesScheme.pre('save', next => {
    const url = slug(this.titulo);
    this.url = `${url}-${shortid.generate()}`

    next();
})

module.exports = mongoose.model('Vacante', vacantesScheme);