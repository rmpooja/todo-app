
const { neon } = require("@neondatabase/serverless");

module.exports = async function (req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
   const id = Number(
  req.query.id || req.url.split("/").filter(Boolean).pop()
);git add "api/tasks/[id].js"
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    if (req.method === "PUT") {
      const { completed, text } = req.body || {};

      let result;

      if (typeof completed === "boolean") {
        result = await sql`
          UPDATE tasks
          SET completed = ${completed}
          WHERE id = ${id}
          RETURNING id, text, completed
        `;
      } else if (typeof text === "string" && text.trim()) {
        result = await sql`
          UPDATE tasks
          SET text = ${text.trim()}
          WHERE id = ${id}
          RETURNING id, text, completed
        `;
      } else {
        return res.status(400).json({ error: "Invalid task update" });
      }

      if (!result.length) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json(result[0]);
    }

    if (req.method === "DELETE") {
      const result = await sql`
        DELETE FROM tasks
        WHERE id = ${id}
        RETURNING id
      `;

      if (!result.length) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Individual task API error:", error);
    return res.status(500).json({ error: "Database request failed" });
  }
};
