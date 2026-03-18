import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  emailVerified: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
