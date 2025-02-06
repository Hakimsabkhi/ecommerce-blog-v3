import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";

export interface IAddress extends Document {
  governorate: string;
  city: string;
  address: string;
  zipcode:string;
  user: IUser | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AddressSchema: Schema = new Schema(
  {
    governorate: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: { type: String ,required: true},
    address: { type: String ,required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Address: Model<IAddress> =
  mongoose.models.Address || mongoose.model<IAddress>("Address", AddressSchema);

export default Address;
