import Outcome from "../../models/outcome.model.js";
import Output from "../../models/output.model.js";
import Activity from "../../models/activity.model.js";
import Project from "../../models/project.model.js";
import asyncWrapper from "../../utils/asyncWrapper.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

const addOutcome = asyncWrapper(async (req, res) => {
  const { name, description, baselineValue, targetValue, projectId } = req.body;

  if (
    !name ||
    !description ||
    baselineValue == null ||
    targetValue == null ||
    !projectId
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (baselineValue >= targetValue) {
    throw new ApiError(400, "Baseline value must be less than target value");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const outcome = await Outcome.create({
    name,
    description,
    baselineValue,
    targetValue,
    projectId,
  });

  res.status(201).json(
    new ApiResponse(201, {
      outcome,
      message: "Outcome created successfully",
    }),
  );
});

const addOutput = asyncWrapper(async (req, res) => {
  const { name, description, baselineValue, targetValue, outcomeId } = req.body;

  if (
    !name ||
    !description ||
    baselineValue == null ||
    targetValue == null ||
    !outcomeId
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (baselineValue >= targetValue) {
    throw new ApiError(400, "Baseline value must be less than target value");
  }

  const outcome = await Outcome.findById(outcomeId);
  if (!outcome) {
    throw new ApiError(404, "Outcome not found");
  }

  const project = await Project.findById(outcome.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const output = await Output.create({
    name,
    description,
    baselineValue,
    targetValue,
    outcomeId,
    projectId: outcome.projectId,
  });

  res.status(201).json(
    new ApiResponse(201, {
      output,
      message: "Output created successfully",
    }),
  );
});

const addActivity = asyncWrapper(async (req, res) => {
  const { name, description, startDate, endDate, outputId } = req.body;

  if (!name || !description || !startDate || !endDate || !outputId) {
    throw new ApiError(400, "All fields are required");
  }

  const output = await Output.findById(outputId);
  if (!output) {
    throw new ApiError(404, "Output not found");
  }

  const project = await Project.findById(output.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  if (startDate > endDate) {
    throw new ApiError(400, "Start date must be before end date");
  }

  if (startDate < project.startDate || endDate > project.endDate) {
    throw new ApiError(
      400,
      "Start date must be within the project's start date and end date",
    );
  }

  if (startDate < output.startDate || endDate > output.endDate) {
    throw new ApiError(
      400,
      "Start date must be within the output's start date and end date",
    );
  }

  if (startDate > output.endDate || endDate < output.startDate) {
    throw new ApiError(400, "Activity must be within the output's duration");
  }

  const activity = await Activity.create({
    name,
    description,
    startDate,
    endDate,
    outputId,
    projectId: output.projectId,
  });

  res.status(201).json(
    new ApiResponse(201, {
      activity,
      message: "Activity created successfully",
    }),
  );
});

const getData = asyncWrapper(async (req, res) => {
  const projectId = req.params.projectId;
  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  let outcomes = [],
    outputs = [],
    activities = [];
  outcomes = await Outcome.find({ projectId });
  if (outcomes.length > 0) {
    outputs = await Output.find({
      outcomeId: { $in: outcomes.map((o) => o._id) },
    });
  }
  if (outputs.length > 0) {
    activities = await Activity.find({
      outputId: { $in: outputs.map((o) => o._id) },
    });
  }

  const data = {
    outcomes,
    outputs,
    activities,
  };

  res.status(200).json(
    new ApiResponse(200, {
      data,
      message: "Data retrieved successfully",
    }),
  );
});

const addCurrentOutcomeValue = asyncWrapper(async (req, res) => {
  const { outcomeId, value } = req.body;
  if (!outcomeId || !value) {
    throw new ApiError(400, "Outcome id and value are required");
  }
  const outcome = await Outcome.findById(outcomeId);
  if (!outcome) {
    throw new ApiError(404, "Outcome not found");
  }
  outcome.currentValue = value;
  await outcome.save();
  res.status(200).json(
    new ApiResponse(200, {
      outcome,
      message: "Current outcome value updated successfully",
    }),
  );
});

const addCurrentOutputValue = asyncWrapper(async (req, res) => {
  const { outputId, value } = req.body;
  if (!outputId || !value) {
    throw new ApiError(400, "Output id and value are required");
  }
  const output = await Output.findById(outputId);
  if (!output) {
    throw new ApiError(404, "Output not found");
  }
  output.currentValue = value;
  await output.save();
  res.status(200).json(
    new ApiResponse(200, {
      output,
      message: "Current output value updated successfully",
    }),
  );
});

export {
  addOutcome,
  addOutput,
  addActivity,
  getData,
  addCurrentOutcomeValue,
  addCurrentOutputValue,
};
