import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User"; // Assuming IUser is defined in the User model

// Define the IBrand interface
export interface IBrand extends Document {
  _id: Types.ObjectId;
  name: string;
  place: string;
  logoUrl?: string;
  imageUrl?: string;
  user: IUser | mongoose.Types.ObjectId; // Relates to the IUser model
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Brand model
const BrandSchema: Schema<IBrand> = new Schema(
  {
    name: { type: String, required: true },
    place: { type: String, required: true },
    logoUrl: { type: String, default: null },
    imageUrl: { type: String, default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Ensures valid user reference
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Define the Brand model
const Brand: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);

export default Brand;
