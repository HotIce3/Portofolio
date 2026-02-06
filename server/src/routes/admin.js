import express from "express";
import { body, validationResult } from "express-validator";
import { query } from "../db/index.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken, isAdmin);

// Dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const [projects, messages, unreadMessages] = await Promise.all([
      query("SELECT COUNT(*) FROM projects"),
      query("SELECT COUNT(*) FROM contact_messages"),
      query("SELECT COUNT(*) FROM contact_messages WHERE is_read = false"),
    ]);

    res.json({
      totalProjects: parseInt(projects.rows[0].count),
      totalMessages: parseInt(messages.rows[0].count),
      unreadMessages: parseInt(unreadMessages.rows[0].count),
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// === SKILLS MANAGEMENT ===
router.get("/skills", async (req, res) => {
  try {
    const result = await query("SELECT * FROM skills ORDER BY sort_order ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Get skills error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post(
  "/skills",
  [
    body("name").trim().isLength({ min: 1 }),
    body("category").trim().optional(),
    body("proficiency").optional().isInt({ min: 0, max: 100 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, category, proficiency, icon, sort_order } = req.body;

      const result = await query(
        `
      INSERT INTO skills (name, category, proficiency, icon, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
        [name, category, proficiency || 80, icon, sort_order || 0],
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Create skill error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

router.put("/skills/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, proficiency, icon, sort_order } = req.body;

    const result = await query(
      `
      UPDATE skills SET
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        proficiency = COALESCE($3, proficiency),
        icon = COALESCE($4, icon),
        sort_order = COALESCE($5, sort_order)
      WHERE id = $6
      RETURNING *
    `,
      [name, category, proficiency, icon, sort_order, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update skill error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/skills/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM skills WHERE id = $1", [id]);
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// === EXPERIENCE MANAGEMENT ===
router.get("/experiences", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM experiences ORDER BY sort_order ASC, start_date DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get experiences error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/experiences", async (req, res) => {
  try {
    const {
      company,
      position,
      position_id,
      description,
      description_id,
      location,
      start_date,
      end_date,
      is_current,
      company_logo,
      sort_order,
    } = req.body;

    const result = await query(
      `
      INSERT INTO experiences (
        company, position, position_id, description, description_id,
        location, start_date, end_date, is_current, company_logo, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,
      [
        company,
        position,
        position_id,
        description,
        description_id,
        location,
        start_date,
        end_date,
        is_current || false,
        company_logo,
        sort_order || 0,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create experience error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/experiences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company,
      position,
      position_id,
      description,
      description_id,
      location,
      start_date,
      end_date,
      is_current,
      company_logo,
      sort_order,
    } = req.body;

    const result = await query(
      `
      UPDATE experiences SET
        company = COALESCE($1, company),
        position = COALESCE($2, position),
        position_id = COALESCE($3, position_id),
        description = COALESCE($4, description),
        description_id = COALESCE($5, description_id),
        location = COALESCE($6, location),
        start_date = COALESCE($7, start_date),
        end_date = $8,
        is_current = COALESCE($9, is_current),
        company_logo = COALESCE($10, company_logo),
        sort_order = COALESCE($11, sort_order)
      WHERE id = $12
      RETURNING *
    `,
      [
        company,
        position,
        position_id,
        description,
        description_id,
        location,
        start_date,
        end_date,
        is_current,
        company_logo,
        sort_order,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Experience not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update experience error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/experiences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM experiences WHERE id = $1", [id]);
    res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Delete experience error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// === EDUCATION MANAGEMENT ===
router.get("/education", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM education ORDER BY sort_order ASC, start_date DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get education error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/education", async (req, res) => {
  try {
    const {
      institution,
      degree,
      field,
      description,
      description_id,
      start_date,
      end_date,
      is_current,
      institution_logo,
      sort_order,
    } = req.body;

    const result = await query(
      `
      INSERT INTO education (
        institution, degree, field, description, description_id,
        start_date, end_date, is_current, institution_logo, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
      [
        institution,
        degree,
        field,
        description,
        description_id,
        start_date,
        end_date,
        is_current || false,
        institution_logo,
        sort_order || 0,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create education error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/education/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      institution,
      degree,
      field,
      description,
      description_id,
      start_date,
      end_date,
      is_current,
      institution_logo,
      sort_order,
    } = req.body;

    const result = await query(
      `
      UPDATE education SET
        institution = COALESCE($1, institution),
        degree = COALESCE($2, degree),
        field = COALESCE($3, field),
        description = COALESCE($4, description),
        description_id = COALESCE($5, description_id),
        start_date = COALESCE($6, start_date),
        end_date = $7,
        is_current = COALESCE($8, is_current),
        institution_logo = COALESCE($9, institution_logo),
        sort_order = COALESCE($10, sort_order)
      WHERE id = $11
      RETURNING *
    `,
      [
        institution,
        degree,
        field,
        description,
        description_id,
        start_date,
        end_date,
        is_current,
        institution_logo,
        sort_order,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Education not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update education error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/education/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM education WHERE id = $1", [id]);
    res.json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error("Delete education error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// === TESTIMONIALS MANAGEMENT ===
router.get("/testimonials", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM testimonials ORDER BY sort_order ASC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get testimonials error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/testimonials", async (req, res) => {
  try {
    const {
      name,
      position,
      company,
      content,
      content_id,
      avatar_url,
      rating,
      is_visible,
      sort_order,
    } = req.body;

    const result = await query(
      `
      INSERT INTO testimonials (
        name, position, company, content, content_id,
        avatar_url, rating, is_visible, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        name,
        position,
        company,
        content,
        content_id,
        avatar_url,
        rating || 5,
        is_visible !== false,
        sort_order || 0,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create testimonial error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/testimonials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      position,
      company,
      content,
      content_id,
      avatar_url,
      rating,
      is_visible,
      sort_order,
    } = req.body;

    const result = await query(
      `
      UPDATE testimonials SET
        name = COALESCE($1, name),
        position = COALESCE($2, position),
        company = COALESCE($3, company),
        content = COALESCE($4, content),
        content_id = COALESCE($5, content_id),
        avatar_url = COALESCE($6, avatar_url),
        rating = COALESCE($7, rating),
        is_visible = COALESCE($8, is_visible),
        sort_order = COALESCE($9, sort_order)
      WHERE id = $10
      RETURNING *
    `,
      [
        name,
        position,
        company,
        content,
        content_id,
        avatar_url,
        rating,
        is_visible,
        sort_order,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update testimonial error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/testimonials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM testimonials WHERE id = $1", [id]);
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// === SETTINGS MANAGEMENT ===
router.get("/settings", async (req, res) => {
  try {
    const result = await query("SELECT * FROM settings ORDER BY key ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { value, type } = req.body;

    const result = await query(
      `
      INSERT INTO settings (key, value, type)
      VALUES ($1, $2, $3)
      ON CONFLICT (key) 
      DO UPDATE SET value = $2, type = COALESCE($3, settings.type), updated_at = NOW()
      RETURNING *
    `,
      [key, value, type],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update setting error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
