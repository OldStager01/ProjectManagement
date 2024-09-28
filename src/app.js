import express from "express";
import config from "./config/config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import ApiError from "./utils/ApiError.js";
import {
  addActivity,
  addCurrentOutcomeValue,
  addCurrentOutputValue,
  addOutcome,
  addOutput,
} from "./controllers/project/dataCollection.js";
const app = express();

//*Middlewares
app.use(
  cors({
    origin: config.CORS_ORIGIN,
  }),
);
app.use(express.json({ limit: "16kb" })); //!Define the max incoming json size
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //!Define the max size of data from url
app.use(express.static("public"));
app.use(cookieParser());

//*Routes
// Importing Routes
import userRouter from "./routes/user.route.js";
import projectRouter from "./routes/project.route.js";
import reportRouter from "./routes/report.route.js";
app.get("/", (req, res) => {
  res.send("Hello World");
});
//! Routes as mentioned in the project document
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/reports", reportRouter);

//! Data Collection
// 1. POST /api/outcomes: Add a new outcome to a project.
app.post("/api/outcomes", addOutcome);

// 2. POST /api/outputs: Add a new output linked to an outcome.
app.post("/api/outputs", addOutput);

// 3. POST /api/activities: Add a new activity linked to an output.
app.post("/api/activities", addActivity);

// 4. GET /api/projects/:project_id/data: Retrieve all data related to a specific project.
//Inside projects route

// 5. POST /api/outcomes/:outcome_id/current-value: Update the current value of an outcome.
app.post("/api/outcomes/outcomes/currentValue", addCurrentOutcomeValue);

// 6. POST /api/outputs/:output_id/current-value: Update the current value of an output.
app.post("/api/outputs/outputs/currentValue", addCurrentOutputValue);
//!

//*Error Testing
app.get("/error-test", (req, res, next) => {
  next(new ApiError("This is a test error"));
});

//*Error Handling
app.use(errorHandler);

export default app;
