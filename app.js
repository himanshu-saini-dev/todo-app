const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const listEl = document.querySelector("#list");
const countSpan = document.querySelector("#count");
const clearDoneBtn = document.querySelector("#clear-done-btn");
const filtersContainer = document.querySelector("#filters");

// M7: Load state from localStorage on startup (fallback to empty array)
let tasks = JSON.parse(localStorage.getItem("school_tasks")) ?? [];
let filter = "all"; // "all" | "active" | "done"

function render() {
  // 1. Live derived counter
  const pendingCount = tasks.filter((t) => !t.done).length;
  countSpan.textContent = `${pendingCount} ${pendingCount === 1 ? "task" : "tasks"} left`;

  // 2. Filter logic
  let visibleTasks = tasks;
  if (filter === "active") {
    visibleTasks = tasks.filter((t) => !t.done);
  } else if (filter === "done") {
    visibleTasks = tasks.filter((t) => t.done);
  }

  // DOM saaf karo
  listEl.replaceChildren();

  const fragment = document.createDocumentFragment();

  visibleTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.done ? "done" : ""}`;
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "toggle-chk";
    checkbox.checked = task.done;

    // Safe Text
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

  // 3. Active filter button styling
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    if (btn.dataset.filter === filter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // 4. M7: Save updated state in localStorage
  localStorage.setItem("school_tasks", JSON.stringify(tasks));
}

// Ram Chacha flow: Add Task
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

// Clear completed tasks
clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  render();
});

// Filters delegation
filtersContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  filter = btn.dataset.filter;
  render();
});

// Fix 3: Inline edit using immutable map + spread
listEl.addEventListener("dblclick", (e) => {
  const textSpan = e.target.closest(".task-text");
  if (!textSpan) return;

  const li = textSpan.closest("li");
  const id = Number(li.dataset.id);
  const currentTask = tasks.find((t) => t.id === id);
  if (!currentTask) return;

  const input = document.createElement("input");
  input.type = "text";
  input.className = "edit-input";
  input.value = currentTask.text;

  textSpan.replaceWith(input);
  input.focus();

  let isCancelled = false;

  function saveEdit() {
    if (isCancelled) return;
    const newText = input.value.trim();
    if (newText) {
      tasks = tasks.map((t) => {
        if (t.id === id) {
          return { ...t, text: newText };
        }
        return t;
      });
    }
    render();
  }

  function cancelEdit() {
    isCancelled = true;
    render();
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveEdit();
    } else if (event.key === "Escape") {
      cancelEdit();
    }
  });

  input.addEventListener("blur", () => {
    saveEdit();
  });
});
// M7: First paint on load
render();