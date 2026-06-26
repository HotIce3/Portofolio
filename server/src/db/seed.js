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
        "Passionate Full Stack Developer building modern web apps with a focus on performance, clean UI, and reliable backends. Experienced in React, Node.js, and cloud deployment.",
        "Full Stack Developer yang bersemangat membangun aplikasi web modern dengan fokus pada performa, UI yang rapi, dan backend yang andal. Berpengalaman di React, Node.js, dan cloud deployment.",
        "filbertmathew63@gmail.com",
        "https://github.com/filbertmatthew",
        "https://linkedin.com/in/filbertmatthew",
      ],
    );
    console.log("✅ Profile created");

    // Add sample skills
    const existingSkills = await client.query("SELECT id FROM skills LIMIT 1");
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

    if (existingSkills.rows.length === 0) {
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
    } else {
      console.log("ℹ️ Skills already exist, skipping");
    }

    // Add sample projects
    const projects = [
      {
        title: "UMKM Growth Copilot AI",
        title_id: "UMKM Growth Copilot AI",
        slug: "umkm-growth-copilot",
        description:
          "AI-powered business consulting platform for Indonesian SMEs. Powered by Groq LLM with realtime chat, promotional image generator, KPI Generator, Campaign Planner, Content Calendar AI, Break-Even Analyzer, and Loan Readiness Score.",
        description_id:
          "Platform AI konsultasi bisnis untuk UMKM Indonesia. Chat realtime, generator gambar promosi, KPI Generator, Campaign Planner, Content Calendar AI, Break-Even Analyzer, dan Loan Readiness Score.",
        content:
          "UMKM Growth Copilot is an AI assistant designed to help Indonesian Micro, Small, and Medium Enterprises (MSMEs) grow faster. The platform leverages Groq LLM to provide intelligent, context-aware real-time business consulting.\n\nKey Features:\n• Realtime AI chat + promotional image generator mode\n• Configurable persona, tone, language, sector & business scale context\n• Automatic local storage of consultation history\n• Export consultations to Markdown files\n• 6 ready-to-use prompt templates for various business needs\n• Session statistics & token usage estimation\n• KPI Generator & Campaign Planner\n• Content Calendar AI for content strategy\n• Break-Even Analyzer & Cashflow Alert\n• Product Bundling Recommender\n• Customer Persona Builder\n• Loan Readiness Score for capital loan preparation\n• Team Collaboration Workspace",
        content_id:
          "UMKM Growth Copilot adalah asisten AI khusus untuk membantu UMKM Indonesia bertumbuh lebih cepat. Platform ini memanfaatkan Groq LLM untuk konsultasi bisnis realtime yang cerdas.\n\nFitur Utama:\n• Chat AI realtime + mode generator gambar promosi\n• Konteks persona, tone, bahasa, sektor & skala usaha\n• Penyimpanan riwayat konsultasi otomatis\n• Export ke Markdown\n• 6 template prompt siap pakai\n• KPI Generator & Campaign Planner\n• Content Calendar AI\n• Break-Even Analyzer & Cashflow Alert\n• Product Bundling Recommender\n• Customer Persona Builder\n• Loan Readiness Score\n• Team Collaboration Workspace",
        thumbnail:
          "https://api.microlink.io/?url=https://umkm-growth-copilot.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
        demo_url: "https://umkm-growth-copilot.vercel.app/",
        github_url: "https://github.com/Filbert-Lab/UMKM-Growth-Copilot",
        tech_stack: ["Next.js", "Tailwind CSS", "Groq API", "Hugging Face"],
        category: "AI / Web App",
        featured: true,
        is_published: true,
      },
      {
        title: "Codex Coffeeshop",
        title_id: "Codex Coffeeshop",
        slug: "codex-coffeeshop",
        description:
          "A modern full-stack coffee shop POS application with admin panel, sales dashboard analytics, JWT + OAuth authentication, and PostgreSQL via Neon.",
        description_id:
          "Aplikasi POS coffee shop full-stack modern dengan admin panel, dashboard analytics penjualan, autentikasi JWT + OAuth, dan dukungan PostgreSQL via Neon.",
        content:
          "Codex Coffeeshop is a modern full-stack coffee shop POS application featuring a customer-facing menu with live search, cart management, and checkout with promo validation. The admin panel includes a sales dashboard with revenue charts, top products, order management, and full CRUD for products, categories, orders, users, and promos. Authentication supports JWT (email-password) and OAuth 2.0 (Google & GitHub) via Passport.js.",
        content_id:
          "Codex Coffeeshop adalah aplikasi POS coffee shop full-stack modern dengan menu customer yang dilengkapi live search, manajemen keranjang, dan checkout dengan validasi promo. Admin panel dilengkapi dashboard penjualan dengan grafik revenue, produk terlaris, manajemen pesanan, dan CRUD lengkap untuk produk, kategori, pesanan, pengguna, dan promo. Autentikasi mendukung JWT (email-password) dan OAuth 2.0 (Google & GitHub) via Passport.js.",
        thumbnail:
          "https://api.microlink.io/?url=https://codex-coffeeshop.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
        demo_url: "https://codex-coffeeshop.vercel.app/",
        github_url: "https://github.com/Filbert-Lab/Codex-Coffeeshop",
        tech_stack: ["React", "Vite", "Tailwind CSS", "Express.js", "Sequelize", "PostgreSQL"],
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
        content:
          "Financial Manage Dwivan is a comprehensive financial management application designed to help users track their expenses, manage budgets, and receive personalized investment recommendations. Built with modern web technologies for a seamless user experience.",
        content_id:
          "Financial Manage Dwivan adalah aplikasi manajemen keuangan komprehensif yang dirancang untuk membantu pengguna melacak pengeluaran, mengelola anggaran, dan mendapatkan rekomendasi investasi yang dipersonalisasi. Dibangun dengan teknologi web modern untuk pengalaman pengguna yang seamless.",
        thumbnail:
          "https://api.microlink.io/?url=https://financial-manage-dwivan.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
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
        content:
          "A comprehensive e-commerce solution built with modern technologies, featuring product catalog management, shopping cart functionality, secure payment processing, and an intuitive admin dashboard for inventory management.",
        content_id:
          "Solusi e-commerce komprehensif yang dibangun dengan teknologi modern, menampilkan manajemen katalog produk, fungsionalitas keranjang belanja, pemrosesan pembayaran yang aman, dan dashboard admin yang intuitif untuk manajemen inventaris.",
        thumbnail:
          "https://api.microlink.io/?url=https://ecommerce-demo.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
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
        content:
          "A powerful task management application designed for teams, featuring real-time collaboration, task assignment, progress tracking, and comprehensive project management tools.",
        content_id:
          "Aplikasi manajemen tugas yang powerful yang dirancang untuk tim, menampilkan kolaborasi real-time, penugasan tugas, pelacakan progres, dan alat manajemen proyek yang komprehensif.",
        thumbnail:
          "https://api.microlink.io/?url=https://task-app-demo.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
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
        ON CONFLICT (slug) DO NOTHING
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
    const existingExperience = await client.query(
      "SELECT id FROM experiences LIMIT 1",
    );
    if (existingExperience.rows.length === 0) {
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
    } else {
      console.log("ℹ️ Experience already exists, skipping");
    }

    // Add education
    const existingEducation = await client.query(
      "SELECT id FROM education LIMIT 1",
    );
    if (existingEducation.rows.length === 0) {
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
    } else {
      console.log("ℹ️ Education already exists, skipping");
    }

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
