import Project from "../../models/project.model.js";
import User from "../../models/user.model.js";
import asyncWrapper from "../../utils/asyncWrapper.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
const createProject = asyncWrapper(async (req, res) => {
  //Destructure data from req body
  const {
    name,
    description,
    startDate,
    endDate,
    geographicalScope,
    stakeholders,
  } = req.body;

  //Validate data
  if (
    [
      name,
      description,
      startDate,
      endDate,
      geographicalScope,
      stakeholders,
    ].some((field) => {
      if (!field) {
        return true;
      }
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //Parse dates
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  if (startDate > endDate) {
    throw new ApiError(400, "Start date cannot be greater than end date");
  }

  //Checking if valid stakeholder (stakeholderId) are provided
  const promises = stakeholders.map(async (stakeholder) => {
    if (!stakeholder) {
      throw new ApiError(400, "Invalid stakeholders");
    }
    const user = await User.findById(stakeholder);
    if (!user) {
      throw new ApiError(404, "Stakeholder not found");
    }
  });

  await Promise.all(promises);

  //Create project
  const project = await Project.create({
    name,
    description,
    startDate,
    endDate,
    geographicalScope,
    stakeholders,
  });

  //Checking if project is created
  if (!project) {
    throw new ApiError(500, "Failed to create project");
  }

  res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

export { createProject };
