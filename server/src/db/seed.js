import pool from "./index.js";
import bcrypt from "bcryptjs";

const seed = async () => {
  const client = await pool.connect();

  try {
    console.log("🌱 Starting database seeding...");

    await client.query("BEGIN");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await client.query(
      `
      INSERT INTO users (email, password, name, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `,
      ["filbertmathew63@gmail.com", hashedPassword, "Filbert Matthew", "admin"],
    );
    console.log("✅ Admin user created");

    // Create profile
    await client.query(
      `
      INSERT INTO profile (name, title, bio, bio_id, email, github_url, linkedin_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT DO NOTHING
    `,
      [
        "Filbert Matthew",
        "Full Stack Web Developer",
        "Passionate web developer with expertise in building modern, responsive, and user-friendly web applications. I love turning ideas into reality through clean code and creative solutions.",
        "Web developer yang passionate dalam membangun aplikasi web modern, responsif, dan user-friendly. Saya senang mengubah ide menjadi kenyataan melalui kode yang bersih dan solusi kreatif.",
        "filbertmathew63@gmail.com",
        "https://github.com/filbertmatthew",
        "https://linkedin.com/in/filbertmatthew",
      ],
    );
    console.log("✅ Profile created");

    // Add sample skills
    const skills = [
      { name: "React", category: "Frontend", proficiency: 90, icon: "react" },
      {
        name: "Next.js",
        category: "Frontend",
        proficiency: 85,
        icon: "nextjs",
      },
      {
        name: "TypeScript",
        category: "Language",
        proficiency: 85,
        icon: "typescript",
      },
      {
        name: "JavaScript",
        category: "Language",
        proficiency: 95,
        icon: "javascript",
      },
      { name: "Node.js", category: "Backend", proficiency: 88, icon: "nodejs" },
      {
        name: "Express.js",
        category: "Backend",
        proficiency: 85,
        icon: "express",
      },
      {
        name: "PostgreSQL",
        category: "Database",
        proficiency: 80,
        icon: "postgresql",
      },
      {
        name: "MongoDB",
        category: "Database",
        proficiency: 78,
        icon: "mongodb",
      },
      {
        name: "Tailwind CSS",
        category: "Frontend",
        proficiency: 92,
        icon: "tailwindcss",
      },
      { name: "Git", category: "Tools", proficiency: 88, icon: "git" },
      { name: "Docker", category: "Tools", proficiency: 70, icon: "docker" },
      { name: "Figma", category: "Design", proficiency: 75, icon: "figma" },
    ];

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      await client.query(
        `
        INSERT INTO skills (name, category, proficiency, icon, sort_order)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [skill.name, skill.category, skill.proficiency, skill.icon, i],
      );
    }
    console.log("✅ Skills added");

    // Add sample projects
    const projects = [
      {
        title: "E-Commerce Platform",
        title_id: "Platform E-Commerce",
        slug: "e-commerce-platform",
        description:
          "A full-featured e-commerce platform with product management, shopping cart, payment integration, and admin dashboard.",
        description_id:
          "Platform e-commerce lengkap dengan manajemen produk, keranjang belanja, integrasi pembayaran, dan dashboard admin.",
        technologies: [
          "React",
          "Node.js",
          "PostgreSQL",
          "Stripe",
          "Tailwind CSS",
        ],
        category: "Full Stack",
        featured: true,
      },
      {
        title: "Task Management App",
        title_id: "Aplikasi Manajemen Tugas",
        slug: "task-management-app",
        description:
          "A collaborative task management application with real-time updates, team features, and progress tracking.",
        description_id:
          "Aplikasi manajemen tugas kolaboratif dengan update real-time, fitur tim, dan pelacakan progres.",
        technologies: ["Next.js", "TypeScript", "MongoDB", "Socket.io"],
        category: "Web App",
        featured: true,
      },
      {
        title: "Portfolio Website",
        title_id: "Website Portfolio",
        slug: "portfolio-website",
        description:
          "Personal portfolio website showcasing projects and skills with modern design and smooth animations.",
        description_id:
          "Website portfolio personal yang menampilkan proyek dan skill dengan desain modern dan animasi halus.",
        technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
        category: "Frontend",
        featured: true,
      },
    ];

    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      await client.query(
        `
        INSERT INTO projects (title, title_id, slug, description, description_id, technologies, category, featured, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
        [
          p.title,
          p.title_id,
          p.slug,
          p.description,
          p.description_id,
          p.technologies,
          p.category,
          p.featured,
          i,
        ],
      );
    }
    console.log("✅ Projects added");

    // Add sample experience
    await client.query(
      `
      INSERT INTO experiences (company, position, position_id, description, description_id, location, start_date, is_current, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
      [
        "Freelance",
        "Full Stack Developer",
        "Full Stack Developer",
        "Building web applications for various clients using modern technologies like React, Node.js, and PostgreSQL.",
        "Membangun aplikasi web untuk berbagai klien menggunakan teknologi modern seperti React, Node.js, dan PostgreSQL.",
        "Remote",
        "2023-01-01",
        true,
        0,
      ],
    );
    console.log("✅ Experience added");

    // Add education
    await client.query(
      `
      INSERT INTO education (institution, degree, field, description, description_id, start_date, is_current, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        "University",
        "Bachelor Degree",
        "Computer Science",
        "Studying computer science with focus on software engineering and web development.",
        "Mempelajari ilmu komputer dengan fokus pada rekayasa perangkat lunak dan pengembangan web.",
        "2020-09-01",
        true,
        0,
      ],
    );
    console.log("✅ Education added");

    // Add site settings
    const settings = [
      {
        key: "site_title",
        value: "Filbert Matthew - Web Developer",
        type: "string",
      },
      {
        key: "site_description",
        value:
          "Portfolio website of Filbert Matthew, a passionate full stack web developer",
        type: "string",
      },
      { key: "primary_color", value: "#3B82F6", type: "string" },
      { key: "dark_mode_default", value: "false", type: "boolean" },
      { key: "default_language", value: "en", type: "string" },
    ];

    for (const setting of settings) {
      await client.query(
        `
        INSERT INTO settings (key, value, type)
        VALUES ($1, $2, $3)
        ON CONFLICT (key) DO NOTHING
      `,
        [setting.key, setting.value, setting.type],
      );
    }
    console.log("✅ Settings added");

    await client.query("COMMIT");
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seed().catch(console.error);
