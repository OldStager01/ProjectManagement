import { Schema, model } from "mongoose";

const OutcomeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
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
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
});

const Outcome = model("Outcome", OutcomeSchema);

export default Outcome;
