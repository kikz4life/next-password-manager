import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      iv : { type: String, required: true },
      content: { type: String, required: true },
    }
  },
  { timestamps: true }
)

export const Password = mongoose.models.Password || mongoose.model("Password", passwordSchema);