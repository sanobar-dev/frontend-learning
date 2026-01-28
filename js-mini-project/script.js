const input = document.getElementById("todoInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const counter = document.getElementById("counter");

let count = 0;

button.addEventListener("click", () => {
  const text = input.value.trim();

  if (text === "") {
    return;
  }

  const li = document.createElement("li");
  li.textContent = text;
  list.appendChild(li);

  count++;
  counter.textContent = ${count} задач;

  input.value = "";
});
