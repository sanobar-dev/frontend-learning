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

clearDoneBtn.addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  saveTodos();
  render();
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    filter = chip.dataset.filter;
    render();
  });
});

function render() {
  list.innerHTML = "";

  const visible = getFilteredTodos(todos, filter);

  visible.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check";
    checkbox.checked = todo.done;

    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      saveTodos();
      render();
    });

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = todo.text;

    // Двойной клик — редактирование
    span.addEventListener("dblclick", () => {
      const updated = prompt("Измени задачу:", todo.text);
      if (updated === null) return;
      const clean = updated.trim();
      if (!clean) return;

      todo.text = clean;
      saveTodos();
      render();
    });

    const delBtn = document.createElement("button");
    delBtn.className = "icon-btn";
    delBtn.type = "button";
    delBtn.title = "Удалить";
    delBtn.textContent = "🗑️";

    delBtn.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      saveTodos();
      render();
    });

    li.append(checkbox, span, delBtn);
    list.append(li);
  });

  updateCounter();
}

function updateCounter() {
  const total = todos.length;
  const doneCount = todos.filter((t) => t.done).length;

  const word = total === 1 ? "задача" : total >= 2 && total <= 4 ? "задачи" : "задач";
  counter.textContent = ${total} ${word} • выполнено ${doneCount};
}

function getFilteredTodos(all, mode) {
  if (mode === "active") return all.filter((t) => !t.done);
  if (mode === "done") return all.filter((t) => t.done);
  return all;
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
