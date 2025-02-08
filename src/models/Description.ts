import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User"; // Assuming IUser is defined in the User model

// Define the IDescription interface
export interface IDescription extends Document {
  _id: Types.ObjectId;
  text: string;
type: string;
  user: IUser | mongoose.Types.ObjectId; // Relates to the IUser model
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Description model
const DescriptionSchema: Schema<IDescription> = new Schema(
  {
    text: { type: String, required: true },
    type: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Ensures valid user reference
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Define the Description model
const Description: Model<IDescription> =
  mongoose.models.Description || mongoose.model<IDescription>("Description", DescriptionSchema);

export default Description;
