import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User'; // Import the IUser interface
export interface ICategory extends Document {
  name: string;
  logoUrl?:string;
  imageUrl?: string;
  bannerUrl?:string;
  slug:string,
  user: IUser | string; // Reference to a User document or User ID
  vadmin: string;
  numberproduct:number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper function to slugify category names
const slugifyCategoryName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, ''); // Remove any special characters
};
const CategorySchema: Schema = new Schema({
  name: { type: String, required: true ,unique: true },
  logoUrl: { type: String },
  imageUrl: { type: String },
  bannerUrl:{type:String},
  slug: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vadmin:{ type: String,default:'not-approve'},
  numberproduct:{type:Number, default: 0 }
},{ timestamps: true });


// Pre-save hook to generate the slug before saving the category
CategorySchema.pre<ICategory>('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugifyCategoryName(this.name);
  }
  next();
});


const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;