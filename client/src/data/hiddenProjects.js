/**
 * Project slugs that should be hidden from the public portfolio.
 * Centralised so Home.jsx and Projects.jsx stay in sync.
 */
export const hiddenProjectSlugs = new Set([
  "e-commerce-platform",
  "task-management-app",
]);

export function filterVisibleProjects(projects) {
  return Array.isArray(projects)
    ? projects.filter((p) => !hiddenProjectSlugs.has(p.slug))
    : [];
}
