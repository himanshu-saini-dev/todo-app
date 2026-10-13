const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const listEl = document.querySelector("#list");

// M4: DOM elements for footer
const countSpan = document.querySelector("#count");
const clearDoneBtn = document.querySelector("#clear-done-btn");

let tasks = [];

function render() {
  // 1. M4: Derived Data calculation (Pending tasks count)
  const pendingCount = tasks.filter((t) => !t.done).length;
  countSpan.textContent = `${pendingCount} ${pendingCount === 1 ? "task" : "tasks"} left`;

  // Purani screen clear
  listEl.replaceChildren();

  const fragment = document.createDocumentFragment();

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.done ? "done" : ""}`;
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "toggle-chk";
    checkbox.checked = task.done;

    // Text
    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;

    // Delete Button
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "del-btn";
    delBtn.textContent = "✕";

    li.append(checkbox, textSpan, delBtn);
    fragment.append(li);
  });

  listEl.append(fragment);
}

// Form submit: Add task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text,
    done: false
  };

  tasks.push(newTask);
  render();

  taskForm.reset();
  taskInput.focus();
});

// Single Delegated listener on <ul> for Toggle & Delete
listEl.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.classList.contains("toggle-chk")) {
    tasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, done: !task.done };
      }
      return task;
    });
    render();
    return;
  }

  if (e.target.classList.contains("del-btn")) {
    tasks = tasks.filter((task) => task.id !== id);
    render();
    return;
  }
});

// M4: Clear completed tasks button
clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  render();
});