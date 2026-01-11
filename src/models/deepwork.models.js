import mongoose, { Schema } from "mongoose";

const deepworkSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: null,
    },
    interrupted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

deepworkSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { isActive: true } },
);

const Deepwork = mongoose.model("Deepwork", deepworkSchema);
export default Deepwork;
