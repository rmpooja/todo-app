const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");

let currentFilter = "all";


// Get tasks from server
async function loadTasks() {
    const response = await fetch("/api/tasks");
    const tasks = await response.json();

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        displayTask(task);
    });
}


// Display task
function displayTask(task) {
    const li = document.createElement("li");

    li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span>${task.text}</span>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

    const checkbox = li.querySelector("input");

    const editButton = li.querySelector(".edit-btn");

    const deleteButton = li.querySelector(".delete-btn");


    // Complete / Uncomplete task
    checkbox.addEventListener("change", async () => {

        await fetch(`/api/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: checkbox.checked
            })
        });

        loadTasks();
    });


    // Edit task
    editButton.addEventListener("click", async () => {

        const newText = prompt("Edit your task:", task.text);

        if (newText === null || newText.trim() === "") {
            return;
        }

        await fetch(`/api/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: newText.trim()
            })
        });

        loadTasks();
    });


    // Delete task
    deleteButton.addEventListener("click", async () => {

        await fetch(`/api/tasks/${task.id}`, {
            method: "DELETE"
        });

        loadTasks();
    });


    taskList.appendChild(li);
}


// Add task function
async function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text
        })
    });

    if (response.ok) {
        taskInput.value = "";
        loadTasks();
    }
}


// Click Add button
addTaskBtn.addEventListener("click", addTask);


// Press Enter to add task
taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addTask();
    }

});


// All button
allBtn.addEventListener("click", () => {

    currentFilter = "all";

    loadTasks();

});


// Active button
activeBtn.addEventListener("click", () => {

    currentFilter = "active";

    loadTasks();

});


// Completed button
completedBtn.addEventListener("click", () => {

    currentFilter = "completed";

    loadTasks();

});
// Load tasks when page opens
loadTasks();