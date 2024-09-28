import OutcomeReport from "./outcomeReport.js";
import OutputReport from "./outputReport.js";
import { getMonthlyActivityProgress } from "./activityReport.js";
import asyncWrapper from "../../utils/asyncWrapper.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

const generateProjectReport = async (projectId) => {
  try {
    const outcomes = await OutcomeReport(projectId);
    const outputs = await OutputReport(projectId);
    const activities = await getMonthlyActivityProgress(projectId);

    return { outcomes, outputs, activities };
  } catch (err) {
    console.error(err);
    throw new Error("Error generating project report");
  }
};

// Function to generate PDF report
const generatePDFReport = (reportData) => {
  const doc = new PDFDocument();
  let buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    return pdfData;
  });

  doc.fontSize(20).text("Project Report", { align: "center" });
  doc.moveDown();

  // Add outcomes
  doc.fontSize(16).text("Outcomes");
  reportData.outcomes.forEach((outcome) => {
    doc
      .fontSize(12)
      .text(
        `${outcome.name}: ${outcome.currentValue}/${outcome.targetValue} (${((outcome.currentValue / outcome.targetValue) * 100).toFixed(2)}%)`,
      );
  });
  doc.moveDown();

  // Add outputs
  doc.fontSize(16).text("Outputs");
  reportData.outputs.forEach((output) => {
    doc
      .fontSize(12)
      .text(
        `${output.name}: ${output.currentValue}/${output.targetValue} (${((output.currentValue / output.targetValue) * 100).toFixed(2)}%)`,
      );
  });
  doc.moveDown();

  // Add activities
  doc.fontSize(16).text("Activities");
  reportData.activities.forEach((activity) => {
    doc
      .fontSize(12)
      .text(
        `${activity.name}: From ${activity.startDate} to ${activity.endDate}`,
      );
  });

  doc.end();
  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(buffers));
    doc.on("error", reject);
  });
};

// Function to generate Excel report
const generateExcelReport = async (reportData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Project Report");

  // Add headers
  worksheet.addRow(["Outcomes"]);
  reportData.outcomes.forEach((outcome) => {
    worksheet.addRow([outcome.name, outcome.currentValue, outcome.targetValue]);
  });

  worksheet.addRow([]);
  worksheet.addRow(["Outputs"]);
  reportData.outputs.forEach((output) => {
    worksheet.addRow([output.name, output.currentValue, output.targetValue]);
  });

  worksheet.addRow([]);
  worksheet.addRow(["Activities"]);
  reportData.activities.forEach((activity) => {
    worksheet.addRow([activity.name, activity.startDate, activity.endDate]);
  });

  const excelBuffer = await workbook.xlsx.writeBuffer();
  return excelBuffer;
};

// API Endpoints
const getProjectReport = asyncWrapper(async (req, res) => {
  const projectId = req.params.projectId;
  const reportData = await generateProjectReport(projectId);
  res.json(reportData);
});

const exportReport = asyncWrapper(async (req, res) => {
  const projectId = req.params.projectId;
  const format = req.params.format;
  const reportData = await generateProjectReport(projectId);
  let fileBuffer;

  if (format === "pdf") {
    fileBuffer = await generatePDFReport(reportData);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=project_report.pdf",
    );
    res.send(Buffer.concat(fileBuffer));
  } else if (format === "excel") {
    fileBuffer = await generateExcelReport(reportData);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=project_report.xlsx",
    );
    res.send(fileBuffer);
  } else {
    res.status(400).json({ error: "Invalid format specified" });
  }
});

export { getProjectReport, exportReport };
