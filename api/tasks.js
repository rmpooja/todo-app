
let tasks = [
  { id: 1, text: "Learn Node.js", completed: false }
];

let nextId = 2;

module.exports = function (req, res) {
  if (req.method === "GET") {
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    const text = req.body?.text?.trim();

    if (!text) {
      return res.status(400).json({ error: "Task text is required" });
    }

    const task = {
      id: nextId++,
      text,
      completed: false
    };

    tasks.push(task);
    return res.status(201).json(task);
  }

  const id = Number(req.query.id);
  const task = tasks.find(item => item.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (req.method === "PUT") {
    if (typeof req.body?.text === "string") {
      task.text = req.body.text.trim();
    }

    if (typeof req.body?.completed === "boolean") {
      task.completed = req.body.completed;
    }

    return res.status(200).json(task);
  }

  if (req.method === "DELETE") {
    tasks = tasks.filter(item => item.id !== id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
};

