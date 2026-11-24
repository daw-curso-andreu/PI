const API_URL = "/api/tareas";

const form = document.querySelector("#form-tarea");
const inputTitulo = document.querySelector("#input-titulo");
const lista = document.querySelector("#lista-tareas");
const filtros = document.querySelector("#filtros");
const mensaje = document.querySelector("#mensaje");

let tareas = [];
let filtroActual = "todas";

// ===== DOM =====
function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.classList.toggle("error", esError);
  mensaje.hidden = !texto;
}

function tareasFiltradas() {
  if (filtroActual === "pendientes") return tareas.filter((t) => !t.completada);
  if (filtroActual === "hechas") return tareas.filter((t) => t.completada);
  return tareas;
}

function pintar() {
  lista.innerHTML = "";
  const visibles = tareasFiltradas();

  mostrarMensaje(visibles.length === 0 ? "No hay tareas para mostrar." : "");

  visibles.forEach((tarea) => {
    const li = document.createElement("li");
    li.className = "tarea" + (tarea.completada ? " hecha" : "");
    li.dataset.id = tarea._id;

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = tarea.completada;

    const titulo = document.createElement("span");
    titulo.className = "titulo";
    titulo.textContent = tarea.titulo;

    const editar = document.createElement("button");
    editar.className = "btn btn-editar";
    editar.textContent = "Editar";

    const borrar = document.createElement("button");
    borrar.className = "btn btn-borrar";
    borrar.textContent = "Borrar";

    li.append(check, titulo, editar, borrar);
    lista.append(li);
  });
}

// ===== Llamadas a la API =====
async function pedir(url, opciones) {
  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch {
    // El navegador lanza "Failed to fetch" (en inglés) si el servidor no responde
    throw new Error("No se puede conectar con el servidor. ¿Está arrancado?");
  }
  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error || `Error en la petición (código ${respuesta.status})`);
  }
  return respuesta.status === 204 ? null : respuesta.json();
}

async function cargarTareas() {
  try {
    tareas = await pedir(API_URL);
    pintar();
  } catch (error) {
    mostrarMensaje("No se han podido cargar las tareas: " + error.message, true);
  }
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const titulo = inputTitulo.value.trim();
  if (!titulo) return;

  try {
    const nueva = await pedir(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    });
    tareas.unshift(nueva);
    inputTitulo.value = "";
    pintar();
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
});

lista.addEventListener("click", async (evento) => {
  const li = evento.target.closest(".tarea");
  if (!li) return;
  const id = li.dataset.id;

  try {
    if (evento.target.matches(".btn-editar")) {
      const tituloSpan = li.querySelector(".titulo");
      const campo = document.createElement("input");
      campo.type = "text";
      campo.className = "campo-editar";
      campo.maxLength = 120;
      campo.value = tituloSpan.textContent;
      tituloSpan.replaceWith(campo);
      campo.focus();
      campo.select();
    } else if (evento.target.matches(".btn-borrar")) {
      await pedir(`${API_URL}/${id}`, { method: "DELETE" });
      tareas = tareas.filter((t) => t._id !== id);
      pintar();
    } else if (evento.target.matches("input[type='checkbox']")) {
      const actualizada = await pedir(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completada: evento.target.checked }),
      });
      tareas = tareas.map((t) => (t._id === id ? actualizada : t));
      pintar();
    }
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
});

filtros.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-filtro]");
  if (!boton) return;
  filtroActual = boton.dataset.filtro;
  filtros.querySelectorAll(".btn-filtro").forEach((b) => b.classList.remove("activo"));
  boton.classList.add("activo");
  pintar();
});

cargarTareas();

// Guardar o cancelar la edición del título
lista.addEventListener("keydown", async (evento) => {
  if (!evento.target.matches(".campo-editar")) return;

  if (evento.key === "Escape") {
    pintar();
  } else if (evento.key === "Enter") {
    const id = evento.target.closest(".tarea").dataset.id;
    const titulo = evento.target.value.trim();
    if (!titulo) return;

    try {
      const actualizada = await pedir(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo }),
      });
      tareas = tareas.map((t) => (t._id === id ? actualizada : t));
      pintar();
    } catch (error) {
      mostrarMensaje(error.message, true);
    }
  }
});
