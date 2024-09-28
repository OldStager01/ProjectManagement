import Project from "../../models/project.model.js"; // Assuming Project model is available
import OutcomeReport from "./outcomeReport.js";
import OutputReport from "./outputReport.js";
import { getMonthlyActivityProgress } from "./activityReport.js";
import asyncWrapper from "../../utils/asyncWrapper.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

// Function to generate report for all projects
const generateAllProjectReports = async () => {
  try {
    const projects = await Project.find(); // Get all projects

    // Loop through each project to generate reports
    const reports = await Promise.all(
      projects.map(async (project) => {
        const outcomes = await OutcomeReport(project._id);
        const outputs = await OutputReport(project._id);
        const activities = await getMonthlyActivityProgress(project._id);

        console.log(`Generating report for project: ${project.name}`);

        return { project, outcomes, outputs, activities };
      }),
    );

    return reports;
  } catch (err) {
    console.error("Error generating reports for all projects:", err);
    throw new Error("Error generating reports for all projects");
  }
};

// Function to generate PDF report for all projects, each on a separate page
const generatePDFReportForAllProjects = async (reportData) => {
  const doc = new PDFDocument();
  let buffers = [];

  doc.on("data", buffers.push.bind(buffers));

  return new Promise((resolve, reject) => {
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData); // Resolve the promise with the full buffer
    });

    doc.on("error", (err) => {
      console.error("Error generating PDF:", err);
      reject(err);
    });

    // Start writing the report content
    reportData.forEach((report, index) => {
      if (index > 0) doc.addPage(); // Add a new page for each project after the first

      // Handling null or undefined values for project name
      const projectName = report.project?.name || "Unnamed Project";
      doc
        .fontSize(20)
        .text(`Project Report: ${projectName}`, { align: "center" });
      doc.moveDown();

      // Add outcomes
      doc.fontSize(16).text("Outcomes");
      if (report.outcomes?.length > 0) {
        report.outcomes.forEach((outcome) => {
          const outcomeName = outcome?.name || "Unnamed Outcome";
          const currentValue = outcome?.currentValue || 0;
          const targetValue = outcome?.targetValue || 0;
          console.log(
            "currentValue:",
            currentValue,
            "targetValue:",
            targetValue,
          );
          doc
            .fontSize(12)
            .text(
              `${outcomeName}: ${currentValue}/${targetValue} (${(
                (currentValue / (targetValue || 1)) *
                100
              ).toFixed(2)}%)`,
            );
        });
      } else {
        doc.fontSize(12).text("No outcomes available.");
      }
      doc.moveDown();

      // Add outputs
      doc.fontSize(16).text("Outputs");
      if (report.outputs?.length > 0) {
        report.outputs.forEach((output) => {
          const outputName = output?.name || "Unnamed Output";
          const currentValue = output?.totalCurrentValue || 0;
          const targetValue = output?.totalTargetValue || 0;
          doc
            .fontSize(12)
            .text(
              `${outputName}: ${currentValue}/${targetValue} (${(
                (currentValue / (targetValue || 1)) *
                100
              ).toFixed(2)}%)`,
            );
        });
      } else {
        doc.fontSize(12).text("No outputs available.");
      }
      doc.moveDown();

      // Add activities
      doc.fontSize(16).text("Activities");
      doc
        .fontSize(12)
        .text(
          `Total Monthly Activities: ${report.activities[0]?.totalActivities || 0}`,
        );
      doc.moveDown();
      if (report.activities?.length > 0) {
        report.activities[0].activities.forEach((activity) => {
          const activityName = activity?.name || "Unnamed Activity";
          const startDate = activity?.startDate
            ? activity.startDate.toISOString()
            : "N/A";
          const endDate = activity?.endDate
            ? activity.endDate.toISOString()
            : "N/A";
          doc
            .fontSize(12)
            .text(`${activityName}: From ${startDate} to ${endDate}`);
        });
      } else {
        doc.fontSize(12).text("No activities available.");
      }
    });

    doc.end(); // Make sure the document is properly ended
  });
};

// Function to generate Excel report for all projects
const generateExcelReportForAllProjects = async (reportData) => {
  const workbook = new ExcelJS.Workbook();

  // Create a worksheet for each project
  reportData.forEach((report) => {
    const projectName = report.project?.name || "Unnamed Project";
    const worksheet = workbook.addWorksheet(`Project ${projectName}`);

    // Add headers for outcomes
    worksheet.addRow(["Outcomes"]);
    if (report.outcomes?.length > 0) {
      report.outcomes.forEach((outcome) => {
        const outcomeName = outcome?.name || "Unnamed Outcome";
        const currentValue = outcome?.currentValue || 0;
        const targetValue = outcome?.targetValue || 0;
        worksheet.addRow([outcomeName, currentValue, targetValue]);
      });
    } else {
      worksheet.addRow(["No outcomes available."]);
    }

    worksheet.addRow([]);
    worksheet.addRow(["Outputs"]);
    if (report.outputs?.length > 0) {
      report.outputs.forEach((output) => {
        const outputName = output?.name || "Unnamed Output";
        const currentValue = output?.totalCurrentValue || 0;
        const targetValue = output?.totalTargetValue || 0;
        worksheet.addRow([outputName, currentValue, targetValue]);
      });
    } else {
      worksheet.addRow(["No outputs available."]);
    }

    worksheet.addRow([]);
    worksheet.addRow(["Activities"]);
    if (report.activities[0].activities?.length > 0) {
      report.activities[0].activities.forEach((activity) => {
        const activityName = activity?.name || "Unnamed Activity";
        const startDate = activity?.startDate || "N/A";
        const endDate = activity?.endDate || "N/A";
        worksheet.addRow([activityName, startDate, endDate]);
      });
    } else {
      worksheet.addRow(["No activities available."]);
    }
  });

  const excelBuffer = await workbook.xlsx.writeBuffer();
  return excelBuffer;
};

// API Endpoints
const getAllProjectReports = asyncWrapper(async (req, res) => {
  const reportData = await generateAllProjectReports();
  res.json(reportData);
});

const exportAllReports = asyncWrapper(async (req, res) => {
  const format = req.params.format;
  const reportData = await generateAllProjectReports();
  let fileBuffer;

  if (format === "pdf") {
    fileBuffer = await generatePDFReportForAllProjects(reportData);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=all_projects_report.pdf",
    );
    res.send(fileBuffer); // Send the resolved buffer directly
  } else if (format === "excel") {
    fileBuffer = await generateExcelReportForAllProjects(reportData);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=all_projects_report.xlsx",
    );
    res.send(fileBuffer); // Send the resolved buffer directly
  } else {
    res.status(400).json({ error: "Invalid format specified" });
  }
});

export { getAllProjectReports, exportAllReports };
