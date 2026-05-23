import "./style.css";
import { table } from "./components/table";

// Seleccionamos el div llamado table_
const table_ = document.querySelector("#table_");

// Reemplazamos el table_ por el table es decir la tabla completa con los encabezados(modulo table)
table_.innerHTML = table;

// Seleccionamos body-table de el modulo table para reemplazarlos con las tareas
const bodyTable = table_.querySelector("#body-table");

//Seleccionamos el formulario de agregar tarea
const form = document.querySelector("#form");

// Traemos los datos de la base de datos por el metodo fetch que por defecto es un GET y es una asincronia
async function getData(url) {
  // Obtenemos los datos como un html
  const response = await fetch(url);
  // Lo convertimos en un Json y lo retornamos
  return await response.json();
}

// Metedo Delete utilizando fecth

const deleteTask = async (id) => {
  const response = await fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
  });
  renderTasks();
};

const createTask = async (title) => {
  const tas = {
    title: title,
    completed: false,
  };

  const response = await fetch(`http://localhost:3000/todos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tas),
  });

  renderTasks();
};

//Creaar update, con metodo PUT
const updateTask = async (id) => {
  const upTask = {
    title: "algo",
    completed: true,
  };
  const response = await fetch(`http://localhost:3000/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(upTask),
  });
};

// Metodo PATH para cambiar solo un aspecto
const pathTask = async (id, name) => {
  const upTask = {
    title: name,
  };
  const response = await fetch(`http://localhost:3000/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(upTask),
  });
  renderTasks();
};

const status = async (id) => {
  const upTask = {
    completed: true,
  };
  const response = await fetch(`http://localhost:3000/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(upTask),
  });
  renderTasks();
};

// Guardamos los datos en la varianble tasks

//Iteramos los taks y los vamos inyectando uno por uno reemplandolo por bodyTable
async function renderTasks() {
  const taks = await getData("http://localhost:3000/todos");
  bodyTable.innerHTML = "";

  taks.forEach((task) => {
    bodyTable.innerHTML += `<tbody>
          <tr id="title" class="text-left">
            <td class="pl-4 h-12">${task.id}</td>
            <td  class="pl-4 h-12">${task.title}</td>
            <td class="pl-4 h-12">${task.completed == true ? "Completed" : "Pending"}</td>
            <td class="flex gap-2 pl-4 h-12">
              <div class="w-full h-full flex gap-2 items-center" data-id="${task.id}">

              <button class="btn-edit cursor-pointer" data-id="${task.id}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg></button>
              
              <button class="btn-delete cursor-pointer" data-id="${task.id}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              </button>
              <button class="btn-check cursor-pointer" data-id="${task.id}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              </button>
              </div>
              
            </td>
          </tr>
        </tbody>`;
  });
  // Seleccionamos todos los botones delete

  const allBtnDelete = document.querySelectorAll(".btn-delete");
  const allBtnEdit = document.querySelectorAll(".btn-edit");
  const allBtnCheck = document.querySelectorAll(".btn-check");

  allBtnDelete.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      console.log("click");

      deleteTask(id);
    });
  });

  allBtnCheck.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.id;
      const title = document.getElementById("title");
      status(id);
    });
  });

  allBtnEdit.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.id;
      const title = prompt("Escribe el nombre de la tarea");
      pathTask(id, title);
    });
  });
}

form.addEventListener("submit", (e) => {
  // utilizamos la e de event para evitar que se recargue la pagina
  e.preventDefault();
  const data = new FormData(form);
  const taskName = data.get("taskName");

  createTask(taskName);
  renderTasks();
});

renderTasks();
