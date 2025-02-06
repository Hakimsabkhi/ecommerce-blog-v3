import mongoose, { Schema, Document, Model } from "mongoose";
import {IUser} from "../User";
import { IPostMainSection } from "./PostMainSectionModel";


export interface ICommentPost extends Document {
  Post:IPostMainSection|string;
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

const CommentPostSchema: Schema = new Schema(
  {
    Post:{type: mongoose.Schema.Types.ObjectId, ref: 'PostMainSection'},
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

const CommentPost: Model<ICommentPost> =
  mongoose.models.CommentPost || mongoose.model<ICommentPost>("CommentPost", CommentPostSchema);

export default CommentPost;
