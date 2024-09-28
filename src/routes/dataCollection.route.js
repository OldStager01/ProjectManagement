/*************  ✨ Codeium Command ⭐  *************/
// Import necessary modules
import { Router } from "express";
import {
  addOutcome,
  addOutput,
  addActivity,
} from "../controllers/dataCollection.controller/index.js";

const router = Router();

// 1. POST /api/outcomes: Add a new outcome to a project.
router.post("/outcomes", addOutcome);

// 2. POST /api/outputs: Add a new output linked to an outcome.
router.post("/outputs", addOutput);

// 3. POST /api/activities: Add a new activity linked to an output.
router.post("/activities", addActivity);

// 4. GET /api/projects/:project_id/data: Retrieve all data related to a specific project.
router.get("/projects/:project_id/data", getAllData);

// 5. POST /api/outcomes/:outcome_id/current-value: Update the current value of an outcome.
router.post("/outcomes/outcomes/current-value", addCurrentOutcomeValue);

// 6. POST /api/outputs/:output_id/current-value: Update the current value of an output.
router.post("/outputs/outputs/current-value", addCurrentOutputValue);

export default router;
