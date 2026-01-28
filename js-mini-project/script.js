const form = document.querySelector("#todoForm");
const input = document.querySelector("#todoInput");
const list = document.querySelector("#todoList");

let todos = [];

form.addEventListener("submit", function (event) {
  event.preventDefault(); // ⛔ запрещаем перезагрузку страницы

  const text = input.value.trim();
  if (text === "") return;

  const todo = {
    id: Date.now(),
    text: text,
  };

  todos.push(todo);
  input.value = "";

  render();
});

function render() {
  list.innerHTML = "";

  todos.forEach(function (todo) {
    const li = document.createElement("li");
    li.textContent = todo.text;
    list.appendChild(li);
  });
}
