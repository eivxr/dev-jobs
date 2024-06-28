/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/app.js":
/*!**************************!*\
  !*** ./public/js/app.js ***!
  \**************************/
/***/ (() => {

eval("function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _iterableToArray(r) { if (\"undefined\" != typeof Symbol && null != r[Symbol.iterator] || null != r[\"@@iterator\"]) return Array.from(r); }\nfunction _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  var skills = document.querySelector(\".lista-conocimientos\");\n  var alertas = document.querySelector(\".alertas\");\n\n  //limpiar alertas del formulario crear cuenta\n  if (alertas) {\n    limpiaralertas();\n  }\n  if (skills) {\n    skills.addEventListener(\"click\", agregarSkills);\n\n    //llamar a la funcion en editar vacante\n    skillsSeleccionados();\n  }\n});\nvar skills = new Set(); //set constructor of a new object/array\n\nvar agregarSkills = function agregarSkills(e) {\n  if (e.target.tagName === \"LI\") {\n    if (e.target.classList.contains(\"activo\")) {\n      //quita del set y lo desmarca(quita una clase \"activo\")\n      skills[\"delete\"](e.target.textContent);\n      e.target.classList.remove(\"activo\");\n      console.log(skills);\n    } else {\n      //lo contrario lol\n      skills.add(e.target.textContent);\n      e.target.classList.add(\"activo\");\n      console.log(skills);\n    }\n  }\n  var skillsArray = _toConsumableArray(skills);\n  document.querySelector(\"#skills\").value = skillsArray;\n};\nvar skillsSeleccionados = function skillsSeleccionados() {\n  // recuperamos la lista de habilidades del html\n  var seleccionados = Array.from(document.querySelectorAll(\".lista-conocimientos .activo\"));\n  seleccionados.forEach(function (seleccionada) {\n    return skills.add(seleccionada.textContent);\n  });\n  //inyeccion de contenido en el input hidden\n  var skillsArray = _toConsumableArray(skills);\n  document.querySelector(\"#skills\").value = skillsArray;\n};\nvar limpiaralertas = function limpiaralertas() {\n  var alertas = document.querySelector('.alertas');\n  var interval = setInterval(function () {\n    if (alertas.children.length > 0) {\n      alertas.removeChild(alertas.children[0]);\n    } else if (alertas.children.length === 0) {\n      alertas.parentElement.removeChild(alertas);\n      clearInterval(interval);\n    }\n  }, 2000);\n};\n\n//# sourceURL=webpack://devjobs/./public/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/js/app.js"]();
/******/ 	
/******/ })()
;