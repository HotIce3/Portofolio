import express from "express";
import { query } from "../db/index.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get profile (public)
router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM profile LIMIT 1");

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update profile (admin only)
router.put("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      title,
      bio,
      bio_id,
      email,
      phone,
      location,
      avatar_url,
      resume_url,
      github_url,
      linkedin_url,
      twitter_url,
      instagram_url,
      website_url,
    } = req.body;

    // Check if profile exists
    const existing = await query("SELECT id FROM profile LIMIT 1");

    let result;
    if (existing.rows.length === 0) {
      // Create new profile
      result = await query(
        `
        INSERT INTO profile (
          name, title, bio, bio_id, email, phone, location,
          avatar_url, resume_url, github_url, linkedin_url,
          twitter_url, instagram_url, website_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `,
        [
          name,
          title,
          bio,
          bio_id,
          email,
          phone,
          location,
          avatar_url,
          resume_url,
          github_url,
          linkedin_url,
          twitter_url,
          instagram_url,
          website_url,
        ],
      );
    } else {
      // Update existing profile
      result = await query(
        `
        UPDATE profile SET
          name = COALESCE($1, name),
          title = COALESCE($2, title),
          bio = COALESCE($3, bio),
          bio_id = COALESCE($4, bio_id),
          email = COALESCE($5, email),
          phone = COALESCE($6, phone),
          location = COALESCE($7, location),
          avatar_url = COALESCE($8, avatar_url),
          resume_url = COALESCE($9, resume_url),
          github_url = COALESCE($10, github_url),
          linkedin_url = COALESCE($11, linkedin_url),
          twitter_url = COALESCE($12, twitter_url),
          instagram_url = COALESCE($13, instagram_url),
          website_url = COALESCE($14, website_url),
          updated_at = NOW()
        WHERE id = $15
        RETURNING *
      `,
        [
          name,
          title,
          bio,
          bio_id,
          email,
          phone,
          location,
          avatar_url,
          resume_url,
          github_url,
          linkedin_url,
          twitter_url,
          instagram_url,
          website_url,
          existing.rows[0].id,
        ],
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all skills (public)
router.get("/skills", async (req, res) => {
  try {
    const { category } = req.query;

    let sql = "SELECT * FROM skills";
    const params = [];

    if (category) {
      sql += " WHERE category = $1";
      params.push(category);
    }

    sql += " ORDER BY sort_order ASC, proficiency DESC";

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Get skills error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all experiences (public)
router.get("/experiences", async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM experiences 
      ORDER BY is_current DESC, start_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Get experiences error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all education (public)
router.get("/education", async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM education 
      ORDER BY is_current DESC, start_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Get education error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get testimonials (public)
router.get("/testimonials", async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM testimonials 
      WHERE is_visible = true
      ORDER BY sort_order ASC, created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Get testimonials error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
