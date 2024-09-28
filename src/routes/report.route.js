import { Router } from "express";
import {
  exportAllReports,
  getAllProjectReports,
} from "../controllers/reports/report.controller.js";

const router = Router();

router.get("/project/:projectId", getAllProjectReports);

router.get("/export/:format", exportAllReports);

export default router;
