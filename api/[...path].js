
let tasks = [
    { id: 1, text: "Learn Node.js", completed: false }
];

let nextId = 2;

export default function handler(req, res) {
    const path = Array.isArray(req.query.path)
        ? req.query.path
        : [req.query.path].filter(Boolean);

    if (path[0] !== "tasks") {
        return res.status(404).json({ error: "Not found" });
    }

    // Get all tasks
    if (path.length === 1 && req.method === "GET") {
        return res.status(200).json(tasks);
    }

    // Add a task
    if (path.length === 1 && req.method === "POST") {
        const text = req.body?.text?.trim();

        if (!text) {
            return res.status(400).json({
                error: "Task text is required"
            });
        }

        const task = {
            id: nextId++,
            text,
            completed: false
        };

        tasks.push(task);
        return res.status(201).json(task);
    }

    const id = Number(path[1]);
    const task = tasks.find(item => item.id === id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    // Edit or complete a task
    if (path.length === 2 && req.method === "PUT") {
        if (typeof req.body?.text === "string") {
            task.text = req.body.text.trim();
        }

        if (typeof req.body?.completed === "boolean") {
            task.completed = req.body.completed;
        }

        return res.status(200).json(task);
    }

    // Delete a task
    if (path.length === 2 && req.method === "DELETE") {
        tasks = tasks.filter(item => item.id !== id);
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
}
