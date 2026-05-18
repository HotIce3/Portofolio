import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const sql = neon(process.env.DATABASE_URL);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

// Get profile
app.get("/api/profile", async (req, res) => {
  try {
    const profile = await sql`SELECT * FROM profile LIMIT 1`;
    const skills = await sql`SELECT * FROM skills ORDER BY category, name`;
    const experiences =
      await sql`SELECT * FROM experiences ORDER BY start_date DESC`;
    const education =
      await sql`SELECT * FROM education ORDER BY start_date DESC`;

    res.json({
      profile: profile[0] || null,
      skills,
      experiences,
      education,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Get skills only
app.get("/api/profile/skills", async (req, res) => {
  try {
    const skills = await sql`SELECT * FROM skills ORDER BY category, name`;
    res.json(skills);
  } catch (error) {
    console.error("Skills error:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// Get experiences
app.get("/api/profile/experiences", async (req, res) => {
  try {
    const experiences =
      await sql`SELECT * FROM experiences ORDER BY start_date DESC`;
    res.json(experiences);
  } catch (error) {
    console.error("Experiences error:", error);
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
});

// Get education
app.get("/api/profile/education", async (req, res) => {
  try {
    const education =
      await sql`SELECT * FROM education ORDER BY start_date DESC`;
    res.json(education);
  } catch (error) {
    console.error("Education error:", error);
    res.status(500).json({ error: "Failed to fetch education" });
  }
});

// Get projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await sql`
      SELECT * FROM projects 
      WHERE is_published = true 
      ORDER BY created_at DESC
    `;
    res.json(projects);
  } catch (error) {
    console.error("Projects error:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Get single project
app.get("/api/projects/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await sql`SELECT * FROM projects WHERE slug = ${slug}`;

    if (project.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const images = await sql`
      SELECT * FROM project_images 
      WHERE project_id = ${project[0].id} 
      ORDER BY display_order
    `;

    res.json({ ...project[0], images });
  } catch (error) {
    console.error("Project detail error:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Contact form
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }

    await sql`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (${name}, ${email}, ${subject || null}, ${message})
    `;

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Auth - Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // Simple password check (in production, use bcrypt)
    const bcrypt = await import("bcryptjs");
    const validPassword = await bcrypt.default.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const jwt = await import("jsonwebtoken");
    const token = jwt.default.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const jwt = await import("jsonwebtoken");
    const decoded = jwt.default.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret",
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Admin - Get all projects
app.get("/api/admin/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Admin - Create project
app.post("/api/admin/projects", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      content,
      thumbnail,
      tech_stack,
      demo_url,
      github_url,
      is_featured,
      is_published,
    } = req.body;

    const result = await sql`
      INSERT INTO projects (title, slug, description, content, thumbnail, tech_stack, demo_url, github_url, is_featured, is_published)
      VALUES (${title}, ${slug}, ${description}, ${content || null}, ${thumbnail || null}, ${tech_stack || []}, ${demo_url || null}, ${github_url || null}, ${is_featured || false}, ${is_published || false})
      RETURNING *
    `;

    res.json(result[0]);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Admin - Update project
app.put("/api/admin/projects/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      description,
      content,
      thumbnail,
      tech_stack,
      demo_url,
      github_url,
      is_featured,
      is_published,
    } = req.body;

    const result = await sql`
      UPDATE projects 
      SET title = ${title}, slug = ${slug}, description = ${description}, content = ${content || null}, 
          thumbnail = ${thumbnail || null}, tech_stack = ${tech_stack || []}, demo_url = ${demo_url || null}, 
          github_url = ${github_url || null}, is_featured = ${is_featured || false}, is_published = ${is_published || false},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Admin - Delete project
app.delete("/api/admin/projects/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM projects WHERE id = ${id}`;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Admin - Get messages
app.get("/api/admin/messages", authMiddleware, async (req, res) => {
  try {
    const messages =
      await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Admin - Update message
app.put("/api/admin/messages/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read } = req.body;

    const result = await sql`
      UPDATE contact_messages SET is_read = ${is_read} WHERE id = ${id} RETURNING *
    `;

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update message" });
  }
});

// Admin - Delete message
app.delete("/api/admin/messages/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM contact_messages WHERE id = ${id}`;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// Admin - Get profile
app.get("/api/admin/profile", authMiddleware, async (req, res) => {
  try {
    const profile = await sql`SELECT * FROM profile LIMIT 1`;
    res.json(profile[0] || null);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Admin - Update profile
app.put("/api/admin/profile", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      title,
      bio,
      avatar,
      resume_url,
      location,
      email,
      phone,
      social_links,
    } = req.body;

    const existing = await sql`SELECT id FROM profile LIMIT 1`;

    let result;
    if (existing.length > 0) {
      result = await sql`
        UPDATE profile 
        SET name = ${name}, title = ${title}, bio = ${bio || null}, avatar = ${avatar || null},
            resume_url = ${resume_url || null}, location = ${location || null}, email = ${email},
            phone = ${phone || null}, social_links = ${social_links || {}}, updated_at = NOW()
        WHERE id = ${existing[0].id}
        RETURNING *
      `;
    } else {
      result = await sql`
        INSERT INTO profile (name, title, bio, avatar, resume_url, location, email, phone, social_links)
        VALUES (${name}, ${title}, ${bio || null}, ${avatar || null}, ${resume_url || null}, 
                ${location || null}, ${email}, ${phone || null}, ${social_links || {}})
        RETURNING *
      `;
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Admin - Dashboard stats
app.get("/api/admin/stats", authMiddleware, async (req, res) => {
  try {
    const projects = await sql`SELECT COUNT(*) as count FROM projects`;
    const messages = await sql`SELECT COUNT(*) as count FROM contact_messages`;
    const unreadMessages =
      await sql`SELECT COUNT(*) as count FROM contact_messages WHERE is_read = false`;

    res.json({
      totalProjects: parseInt(projects[0].count),
      totalMessages: parseInt(messages[0].count),
      unreadMessages: parseInt(unreadMessages[0].count),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Migrate endpoint
app.get("/api/migrate", async (req, res) => {
  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        bio TEXT,
        avatar VARCHAR(500),
        resume_url VARCHAR(500),
        location VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        social_links JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        proficiency INTEGER DEFAULT 0,
        icon VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        content TEXT,
        thumbnail VARCHAR(500),
        tech_stack TEXT[] DEFAULT '{}',
        demo_url VARCHAR(500),
        github_url VARCHAR(500),
        is_featured BOOLEAN DEFAULT false,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS project_images (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        caption VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        is_current BOOLEAN DEFAULT false,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        institution VARCHAR(255) NOT NULL,
        degree VARCHAR(255),
        field VARCHAR(255),
        start_date DATE,
        end_date DATE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    res.json({ success: true, message: "Migration completed successfully" });
  } catch (error) {
    console.error("Migration error:", error);
    res.status(500).json({ error: "Migration failed", details: error.message });
  }
});

// Seed endpoint intentionally disabled. Content must be managed through the
// database/admin APIs so the runtime never serves portfolio data from code.
app.get("/api/seed", (req, res) => {
  res.status(410).json({
    error: "Seed endpoint disabled",
    message:
      "Run database seed scripts manually or manage content through admin endpoints.",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
