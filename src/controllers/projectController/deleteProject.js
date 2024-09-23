import Project from "../../models/project.model.js";
import asyncWrapper from "../../utils/asyncWrapper.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

const deleteProject = asyncWrapper(async (req, res) => {
  const id = req?.params?.id;
  if (!id) {
    throw new ApiError(400, "Project id is required");
  }
  const deletedProject = await Project.findByIdAndDelete(id);
  if (!deletedProject) {
    throw new ApiError(404, "Project not found");
  }
  res.status(200).json(
    new ApiResponse(200, {
      deletedProject,
      message: "Project deleted successfully",
    }),
  );
});
