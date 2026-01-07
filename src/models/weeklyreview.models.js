import mongoose, { Schema } from "mongoose";

const weeklyReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    weekStartDate: {
      type: String,
      required: true,
      index: true,
    },
    goalsCompleted: {
      type: Number,
      required: true,
      default:0,
    },
    deepworkMinutes: {
      type: Number,
      required: true,
      default: 0,
    },
    failureCount: {
      type: Number,
      required: true,
      default: 0,
    },
    summary: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

weeklyReviewSchema.index({user:1, weekStartDate:1}, {unique:true});

const WeekReview = mongoose.model("WeekReview", weeklyReviewSchema);
export default WeekReview;