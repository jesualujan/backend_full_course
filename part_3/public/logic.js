// 🔐 Recupera el token guardado en localStorage para mantener sesión
let token = localStorage.getItem('token');

// 🧠 Estados de control para la UI y lógica
let isLoading = false;
let isAuthenticating = false;
let isRegistration = false;
let selectedTab = 'All'; // pestaña activa (All, Complete, Incomplete)
let todos = []; // lista de tareas

// 🌐 Base de la API (puede ser ajustado si se usa proxy o entorno)
const apiBase = '/';

// 🎯 Referencias a elementos del DOM
const nav = document.querySelector('nav');
const header = document.querySelector('header');
const main = document.querySelector('main');
const navElements = document.querySelectorAll('.tab-button');
const authContent = document.getElementById('auth');
const textError = document.getElementById('error');
const email = document.getElementById('emailInput');
const password = document.getElementById('passwordInput');
const registerBtn = document.getElementById('registerBtn');
const authBtn = document.getElementById('authBtn');
const addTodoBtn = document.getElementById('addTodoBtn');

// 🧱 Renderiza la vista principal del dashboard
async function showDashboard() {
  nav.style.display = 'block';
  header.style.display = 'flex';
  main.style.display = 'flex';
  authContent.style.display = 'none';

  await fetchTodos(); // carga tareas
}

// 🧾 Actualiza el texto del encabezado con el número de tareas
function updateHeaderText() {
  const todosLength = todos.length;
  const newString =
    todosLength === 1 ? `You have 1 open task.` : `You have ${todosLength} open tasks.`;
  header.querySelector('h1').innerText = newString;
}

// 🔢 Actualiza los contadores de cada pestaña (All, Complete, Incomplete)
function updateNavCount() {
  navElements.forEach((ele) => {
    const btnText = ele.innerText.split(' ')[0];

    const count = todos.filter((val) => {
      if (btnText === 'All') return true;
      return btnText === 'Complete' ? val.completed : !val.completed;
    }).length;

    ele.querySelector('span').innerText = `(${count})`;
  });
}

// 🔄 Cambia la pestaña activa y actualiza estilos
function changeTab(tab) {
  selectedTab = tab;
  navElements.forEach((val) => {
    val.classList.toggle('selected-tab', val.innerText.includes(tab));
  });
  renderTodos();
}

// 🖼️ Renderiza las tareas según la pestaña activa
function renderTodos() {
  updateNavCount();
  updateHeaderText();

  let todoList = ``;

  todos
    .filter((val) => {
      return selectedTab === 'All'
        ? true
        : selectedTab === 'Complete'
        ? val.completed
        : !val.completed;
    })
    .forEach((todo) => {
      const taskIndex = todo.id;
      todoList += `
        <div class="card todo-item">
          <p>${todo.task}</p>
          <div class="todo-buttons">
            <button onclick="updateTodo(${taskIndex})" ${todo.completed ? 'disabled' : ''}>
              <h6>Done</h6>
            </button>
            <button onclick="deleteTodo(${taskIndex})">
              <h6>Delete</h6>
            </button>
          </div>
        </div>
      `;
    });

  // Input para agregar nueva tarea
  todoList += `
    <div class="input-container">
      <input id="todoInput" placeholder="Add task" />
      <button onclick="addTodo()">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
  `;

  main.innerHTML = todoList;
}

// 🔁 Alterna entre modo registro y login
async function toggleIsRegister() {
  isRegistration = !isRegistration;
  registerBtn.innerText = isRegistration ? 'Sign in' : 'Sign up';
  document.querySelector('#auth > div h2').innerText = isRegistration ? 'Sign Up' : 'Login';
  document.querySelector('.register-content p').innerText = isRegistration
    ? 'Already have an account?'
    : "Don't have an account?";
  document.querySelector('.register-content button').innerText = isRegistration
    ? 'Sign in'
    : 'Sign up';
}

// 🔐 Lógica de autenticación (login o registro)
async function authenticate() {
  const emailVal = email.value;
  const passVal = password.value;

  // Validaciones básicas
  if (
    isLoading ||
    isAuthenticating ||
    !emailVal ||
    !passVal ||
    passVal.length < 6 ||
    !emailVal.includes('@')
  )
    return;

  error.style.display = 'none';
  isAuthenticating = true;
  authBtn.innerText = 'Authenticating...';

  try {
    let data;
    const endpoint = isRegistration ? 'auth/register' : 'auth/login';

    const response = await fetch(apiBase + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: emailVal, password: passVal }),
    });

    data = await response.json();

    if (data.token) {
      token = data.token;
      localStorage.setItem('token', token);
      authBtn.innerText = 'Loading...';
      await fetchTodos();
      showDashboard();
    } else {
      throw Error('❌ Failed to authenticate...');
    }
  } catch (err) {
    console.log(err.message);
    error.innerText = err.message;
    error.style.display = 'block';
  } finally {
    authBtn.innerText = 'Submit';
    isAuthenticating = false;
  }
}

// 🚪 Cierra sesión (pendiente de implementación)
function logout() {
  // Aquí podrías limpiar el token, resetear estados y mostrar pantalla de login
}

// 📥 Obtiene las tareas del backend
async function fetchTodos() {
  isLoading = true;
  const response = await fetch(apiBase + 'todos', {
    headers: { Authorization: token },
  });
  const todosData = await response.json();
  todos = todosData;
  isLoading = false;
  renderTodos();
}

// ✅ Marca una tarea como completada
async function updateTodo(index) {
  const task = todos.find((val) => val.id === index).task;

  await fetch(apiBase + 'todos/' + index, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ task, completed: 1 }),
  });

  fetchTodos();
}

// 🗑️ Elimina una tarea
async function deleteTodo(index) {
  await fetch(apiBase + 'todos/' + index, {
    method: 'DELETE',
    headers: {
      Authorization: token,
    },
  });

  fetchTodos();
}

// ➕ Agrega una nueva tarea
async function addTodo() {
  const todoInput = document.getElementById('todoInput');
  const task = todoInput.value;

  if (!task) return;

  await fetch(apiBase + 'todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ task }),
  });

  todoInput.value = '';
  fetchTodos();
}

// 🚀 Si hay token, carga tareas y muestra dashboard automáticamente
if (token) {
  async function run() {
    await fetchTodos();
    showDashboard();
  }
  run();
}
