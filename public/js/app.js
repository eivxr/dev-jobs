const { default: axios } = require("axios");
const Swal = require("sweetalert2");

document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelector(".lista-conocimientos");
  const alertas = document.querySelector(".alertas");

  // Limpiar alertas del formulario crear cuenta
  if (alertas) {
    limpiarAlertas();
  }

  if (skills) {
    skills.addEventListener("click", agregarSkills);

    // Llamar a la función en editar vacante
    skillsSeleccionados();
  }

  const vacantesListado = document.querySelector(".lista-vacantes");

  if (vacantesListado) {
    vacantesListado.addEventListener("click", accionesListado);
  }
});

const skills = new Set();

const agregarSkills = (e) => {
  if (e.target.tagName === "LI") {
    if (e.target.classList.contains("activo")) {
      // Quita del set y lo desmarca (quita una clase "activo")
      skills.delete(e.target.textContent);
      e.target.classList.remove("activo");
    } else {
      // Lo contrario
      skills.add(e.target.textContent);
      e.target.classList.add("activo");
    }
  }
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
};

const skillsSeleccionados = () => {
  // Recuperamos la lista de habilidades del HTML
  const seleccionados = Array.from(
    document.querySelectorAll(".lista-conocimientos .activo")
  );

  seleccionados.forEach((seleccionada) => skills.add(seleccionada.textContent));
  // Inyección de contenido en el input hidden
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
};

const limpiarAlertas = () => {
  const alertas = document.querySelector(".alertas");

  const interval = setInterval(() => {
    if (alertas.children.length > 0) {
      alertas.removeChild(alertas.children[0]);
    } else if (alertas.children.length === 0) {
      alertas.parentElement.removeChild(alertas);
      clearInterval(interval);
    }
  }, 2000);
};

const accionesListado = (e) => {
  e.preventDefault();

  if (e.target.dataset.eliminar) {
    Swal.fire({
      title: "¿Está seguro de esta acción?",
      text: "No es revertible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar.",
      cancelButtonText: "No, cancelar.",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si se confirma, enviamos una petición usando axios
        const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

        axios
          .delete(url)
          .then(function (res) {
            if (res.status === 200) {
              Swal.fire({
                title: "Eliminado",
                text: res.data.mensaje,
                icon: "success",
              }).then(() => {
                location.reload();
              });

              e.target.parentElement.parentElement.parentElement.removeChild(
                e.target.parentElement.parentElement
              );
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo completar la operación",
            });
          });
      }
    });
  } else {
    if (e.target.href) {
      window.location.href = e.target.href;
    }
  }
};
