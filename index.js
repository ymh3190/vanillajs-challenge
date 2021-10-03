const realtimeClock = document.querySelector("#realtimeClock");
const loginForm = document.querySelector("#loginForm");
const greeting = document.querySelector("#greeting");
const todoForm = document.querySelector("#todoForm");
const todoInput = todoForm.querySelector("input");
const todoList = document.querySelector("#todoList");

const TODOS_KEY = "todos";

let todos = [];

const img = ["a.jpeg", "b.jpg", "c.jpeg", "d.jpg"];

const readTodos = () => {
  const stringifiedTodos = localStorage.getItem(TODOS_KEY);
  if (!stringifiedTodos) {
    return;
  }
  const parseTodos = JSON.parse(stringifiedTodos);
  todos = parseTodos;
  parseTodos.forEach(paintTodo);
};

const deleteTodo = (event) => {
  const li = event.target.parentElement;
  li.remove();

  todos = todos.filter((todo) => todo.id !== parseInt(li.id));
  saveTodo();
};

const saveTodo = () => {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};

const paintTodo = (todo) => {
  const li = document.createElement("li");
  li.id = todo.id;
  const span = document.createElement("span");
  span.innerText = todo.text;
  const btn = document.createElement("button");
  btn.className = "deleteBtn";
  btn.innerText = "❌";
  btn.addEventListener("click", deleteTodo);

  li.appendChild(span);
  li.appendChild(btn);
  todoList.appendChild(li);
};

const submitTodo = (event) => {
  event.preventDefault();

  const todo = {
    id: Date.now(),
    text: todoInput.value,
  };
  todoInput.value = "";

  todos.push(todo);
  paintTodo(todo);
  saveTodo();
};

const appendGreeting = (username) => {
  const h1 = greeting.querySelector("h1");
  h1.innerText = `Hello! ${username}`;
};

const localLogin = () => {
  const username = localStorage.getItem("username");
  if (!username) {
    todoForm.setAttribute("style", "display: none;");
    loginForm.setAttribute("style", "display: flex;");
    return;
  }
  loginForm.setAttribute("style", "display: none;");

  appendGreeting(username);
};

const clickLoginBtn = (event) => {
  event.preventDefault();

  const username = loginForm.querySelector("input").value;
  if (!username) {
    return;
  }
  localStorage.setItem("username", username);
  loginForm.setAttribute("style", "display: none;");
  todoForm.setAttribute("style", "display: block;");

  appendGreeting(username);
};

const toPadStart = (date) => {
  return String(date).padStart(2, "0");
};

const displayClock = () => {
  const now = new Date();
  const years = now.getFullYear();
  const months = now.getMonth();
  const dates = toPadStart(now.getDate());
  const hours = toPadStart(now.getHours());
  const minutes = toPadStart(now.getMinutes());
  const seconds = toPadStart(now.getSeconds());

  const clock = realtimeClock.querySelector("span:first-child");
  clock.innerHTML = `${
    hours >= 12 ? "오후" : "오전"
  } ${hours}:${minutes}:${seconds}`;
  const date = realtimeClock.querySelector("span:last-child");
  date.innerHTML = `${years}-${months + 1}-${dates}`;
};

// 5. 날씨와 위치 (geolocation)
const API_KEY = "004a6dd3cb6cd21189299f3a3e86d45e";

const geoSuccess = (pos) => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const api = document.getElementById("api");
      const city = api.querySelector("span:first-child");
      city.innerText = `${data.name} / `;
      const weather = api.querySelector("span:last-child");
      weather.innerText = `${data.weather[0].main}`;
    });
};
const geoError = (err) => {
  alert(err.message);
};

const geo = navigator.geolocation;
geo.getCurrentPosition(geoSuccess, geoError);

// 4. 랜덤 배경 이미지
document.body.setAttribute(
  "background",
  // `bg/${img[Math.floor(Math.random() * img.length)]}`
  `bg/a.jpeg`
);

// 3. 로컬 스토리지를 사용한 투두리스트
readTodos();
todoForm.addEventListener("submit", submitTodo);

// 2. 로컬 스토리지를 사용한 로그인
localLogin();
loginForm.addEventListener("submit", clickLoginBtn);

// 1. 실시간 시계
displayClock();
setInterval(displayClock, 1000);
