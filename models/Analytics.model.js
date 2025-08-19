import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalJobsPosted: {
      type: Number,
      default: 0,
    },
    totalApplicationsReceived: {
      type: Number,
      default: 0,
    },
    totalHired: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Analytics", analyticsSchema);
