const form = document.querySelector("#todoForm");
const input = document.querySelector("#todoInput");
const list = document.querySelector("#todoList");
const counter = document.querySelector("#counter");
const clearBtn = document.querySelector("#clearBtn");

let todos = [];

function render() {
  list.innerHTML = "";

  todos.forEach((text, index) => {
    const li = document.createElement("li");
    li.className = "item";

    const span = document.createElement("span");
    span.textContent = text;

    const btn = document.createElement("button");
    btn.textContent = "🗑️";
    btn.className = "remove";
    btn.type = "button";

    btn.addEventListener("click", () => {
      todos.splice(index, 1);
      render();
    });

    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });

  counter.textContent = `${todos.length} задач`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (text === "") return;

  todos.push(text);
  input.value = "";
  render();
});

clearBtn.addEventListener("click", () => {
  todos = [];
  render();
});

render();
