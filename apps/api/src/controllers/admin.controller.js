import { listProjectsByOwner } from "../repositories/project.repository.js";
import { listUsers } from "../repositories/user.repository.js";

export async function adminOverview(_req, res) {
  const [users, projects] = await Promise.all([listUsers(), listProjectsByOwner(null, "admin")]);

  res.json({
    totals: {
      users: users.length,
      projects: projects.length
    },
    users,
    recentProjects: projects.slice(0, 10)
  });
}
