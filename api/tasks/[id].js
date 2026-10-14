
const { neon } = require("@neondatabase/serverless");

module.exports = async function (req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const id = req.query.id;

    if (req.method === "PUT") {
      const updates = [];

      if (typeof req.body?.completed === "boolean") {
        updates.push(req.body.completed);
        updates.push("completed");
      }

      if (typeof req.body?.text === "string") {
        const text = req.body.text.trim();

        if (!text) {
          return res.status(400).json({
            error: "Task text cannot be empty"
          });
        }

        const result = await sql`
          UPDATE tasks
          SET text = ${text}
          WHERE id = ${id}
          RETURNING id, text, completed
        `;

        if (!result.length) {
          return res.status(404).json({ error: "Task not found" });
        }

        return res.status(200).json(result[0]);
      }

      if (updates.includes("completed")) {
        const completed = updates[0];

        const result = await sql`
          UPDATE tasks
          SET completed = ${completed}
          WHERE id = ${id}
          RETURNING id, text, completed
        `;

        if (!result.length) {
          return res.status(404).json({ error: "Task not found" });
        }

        return res.status(200).json(result[0]);
      }

      return res.status(400).json({ error: "No updates provided" });
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
