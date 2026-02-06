import express from "express";
import { body, validationResult } from "express-validator";
import { query } from "../db/index.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Submit contact message (public)
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 2, max: 255 }),
    body("email").isEmail().normalizeEmail(),
    body("subject").trim().optional().isLength({ max: 255 }),
    body("message").trim().isLength({ min: 10, max: 5000 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;

      const result = await query(
        `
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at
    `,
        [name, email, subject, message],
      );

      // TODO: Send email notification to admin

      res.status(201).json({
        message: "Message sent successfully! I will get back to you soon.",
        id: result.rows[0].id,
      });
    } catch (error) {
      console.error("Contact submit error:", error);
      res
        .status(500)
        .json({ error: "Failed to send message. Please try again." });
    }
  },
);

// Get all messages (admin only)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { is_read } = req.query;

    let sql = "SELECT * FROM contact_messages";
    const params = [];

    if (is_read !== undefined) {
      sql += " WHERE is_read = $1";
      params.push(is_read === "true");
    }

    sql += " ORDER BY created_at DESC";

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single message (admin only)
router.get("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query("SELECT * FROM contact_messages WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get message error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Mark message as read (admin only)
router.patch("/:id/read", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read } = req.body;

    const result = await query(
      "UPDATE contact_messages SET is_read = $1 WHERE id = $2 RETURNING *",
      [is_read !== false, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update message error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete message (admin only)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM contact_messages WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get unread count (admin only)
router.get("/stats/unread", authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await query(
      "SELECT COUNT(*) FROM contact_messages WHERE is_read = false",
    );
    res.json({ unread: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
