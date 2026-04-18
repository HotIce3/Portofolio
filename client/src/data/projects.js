const featuredProjects = [
  {
    id: "financial-manage-dwivan",
    title: "Financial Manage Dwivan",
    title_id: "Financial Manage Dwivan",
    slug: "financial-manage-dwivan",
    description:
      "A smart financial planning app for tracking expenses, calculating remaining budget, and getting personalized investment recommendations.",
    description_id:
      "Aplikasi smart financial planning untuk melacak pengeluaran, menghitung sisa anggaran, dan mendapatkan rekomendasi investasi yang dipersonalisasi.",
    thumbnail: "",
    thumbnail_url: "",
    demo_url: "https://financial-manage-dwivan.vercel.app/",
    live_url: "https://financial-manage-dwivan.vercel.app/",
    github_url: "https://github.com/rvnary/Financial-Manage-Dwivan",
    tech_stack: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "TypeScript",
    ],
    technologies: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "TypeScript",
    ],
    category: "Finance",
    featured: true,
    status: "published",
    sort_order: -1,
  },
  {
    id: "financial-manage-dwivan-front-page",
    title: "Financial Manage Dwivan Front Page",
    title_id: "Front Page Financial Manage Dwivan",
    slug: "financial-manage-dwivan-front-page",
    description:
      "The landing page for Financial Manage Dwivan, a smart financial planning website for tracking expenses and getting investment recommendations.",
    description_id:
      "Halaman depan Financial Manage Dwivan, website smart financial planning untuk melacak pengeluaran dan mendapatkan rekomendasi investasi.",
    thumbnail: "",
    thumbnail_url: "",
    demo_url: "https://financial-manage-dwivan.vercel.app/",
    live_url: "https://financial-manage-dwivan.vercel.app/",
    github_url: "https://github.com/rvnary/Financial-Manage-Dwivan",
    tech_stack: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
    technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
    category: "Landing Page",
    featured: true,
    status: "published",
    sort_order: -2,
  },
];

export const mergeFeaturedProjects = (projects = []) => {
  const mergedProjects = [...featuredProjects, ...projects];
  const seen = new Set();

  return mergedProjects.filter((project) => {
    const key = project.slug || project.id;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};
