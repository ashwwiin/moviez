import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false }, // email verification
    isApproved: { type: Boolean, default: false }, // admin approval
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
