import mongoose, { mongo, Schema } from "mongoose";
import User from "./users.models.js";

const goalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

goalSchema.index({ user: 1, date: 1, title: 1 }, { unique: true });
goalSchema.index({ user: 1, date: 1 });

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
