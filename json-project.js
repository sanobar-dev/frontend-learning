const API_URL = "https://jsonplaceholder.typicode.com/users";

const searchEl = document.getElementById("search");
const listEl = document.getElementById("list");
const statusEl = document.getElementById("status");
const metaEl = document.getElementById("meta");

let users = [];

function setStatus(text) {
  statusEl.textContent = text;
}

function render(list) {
  listEl.innerHTML = "";

  if (list.length === 0) {
    setStatus("Ничего не найдено 😕");
    metaEl.textContent = "0 пользователей";
    return;
  }

  setStatus("");
  metaEl.textContent = ${list.length} пользователей;

  for (const u of list) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = 
      <h3>${escapeHtml(u.name)}</h3>
      <p class="small"><strong>Email:</strong> <a href="mailto:${escapeAttr(u.email)}">${escapeHtml(u.email)}</a></p>
      <p class="small"><strong>Company:</strong> ${escapeHtml(u.company?.name ?? "-")}</p>
      <span class="badge">@${escapeHtml(u.username)}</span>
    ;

    listEl.appendChild(card);
  }
}

function filterUsers(query) {
  const q = query.trim().toLowerCase();
  if (!q) return users;

  return users.filter(u =>
    (u.name  "").toLowerCase().includes(q) 
    (u.email || "").toLowerCase().includes(q)
  );
}

async function load() {
  try {
    setStatus("Загрузка данных...");
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(HTTP ${res.status});
    }

    users = await res.json();
    render(users);
  } catch (err) {
    console.error(err);
    setStatus("Ошибка загрузки. Проверь интернет или попробуй позже.");
    metaEl.textContent = "";
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[s]));
}
function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

searchEl.addEventListener("input", (e) => {
  const filtered = filterUsers(e.target.value);
  render(filtered);
});

load();
