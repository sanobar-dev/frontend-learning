const form = document.querySelector("#todoForm");
const input = document.querySelector("#todoInput");
const list = document.querySelector("#todoList");
const counter = document.querySelector("#counter");
const clearDoneBtn = document.querySelector("#clearDone");
const chips = document.querySelectorAll(".chip");

const STORAGE_KEY = "sanobar_todos_v1";

let todos = loadTodos();
let filter = "all";

render();

// Add task
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const newTodo = {
    id: crypto.randomUUID(),
    text,
    done: false,
    createdAt: Date.now(),
  };

  todos.unshift(newTodo);
  input.value = "";
  saveTodos();
  render();
});

// Filters
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    filter = chip.dataset.filter;
    render();
  });
});

// Clear done
clearDoneBtn.addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  saveTodos();
  render();
});

// Render
function render() {
  const visible = getFilteredTodos();
  list.innerHTML = "";

  visible.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo" + (todo.done ? " is-done" : "");
    li.dataset.id = todo.id;

    li.innerHTML = 
      <div class="todo__left">
        <input class="todo__check" type="checkbox" ${todo.done ? "checked" : ""} />
        <span class="todo__text"></span>
      </div>
      <button class="todo__remove" type="button" aria-label="Удалить">×</button>
    ;

    li.querySelector(".todo__text").textContent = todo.text;

    // Toggle done
    li.querySelector(".todo__check").addEventListener("change", () => {
      toggleDone(todo.id);
    });

    // Remove
    li.querySelector(".todo__remove").addEventListener("click", () => {
      removeTodo(todo.id);
    });

    list.appendChild(li);
  });

  updateCounter();
}

function getFilteredTodos() {
  if (filter === "active") return todos.filter((t) => !t.done);
  if (filter === "done") return todos.filter((t) => t.done);
  return todos;
}

function toggleDone(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveTodos();
  render();
}

function removeTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function updateCounter() {
  const total = todos.length;
  const word = getWord(total);
  counter.textContent = ${total} ${word};
}

function getWord(n) {
  // 1 задача, 2-4 задачи, 5-20 задач…
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod100 >= 11 && mod100 <= 14) return "задач";
  if (mod10 === 1) return "задача";
  if (mod10 >= 2 && mod10 <= 4) return "задачи";
  return "задач";
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
