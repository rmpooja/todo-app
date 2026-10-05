const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount() {
  const activeTasks = tasks.filter(function (task) {
    return !task.completed;
  });

  taskCount.textContent =
    activeTasks.length +
    (activeTasks.length === 1 ? " task left" : " tasks left");
}

function displayTasks() {
  list.innerHTML = "";

  tasks.forEach(function (taskData, index) {

    if (
      currentFilter === "active" &&
      taskData.completed
    ) {
      return;
    }

    if (
      currentFilter === "completed" &&
      !taskData.completed
    ) {
      return;
    }

    const item = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskData.completed;

    const taskText = document.createElement("span");
    taskText.textContent = taskData.text;

    if (taskData.completed) {
      taskText.style.textDecoration = "line-through";
      taskText.style.color = "#888";
    }

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    checkbox.addEventListener("change", function () {

      taskData.completed = checkbox.checked;

      saveTasks();
      displayTasks();
    });

    editButton.addEventListener("click", function () {

      const newText = prompt(
        "Edit your task:",
        taskData.text
      );

      if (newText !== null && newText.trim() !== "") {

        taskData.text = newText.trim();

        saveTasks();
        displayTasks();
      }
    });

    deleteButton.addEventListener("click", function () {

      tasks.splice(index, 1);

      saveTasks();
      displayTasks();
    });

    item.appendChild(checkbox);
    item.appendChild(taskText);
    item.appendChild(editButton);
    item.appendChild(deleteButton);

    list.appendChild(item);
  });

  updateTaskCount();
}

function addTask() {

  const text = input.value.trim();

  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  const taskData = {
    text: text,
    completed: false
  };

  tasks.push(taskData);

  saveTasks();
  displayTasks();

  input.value = "";
}

button.addEventListener("click", addTask);

input.addEventListener("keydown", function (event) {

  if (event.key === "Enter") {
    addTask();
  }
});

filterButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    displayTasks();
  });
});

displayTasks();
