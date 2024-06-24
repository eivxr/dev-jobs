module.exports = {
  json: function (context) {
    return JSON.stringify(context, null, 2);
  },
  seleccionarSkills: (seleccionadas = [], opciones) => {
    const skills = [
      "HTML5",
      "CSS3",
      "CSSGrid",
      "Flexbox",
      "JavaScript",
      "jQuery",
      "Node",
      "Angular",
      "VueJS",
      "ReactJS",
      "React Hooks",
      "Redux",
      "Apollo",
      "GraphQL",
      "TypeScript",
      "PHP",
      "Laravel",
      "Symfony",
      "Python",
      "Django",
      "ORM",
      "Sequelize",
      "Mongoose",
      "SQL",
      "MVC",
      "SASS",
      "WordPress",
    ];

    let html = "";
    skills.forEach((skill) => {
      html += `<li ${
        seleccionadas.includes(skill) ? 'class="activo"' : ""
      }>${skill}</li>`;
    });

    return (opciones.fn().html = html);
  },

  tipoContrato: (seleccionado, opciones) => {
    console.log(seleccionado);

    return opciones.fn(this).replace(
      new RegExp(`valu  e="${seleccionado}"`), '$& selected="selected"'
    )
  },
};
