import mongoose, { Schema, Document, Model } from "mongoose";
import {IUser} from "./User";


export interface IReview extends Document {
product:string;
  rating: number;
  text?: string;
  email: string;
  name: string;
  reply:string;
  user: IUser | string;
  createdAt?: Date;
  updatedAt?: Date;
  likes: Array<IUser | string>; // Array of user IDs
    dislikes: Array<IUser | string>; // Array of user IDs
}

const ReviewSchema: Schema = new Schema(
  {
    product:{type:String,require:true},
    rating: { type: Number, required: true },
    text: { type: String, required: true },
    email: { type: String, require: true },
    name: { type: String, require: true },
    reply:{type:String,},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] }, // Array of ObjectIds referencing User model
   dislikes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] }, // Array of ObjectIds referencing User model
  },
  { timestamps: true }
);

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
