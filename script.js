
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = [];
let currentFilter = "all";

// Load tasks from the server
async function loadTasks() {
  try {
    const response = await fetch("/api/tasks");

    if (!response.ok) {
      throw new Error("Could not load tasks");
    }

    tasks = await response.json();
    renderTasks();
  } catch (error) {
    console.error("Load error:", error);
  }
}

// Display tasks
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", async () => {
      await updateTask(task.id, {
        completed: checkbox.checked
      });
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    if (task.completed) {
      text.style.textDecoration = "line-through";
    }

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", async () => {
      const newText = prompt("Edit task:", task.text);

      if (newText === null || !newText.trim()) return;

      await updateTask(task.id, {
        text: newText.trim()
      });
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Delete this task?")) return;
      await deleteTask(task.id);
    });

    li.append(checkbox, text, editBtn, deleteBtn);
    taskList.appendChild(li);
  });
}

// Add a task
async function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  addTaskBtn.disabled = true;

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error("Could not add task");
    }

    taskInput.value = "";
    await loadTasks();
  } catch (error) {
    console.error("Add error:", error);
    alert("Could not add task. Please try again.");
  } finally {
    addTaskBtn.disabled = false;
  }
}

// Update completion status or task text
async function updateTask(id, changes) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes)
    });

    if (!response.ok) {
      throw new Error(`Update failed: HTTP ${response.status}`);
    }

    const updatedTask = await response.json();

    tasks = tasks.map((task) =>
      String(task.id) === String(updatedTask.id)
        ? updatedTask
        : task
    );

    renderTasks();
  } catch (error) {
    console.error("Update error:", error);
    alert("Task update failed. Please try again.");
    await loadTasks();
  }
}

// Delete a task
async function deleteTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`Delete failed: HTTP ${response.status}`);
    }

    tasks = tasks.filter(
      (task) => String(task.id) !== String(id)
    );

    renderTasks();
  } catch (error) {
    console.error("Delete error:", error);
    alert("Could not delete task. Please try again.");
    await loadTasks();
  }
}

// Add button and Enter key
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Optional filter buttons, if present in your HTML
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// Start the app
loadTasks();
