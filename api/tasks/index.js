
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

  return res.status(405).json({ error: "Method not allowed" });
};
