document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelector(".lista-conocimientos");

  if (skills) {
    skills.addEventListener("click", agregarSkills);

    //llamar a la funcion en editar vacante
    skillsSeleccionados();
  }
});

const skills = new Set(); //set constructor of a new object/array

const agregarSkills = (e) => {
  if (e.target.tagName === "LI") {
    if (e.target.classList.contains("activo")) {
      //quita del set y lo desmarca(quita una clase "activo")
      skills.delete(e.target.textContent);
      e.target.classList.remove("activo");
      console.log(skills);
    } else {
      //lo contrario lol
      skills.add(e.target.textContent);
      e.target.classList.add("activo");
      console.log(skills);
    }
  }
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
};

const skillsSeleccionados = () => {
  // recuperamos la lista de habilidades del html
  const seleccionados = Array.from(
    document.querySelectorAll(".lista-conocimientos .activo")
  );

  seleccionados.forEach((seleccionada) => skills.add(seleccionada.textContent));
  //inyeccion de contenido en el input hidden
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
};
