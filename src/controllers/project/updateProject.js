import Project from "../../models/project.model.js";
import asyncWrapper from "../../utils/asyncWrapper.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

const updateProject = asyncWrapper(async (req, res) => {
  const id = req?.params?.id;
  const {
    name,
    description,
    startDate,
    endDate,
    geographicalScope,
    stakeholders,
  } = req.body;
  if (!id) {
    throw new ApiError(400, "Project id is required");
  }
  //Find the not null fields
  const updatedProject = Object.entries({
    name,
    description,
    startDate,
    endDate,
    geographicalScope,
    stakeholders,
  }).reduce((acc, [key, value]) => {
    if (value != null) {
      // This checks for both null and undefined
      acc[key] = value;
    }
    return acc;
  }, {});

  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  project.set(updatedProject);
  await project.save();

  res.status(200).json(
    new ApiResponse(200, {
      project,
      message: "Project updated successfully",
    }),
  );
});

export default updateProject;
