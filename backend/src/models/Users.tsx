import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define an interface representing a User document in MongoDB
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Build the strict Schema mapping
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// 3. Explicitly type the compiled model output as Model<IUser>
// This ensures User.findOne() is instantly recognized as a proper model method
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
