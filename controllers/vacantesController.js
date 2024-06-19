
exports.formularioNuevaVacante = (req,res) => {
    res.render('nueva-vacante',{
        nombrePagina:'Nueva vacante',
        tagline: 'Llena el formulario para publicar una nueva vacante'
    })
}