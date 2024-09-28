import { Schema, model } from "mongoose";
const OutputSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    baselineValue: {
      type: Number,
      required: true,
    },
    targetValue: {
      type: Number,
      required: true,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    outcomeId: {
      type: Schema.Types.ObjectId,
      ref: "Outcome",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true },
);

const Output = model("Output", OutputSchema);

export default Output;
