import express from "express";
import { body, validationResult } from "express-validator";
import { query } from "../db/index.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all projects (public)
router.get("/", async (req, res) => {
  try {
    const { featured, category, status = "published" } = req.query;

    let sql = "SELECT * FROM projects WHERE status = $1";
    const params = [status];
    let paramIndex = 2;

    if (featured === "true") {
      sql += ` AND featured = true`;
    }

    if (category) {
      sql += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    sql += " ORDER BY sort_order ASC, created_at DESC";

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single project by slug (public)
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const projectResult = await query(
      "SELECT * FROM projects WHERE slug = $1",
      [slug],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = projectResult.rows[0];

    // Get project images
    const imagesResult = await query(
      "SELECT * FROM project_images WHERE project_id = $1 ORDER BY sort_order ASC",
      [project.id],
    );

    project.images = imagesResult.rows;
    res.json(project);
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single project by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const projectResult = await query("SELECT * FROM projects WHERE id = $1", [
      id,
    ]);

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = projectResult.rows[0];

    // Get project images
    const imagesResult = await query(
      "SELECT * FROM project_images WHERE project_id = $1 ORDER BY sort_order ASC",
      [project.id],
    );

    project.images = imagesResult.rows;
    res.json(project);
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create project (admin only)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  [
    body("title").trim().isLength({ min: 2 }),
    body("slug").trim().isLength({ min: 2 }),
    body("description").trim().optional(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        title_id,
        slug,
        description,
        description_id,
        content,
        content_id,
        thumbnail,
        demo_url,
        github_url,
        tech_stack,
        category,
        featured,
        is_published,
        sort_order,
        status,
      } = req.body;

      const result = await query(
        `
      INSERT INTO projects (
        title, title_id, slug, description, description_id,
        content, content_id, thumbnail, demo_url, github_url, tech_stack,
        category, featured, is_published, sort_order, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `,
        [
          title,
          title_id,
          slug,
          description,
          description_id,
          content,
          content_id,
          thumbnail,
          demo_url,
          github_url,
          tech_stack || [],
          category,
          featured || false,
          is_published !== undefined ? is_published : true,
          sort_order || 0,
          status || "published",
        ],
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Create project error:", error);
      if (error.code === "23505") {
        return res
          .status(400)
          .json({ error: "Project with this slug already exists" });
      }
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Update project (admin only)
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      title_id,
      slug,
      description,
      description_id,
      content,
      content_id,
      thumbnail,
      demo_url,
      github_url,
      tech_stack,
      category,
      featured,
      is_published,
      sort_order,
      status,
    } = req.body;

    const result = await query(
      `
      UPDATE projects SET
        title = COALESCE($1, title),
        title_id = COALESCE($2, title_id),
        slug = COALESCE($3, slug),
        description = COALESCE($4, description),
        description_id = COALESCE($5, description_id),
        content = COALESCE($6, content),
        content_id = COALESCE($7, content_id),
        thumbnail = COALESCE($8, thumbnail),
        demo_url = COALESCE($9, demo_url),
        github_url = COALESCE($10, github_url),
        tech_stack = COALESCE($11, tech_stack),
        category = COALESCE($12, category),
        featured = COALESCE($13, featured),
        is_published = COALESCE($14, is_published),
        sort_order = COALESCE($15, sort_order),
        status = COALESCE($16, status),
        updated_at = NOW()
      WHERE id = $17
      RETURNING *
    `,
      [
        title,
        title_id,
        slug,
        description,
        description_id,
        content,
        content_id,
        thumbnail,
        demo_url,
        github_url,
        tech_stack,
        category,
        featured,
        is_published,
        sort_order,
        status,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete project (admin only)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM projects WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add image to project (admin only)
router.post("/:id/images", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, caption, sort_order } = req.body;

    const result = await query(
      `
      INSERT INTO project_images (project_id, image_url, caption, sort_order)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [id, image_url, caption, sort_order || 0],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add image error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete image (admin only)
router.delete(
  "/images/:imageId",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { imageId } = req.params;

      await query("DELETE FROM project_images WHERE id = $1", [imageId]);
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Delete image error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

export default router;
