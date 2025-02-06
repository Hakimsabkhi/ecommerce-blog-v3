import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from '../User'; // Import the IUser interface
export interface IPostCategory extends Document {
  name: string;
  slug: string;
  user: IUser | string; // Reference to a User document or User ID
  vadmin:string;
  createdAt?: Date;
  updatedAt?: Date;
}
const slugifyBlogName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, ''); // Remove any special characters
};
 const PostCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  vadmin:{ type: String,default:'not-approve'},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });

PostCategorySchema.pre<IPostCategory>('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugifyBlogName(this.name);
  }
  next();
});

const PostCategory: Model<IPostCategory> = mongoose.models.PostCategory || mongoose.model<IPostCategory>('PostCategory',PostCategorySchema);

export default PostCategory;