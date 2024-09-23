import Project from "../../models/project.model.js";
import asyncWrapper from "../../utils/asyncWrapper.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
const getProjects = asyncWrapper(async (req, res) => {
  const projects = await Project.find();
  if (!projects) {
    throw new ApiError(404, "No projects found");
  }
  res.status(200).json(
    new ApiResponse(200, {
      projects,
      message: "Projects retrieved successfully",
    }),
  );
});

const getProjectsById = asyncWrapper(async (req, res) => {
  const id = req?.params?.id;
  if (!id) {
    throw new ApiError(400, "Project id is required");
  }
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  res.status(200).json(
    new ApiResponse(200, {
      project,
      message: "Project retrieved successfully",
    }),
  );
});

export { getProjects, getProjectsById };
