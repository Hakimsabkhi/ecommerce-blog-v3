import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User'; // Import the IUser interface
import { ICategory } from './Category';
export interface ISubcategory extends Document {
  name: string;
  logoUrl?:string;
  bannerUrl?:string;
  slug:string,
  category:ICategory | string,
  user: IUser | string; // Reference to a User document or User ID
  vadmin: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper function to slugify category names
const slugifySubcategoryName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, ''); // Remove any special characters
};
const SubcategorySchema: Schema = new Schema({
  name: { type: String, required: true ,unique: true },
  logoUrl: { type: String },
  bannerUrl:{type:String},
  slug: { type: String, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vadmin:{ type: String,default:'not-approve'},
},{ timestamps: true });


// Pre-save hook to generate the slug before saving the category
SubcategorySchema.pre<ISubcategory>('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugifySubcategoryName(this.name);
  }
  next();
});


const Subcategory: Model<ISubcategory> = mongoose.models.Subcategory || mongoose.model<ISubcategory>('Subcategory', SubcategorySchema);

export default Subcategory;