const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

// Create/open database
const db = new Database("todo.db");

// Create tasks table if it doesn't exist
db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0
    )
`).run();

app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "..")));

// GET - Get all tasks
app.get("/api/tasks", (req, res) => {
    const tasks = db.prepare(`
        SELECT id, text, completed
        FROM tasks
        ORDER BY id
    `).all();

    const formattedTasks = tasks.map(task => ({
        ...task,
        completed: Boolean(task.completed)
    }));

    res.json(formattedTasks);
});

// POST - Add task
app.post("/api/tasks", (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.status(400).json({
            message: "Task text is required"
        });
    }

    const result = db.prepare(`
        INSERT INTO tasks (text, completed)
        VALUES (?, 0)
    `).run(text.trim());

    const newTask = db.prepare(`
        SELECT id, text, completed
        FROM tasks
        WHERE id = ?
    `).get(result.lastInsertRowid);

    newTask.completed = Boolean(newTask.completed);

    res.status(201).json(newTask);
});

// PUT - Edit or complete task
app.put("/api/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    const task = db.prepare(`
        SELECT id, text, completed
        FROM tasks
        WHERE id = ?
    `).get(taskId);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    if (req.body.text !== undefined) {
        db.prepare(`
            UPDATE tasks
            SET text = ?
            WHERE id = ?
        `).run(req.body.text.trim(), taskId);
    }

    if (req.body.completed !== undefined) {
        db.prepare(`
            UPDATE tasks
            SET completed = ?
            WHERE id = ?
        `).run(req.body.completed ? 1 : 0, taskId);
    }

    const updatedTask = db.prepare(`
        SELECT id, text, completed
        FROM tasks
        WHERE id = ?
    `).get(taskId);

    updatedTask.completed = Boolean(updatedTask.completed);

    res.json(updatedTask);
});

// DELETE - Delete task
app.delete("/api/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    db.prepare(`
        DELETE FROM tasks
        WHERE id = ?
    `).run(taskId);

    res.json({
        message: "Task deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});