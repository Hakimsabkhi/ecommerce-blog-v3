import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../User';
import {IPostCategory} from './PostCategory'
export interface Postsecondsubsection {
    secondtitle: string;
    description:string;
    imageUrl?: string; // Image URL for subtitlesubtitle
  }
export interface Postfirstsubsection {
    fisttitle: string;
    description:string;
    Postsecondsubsections: Postsecondsubsection[];
    imageUrl?: string; // Image URL for subtitle
  }
export interface IPostMainSection extends Document {
    title: string;
    description: string;
    imageUrl: string;
    vadmin:string;
    postcategory: IPostCategory | string; 
    user: IUser | string; 
    numbercomment:number;
    Postfirstsubsections: Postfirstsubsection[]; // Reference to bloggers
}
// Helper function to slugify category names
const slugifyBlogName = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, ''); // Remove any special characters
  };
  const PostsecondsubsectionSchema = new Schema<Postsecondsubsection>({
    secondtitle: { type: String, required: true },
    description:{type:String,required: false},
    imageUrl: { type: String, required: false }, // Optional field for the image URL
  });

  const PostfirstsubsectionSchema = new Schema<Postfirstsubsection>({
    fisttitle: { type: String, required: true },
    description:{type:String,required: false},
    Postsecondsubsections: { type: [PostsecondsubsectionSchema], required: false, default: [] },
    imageUrl: { type: String, required: false }, // Optional field for the image URL
  });

const PostMainSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index:true
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    slug: { type: String, unique: true },
    Postfirstsubsections: {type: [PostfirstsubsectionSchema], required: false, default: [] }, // Change this to an array
    vadmin:{ type: String,default:'not-approve'},
    postcategory:{ type: mongoose.Schema.Types.ObjectId, ref: 'PostCategory' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    numbercomment:{type:Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
});
PostMainSectionSchema.pre('save', function (next) {
    if (this.isModified('title')) {
      this.slug = slugifyBlogName(this.title);
    }
    next();
  });

// Export the model
const PostMainSection: Model<IPostMainSection> = mongoose.models.PostMainSection || mongoose.model<IPostMainSection>('PostMainSection', PostMainSectionSchema);

export default PostMainSection;
