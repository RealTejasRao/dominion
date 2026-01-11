import mongoose, { Schema } from "mongoose";

const dailyCounterSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    goalCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

dailyCounterSchema.index({ user: 1, date: 1 }, { unique: true });

const DailyCounter = mongoose.model("DailyCounter", dailyCounterSchema);
export default DailyCounter;
