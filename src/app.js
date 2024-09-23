import express from "express";
import config from "./config/config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import { ApiError } from "./utils/ApiError.js";
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
app.get("/", (req, res) => {
  res.send("Hello World");
});

//*Error Testing
app.get("/error-test", (req, res, next) => {
  next(new ApiError("This is a test error"));
});

//*Error Handling
app.use(errorHandler);

export default app;
