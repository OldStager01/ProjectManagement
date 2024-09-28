import mongoose from "mongoose";
import Outcome from "../../models/outcome.model.js";
// Function to get percentage completion for outcomes
const getOutcomeCompletion = async (projectId) => {
  try {
    const outcomeCompletion = await Outcome.aggregate([
      {
        $match: { projectId: new mongoose.Types.ObjectId(projectId) },
      },
      {
        $project: {
          name: 1,
          targetValue: 1,
          currentValue: 1,
          percentageCompletion: {
            $cond: {
              if: { $eq: ["$targetValue", 0] },
              then: 0,
              else: {
                $multiply: [
                  { $divide: ["$currentValue", "$targetValue"] },
                  100,
                ],
              },
            },
          },
        },
      },
    ]);

    return outcomeCompletion;
  } catch (err) {
    console.error(err);
    throw new Error("Error in aggregating outcome data.");
  }
};

export default getOutcomeCompletion;
