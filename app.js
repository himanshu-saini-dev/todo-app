const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const listEl = document.querySelector("#list");
const countSpan = document.querySelector("#count");
const clearDoneBtn = document.querySelector("#clear-done-btn");

// M5: filters container pakdo
const filtersContainer = document.querySelector("#filters");

// State: Register ke 2 hisse
let tasks = [];
let filter = "all"; // "all" | "active" | "done"

function render() {
  // 1. Live counter calculation
  const pendingCount = tasks.filter((t) => !t.done).length;
  countSpan.textContent = `${pendingCount} ${pendingCount === 1 ? "task" : "tasks"} left`;

  // 2. M5: Filter condition ke hisab se dikhane wali list chuno
  let visibleTasks = tasks;
  if (filter === "active") {
    visibleTasks = tasks.filter((t) => !t.done);
  } else if (filter === "done") {
    visibleTasks = tasks.filter((t) => t.done);
  }

  // Purani screen list khali karo
  listEl.replaceChildren();

  const fragment = document.createDocumentFragment();

  // Screen par sirf filtered (visible) tasks draw honge
  visibleTasks.forEach((task) => {
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

  // 3. M5: Active filter button par blue highlight update karo
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    if (btn.dataset.filter === filter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
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

// Clear completed button
clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  render();
});

// M5: Filter buttons click listener via delegation
filtersContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  filter = btn.dataset.filter;
  render();
});


// M6: Double click to inline edit task text
listEl.addEventListener("dblclick", (e) => {
  const textSpan = e.target.closest(".task-text");
  if (!textSpan) return;

  const li = textSpan.closest("li");
  const id = Number(li.dataset.id);
  const currentTask = tasks.find((t) => t.id === id);
  if (!currentTask) return;

  // 1. Ek temporary input box banao
  const input = document.createElement("input");
  input.type = "text";
  input.className = "edit-input";
  input.value = currentTask.text;

  // 2. Span ko input box se badlo aur focus karo
  textSpan.replaceWith(input);
  input.focus();

  // 3. Save logic
  function saveEdit() {
    const newText = input.value.trim();
    if (newText) {
      currentTask.text = newText;
    }
    render();
  }

  // 4. Cancel logic
  function cancelEdit() {
    render();
  }

  // Keys handle karo: Enter par save, Escape par cancel
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveEdit();
    } else if (event.key === "Escape") {
      cancelEdit();
    }
  });

  // Bahar click hone par bhi save ho jaye
  input.addEventListener("blur", () => {
    saveEdit();
  });
});