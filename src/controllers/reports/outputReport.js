import mongoose from "mongoose";
import Output from "../../models/output.model.js";

// Function to get total target vs. current output values
const getOutputSummary = async (projectId) => {
  try {
    const outputSummary = await Output.aggregate([
      {
        $match: { projectId: new mongoose.Types.ObjectId(projectId) },
      },
      {
        $group: {
          _id: "$projectId",
          name: { $first: "$name" },
          totalTargetValue: { $sum: "$targetValue" },
          totalCurrentValue: { $sum: "$currentValue" },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          projectId: "$_id",
          totalTargetValue: 1,
          totalCurrentValue: 1,
        },
      },
    ]);

    return outputSummary;
  } catch (err) {
    console.error(err);
    throw new Error("Error in aggregating output data.");
  }
};

export default getOutputSummary;
