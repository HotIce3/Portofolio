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
    thumbnail:
      "https://api.microlink.io/?url=https://financial-manage-dwivan.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
    thumbnail_url:
      "https://api.microlink.io/?url=https://financial-manage-dwivan.vercel.app&screenshot=true&meta=false&embed=screenshot.url",
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
