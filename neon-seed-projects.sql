-- Seed projects untuk database Neon PostgreSQL
-- Jalankan ini di Neon Console (https://console.neon.tech)

-- Project 1: Kopi Nusantara Brew (sesuai contoh kamu)
INSERT INTO projects (
    title, title_id, slug, description, description_id, content, content_id,
    thumbnail, demo_url, github_url, tech_stack, category, is_featured, is_published, sort_order
) VALUES (
    'Kopi Nusantara Brew',
    'Kopi Nusantara Brew',
    'kopi-nusantara-brew',
    'Website coffee shop premium dengan pengalaman kopi autentik Nusantara. Menampilkan menu, sistem pemesanan, dan desain elegan dengan tema kopi.',
    'Website coffee shop premium dengan pengalaman kopi autentik Nusantara. Menampilkan menu, sistem pemesanan, dan desain elegan dengan tema kopi.',
    'Kopi Nusantara Brew adalah website untuk coffee shop yang menawarkan pengalaman kopi premium dengan cita rasa autentik Nusantara. Website ini memiliki fitur menu interaktif, keranjang belanja, mode gelap/terang, dan desain responsif yang menawan.',
    'Kopi Nusantara Brew adalah website untuk coffee shop yang menawarkan pengalaman kopi premium dengan cita rasa autentik Nusantara. Website ini memiliki fitur menu interaktif, keranjang belanja, mode gelap/terang, dan desain responsif yang menawan.',
    'https://api.microlink.io/?url=https://website-portofolio-ivory-mu.vercel.app&screenshot=true&meta=false&embed=screenshot.url',
    'https://website-portofolio-ivory-mu.vercel.app/',
    'https://website-portofolio-ivory-mu.vercel.app/',
    ARRAY['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    'Web App',
    true,
    true,
    0
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    thumbnail = EXCLUDED.thumbnail,
    demo_url = EXCLUDED.demo_url,
    github_url = EXCLUDED.github_url,
    tech_stack = EXCLUDED.tech_stack,
    is_featured = EXCLUDED.is_featured,
    is_published = EXCLUDED.is_published;

-- Project 2: Financial Manage Dwivan
INSERT INTO projects (
    title, title_id, slug, description, description_id, content, content_id,
    thumbnail, demo_url, github_url, tech_stack, category, is_featured, is_published, sort_order
) VALUES (
    'Financial Manage Dwivan',
    'Financial Manage Dwivan',
    'financial-manage-dwivan',
    'A smart financial planning app for tracking expenses, calculating remaining budget, and getting personalized investment recommendations.',
    'Aplikasi smart financial planning untuk melacak pengeluaran, menghitung sisa anggaran, dan mendapatkan rekomendasi investasi yang dipersonalisasi.',
    'Financial Manage Dwivan is a comprehensive financial management application designed to help users track their expenses, manage budgets, and receive personalized investment recommendations. Built with modern web technologies for a seamless user experience.',
    'Financial Manage Dwivan adalah aplikasi manajemen keuangan komprehensif yang dirancang untuk membantu pengguna melacak pengeluaran, mengelola anggaran, dan mendapatkan rekomendasi investasi yang dipersonalisasi. Dibangun dengan teknologi web modern untuk pengalaman pengguna yang seamless.',
    'https://api.microlink.io/?url=https://financial-manage-dwivan.vercel.app&screenshot=true&meta=false&embed=screenshot.url',
    'https://financial-manage-dwivan.vercel.app',
    'https://github.com/HotIce3/financial-manage-dwivan',
    ARRAY['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
    'Finance',
    true,
    true,
    1
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    thumbnail = EXCLUDED.thumbnail,
    demo_url = EXCLUDED.demo_url,
    github_url = EXCLUDED.github_url,
    tech_stack = EXCLUDED.tech_stack,
    is_featured = EXCLUDED.is_featured,
    is_published = EXCLUDED.is_published;

-- Project 3: E-Commerce Platform
INSERT INTO projects (
    title, title_id, slug, description, description_id, content, content_id,
    thumbnail, demo_url, github_url, tech_stack, category, is_featured, is_published, sort_order
) VALUES (
    'E-Commerce Platform',
    'Platform E-Commerce',
    'e-commerce-platform',
    'A full-featured e-commerce platform with product management, shopping cart, payment integration, and admin dashboard.',
    'Platform e-commerce lengkap dengan manajemen produk, keranjang belanja, integrasi pembayaran, dan dashboard admin.',
    'A comprehensive e-commerce solution built with modern technologies, featuring product catalog management, shopping cart functionality, secure payment processing, and an intuitive admin dashboard for inventory management.',
    'Solusi e-commerce komprehensif yang dibangun dengan teknologi modern, menampilkan manajemen katalog produk, fungsionalitas keranjang belanja, pemrosesan pembayaran yang aman, dan dashboard admin yang intuitif untuk manajemen inventaris.',
    'https://api.microlink.io/?url=https://ecommerce-demo.vercel.app&screenshot=true&meta=false&embed=screenshot.url',
    'https://ecommerce-demo.vercel.app',
    'https://github.com/HotIce3/ecommerce-platform',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    'Full Stack',
    true,
    true,
    2
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    thumbnail = EXCLUDED.thumbnail,
    demo_url = EXCLUDED.demo_url,
    github_url = EXCLUDED.github_url,
    tech_stack = EXCLUDED.tech_stack,
    is_featured = EXCLUDED.is_featured,
    is_published = EXCLUDED.is_published;

-- Project 4: Task Management App
INSERT INTO projects (
    title, title_id, slug, description, description_id, content, content_id,
    thumbnail, demo_url, github_url, tech_stack, category, is_featured, is_published, sort_order
) VALUES (
    'Task Management App',
    'Aplikasi Manajemen Tugas',
    'task-management-app',
    'A collaborative task management application with real-time updates, team features, and progress tracking.',
    'Aplikasi manajemen tugas kolaboratif dengan update real-time, fitur tim, dan pelacakan progres.',
    'A powerful task management application designed for teams, featuring real-time collaboration, task assignment, progress tracking, and comprehensive project management tools.',
    'Aplikasi manajemen tugas yang powerful yang dirancang untuk tim, menampilkan kolaborasi real-time, penugasan tugas, pelacakan progres, dan alat manajemen proyek yang komprehensif.',
    'https://api.microlink.io/?url=https://task-app-demo.vercel.app&screenshot=true&meta=false&embed=screenshot.url',
    'https://task-app-demo.vercel.app',
    'https://github.com/HotIce3/task-management-app',
    ARRAY['Next.js', 'TypeScript', 'MongoDB', 'Socket.io'],
    'Web App',
    true,
    true,
    3
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    thumbnail = EXCLUDED.thumbnail,
    demo_url = EXCLUDED.demo_url,
    github_url = EXCLUDED.github_url,
    tech_stack = EXCLUDED.tech_stack,
    is_featured = EXCLUDED.is_featured,
    is_published = EXCLUDED.is_published;

-- Verify data
SELECT id, title, slug, is_featured, is_published, demo_url FROM projects ORDER BY sort_order;
