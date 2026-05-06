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
        title: "Kopi Nusantara Brew",
        title_id: "Kopi Nusantara Brew",
        slug: "kopi-nusantara-brew",
        description: "Website coffee shop premium dengan pengalaman kopi autentik Nusantara. Menampilkan menu, sistem pemesanan, dan desain elegan dengan tema kopi.",
        description_id: "Website coffee shop premium dengan pengalaman kopi autentik Nusantara. Menampilkan menu, sistem pemesanan, dan desain elegan dengan tema kopi.",
        content: "Kopi Nusantara Brew adalah website untuk coffee shop yang menawarkan pengalaman kopi premium dengan cita rasa autentik Nusantara. Website ini memiliki fitur menu interaktif, keranjang belanja, mode gelap/terang, dan desain responsif yang menawan.",
        content_id: "Kopi Nusantara Brew adalah website untuk coffee shop yang menawarkan pengalaman kopi premium dengan cita rasa autentik Nusantara. Website ini memiliki fitur menu interaktif, keranjang belanja, mode gelap/terang, dan desain responsif yang menawan.",
        thumbnail: "https://api.microlink.io/?url=https://website-portofolio-ivory-mu.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
        demo_url: "https://website-portofolio-ivory-mu.vercel.app/",
        github_url: "https://website-portofolio-ivory-mu.vercel.app/",
        tech_stack: ["React", "Tailwind CSS", "Framer Motion", "Vite"],
        category: "Web App",
        featured: true,
        is_published: true,
      },
      {
        title: "Financial Manage Dwivan",
        title_id: "Financial Manage Dwivan",
        slug: "financial-manage-dwivan",
        description:
          "A smart financial planning app for tracking expenses, calculating remaining budget, and getting personalized investment recommendations.",
        description_id:
          "Aplikasi smart financial planning untuk melacak pengeluaran, menghitung sisa anggaran, dan mendapatkan rekomendasi investasi yang dipersonalisasi.",
        content: "Financial Manage Dwivan is a comprehensive financial management application designed to help users track their expenses, manage budgets, and receive personalized investment recommendations. Built with modern web technologies for a seamless user experience.",
        content_id: "Financial Manage Dwivan adalah aplikasi manajemen keuangan komprehensif yang dirancang untuk membantu pengguna melacak pengeluaran, mengelola anggaran, dan mendapatkan rekomendasi investasi yang dipersonalisasi. Dibangun dengan teknologi web modern untuk pengalaman pengguna yang seamless.",
        thumbnail: "https://api.microlink.io/?url=https://financial-manage-dwivan.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
        demo_url: "https://financial-manage-dwivan.vercel.app",
        github_url: "https://github.com/HotIce3/financial-manage-dwivan",
        tech_stack: [
          "React",
          "Vite",
          "Tailwind CSS",
          "Framer Motion",
          "TypeScript",
        ],
        category: "Finance",
        featured: true,
        is_published: true,
      },
      {
        title: "E-Commerce Platform",
        title_id: "Platform E-Commerce",
        slug: "e-commerce-platform",
        description:
          "A full-featured e-commerce platform with product management, shopping cart, payment integration, and admin dashboard.",
        description_id:
          "Platform e-commerce lengkap dengan manajemen produk, keranjang belanja, integrasi pembayaran, dan dashboard admin.",
        content: "A comprehensive e-commerce solution built with modern technologies, featuring product catalog management, shopping cart functionality, secure payment processing, and an intuitive admin dashboard for inventory management.",
        content_id: "Solusi e-commerce komprehensif yang dibangun dengan teknologi modern, menampilkan manajemen katalog produk, fungsionalitas keranjang belanja, pemrosesan pembayaran yang aman, dan dashboard admin yang intuitif untuk manajemen inventaris.",
        thumbnail: "https://api.microlink.io/?url=https://ecommerce-demo.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
        demo_url: "https://ecommerce-demo.vercel.app",
        github_url: "https://github.com/HotIce3/ecommerce-platform",
        tech_stack: [
          "React",
          "Node.js",
          "PostgreSQL",
          "Stripe",
          "Tailwind CSS",
        ],
        category: "Full Stack",
        featured: true,
        is_published: true,
      },
      {
        title: "Task Management App",
        title_id: "Aplikasi Manajemen Tugas",
        slug: "task-management-app",
        description:
          "A collaborative task management application with real-time updates, team features, and progress tracking.",
        description_id:
          "Aplikasi manajemen tugas kolaboratif dengan update real-time, fitur tim, dan pelacakan progres.",
        content: "A powerful task management application designed for teams, featuring real-time collaboration, task assignment, progress tracking, and comprehensive project management tools.",
        content_id: "Aplikasi manajemen tugas yang powerful yang dirancang untuk tim, menampilkan kolaborasi real-time, penugasan tugas, pelacakan progres, dan alat manajemen proyek yang komprehensif.",
        thumbnail: "https://api.microlink.io/?url=https://task-app-demo.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
        demo_url: "https://task-app-demo.vercel.app",
        github_url: "https://github.com/HotIce3/task-management-app",
        tech_stack: ["Next.js", "TypeScript", "MongoDB", "Socket.io"],
        category: "Web App",
        featured: true,
        is_published: true,
      },
    ];

    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      await client.query(
        `
        INSERT INTO projects (title, title_id, slug, description, description_id, content, content_id, thumbnail, demo_url, github_url, tech_stack, category, featured, is_published, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `,
        [
          p.title,
          p.title_id,
          p.slug,
          p.description,
          p.description_id,
          p.content,
          p.content_id,
          p.thumbnail,
          p.demo_url,
          p.github_url,
          p.tech_stack,
          p.category,
          p.featured,
          p.is_published,
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
