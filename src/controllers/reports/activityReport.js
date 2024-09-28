import mongoose from "mongoose";
import Activity from "../../models/activity.model.js";

// Function to get monthly progress of activities
const getMonthlyActivityProgress = async (projectId) => {
  try {
    const monthlyProgress = await Activity.aggregate([
      {
        $match: { projectId: new mongoose.Types.ObjectId(projectId) },
      },
      {
        $group: {
          _id: { $month: "$startDate" }, // Group by month
          totalActivities: { $sum: 1 }, // Count the number of activities
          activities: { $push: "$$ROOT" }, // Store activity details for reference
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalActivities: 1,
          activities: 1,
        },
      },
    ]);

    return monthlyProgress;
  } catch (err) {
    console.error(err);
    throw new Error("Error in aggregating activity data.");
  }
};

// Function to get quarterly progress of activities
const getQuarterlyActivityProgress = async (projectId) => {
  try {
    const quarterlyProgress = await Activity.aggregate([
      {
        $match: { projectId: mongoose.Types.ObjectId(projectId) },
      },
      {
        $group: {
          _id: {
            year: { $year: "$startDate" },
            quarter: { $ceil: { $divide: [{ $month: "$startDate" }, 3] } },
          },
          totalActivities: { $sum: 1 }, // Count the number of activities
          activities: { $push: "$$ROOT" }, // Store activity details for reference
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          quarter: "$_id.quarter",
          totalActivities: 1,
          activities: 1,
        },
      },
    ]);

    return quarterlyProgress;
  } catch (err) {
    console.error(err);
    throw new Error("Error in aggregating activity data.");
  }
};

export { getMonthlyActivityProgress, getQuarterlyActivityProgress };
