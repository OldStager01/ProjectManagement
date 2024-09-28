import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectsById,
  updateProject,
  deleteProject,
} from "../controllers/project/index.js";
import { getData } from "../controllers/project/dataCollection.js";

const router = Router();

// 1. POST /api/projects: Endpoint to create a new project.
router.post("/", createProject);
// 2. GET /api/projects: Retrieve a list of all projects.
router.get("/", getProjects);
// 3. GET /api/projects/{id}: Retrieve a specific project by ID.
router.get("/:id", getProjectsById);
// 4. PUT /api/projects/{id}: Update project details.
router.put("/:id", updateProject);
// 5. DELETE /api/projects/{id}: Delete a project.
router.delete("/:id", deleteProject);
// 6. GET /api/projects/:project_id/data: Retrieve all data related to a specific project.
router.get("/:projectId/data", getData);

export default router;
