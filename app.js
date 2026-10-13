// 1. DOM elements pakdo
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const listEl = document.querySelector("#list");

// 2. State (sharma ji ka register)
let tasks = [];

// 3. Render function: register ko dekh kar board draw karta hai
function render() {
  // purani list saaf karo
  listEl.replaceChildren();

  // tray banao jisme sare items ek sath rakhenge
  const fragment = document.createDocumentFragment();

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    // text span: safe textContent taaki koi script injection na ho
    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;

    li.append(textSpan);
    fragment.append(li);
  });

  // ek sath screen par chipkao
  listEl.append(fragment);
}

// 4. Form submit: Ram Chacha flow
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Read & Clean
  const text = taskInput.value.trim();

  // Check: khali ya sirf space hai toh ignore
  if (!text) return;

  // Save to State
  const newTask = {
    id: Date.now(),
    text: text,
    done: false
  };
  tasks.push(newTask);

  // Show
  render();

  // Reset
  taskForm.reset();
  taskInput.focus();
});