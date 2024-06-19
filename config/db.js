
const moongose = require('mongoose');
require('dotenv').config({path:'variables.env'});

moongose.connect(process.env.DATABASE, {useNewUrlParser: true});

moongose.connection.on('error', error => console.log(error));

require('../models/Vacantes')