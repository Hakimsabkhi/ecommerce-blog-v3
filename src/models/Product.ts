import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './User';  // Import the IUser interface
import { ICategory } from './Category';  // Import the ICategory interface
import { IBrand } from './Brand';  // Import the IBrand interface
import { IBoutique } from './Boutique';
import { ISubcategory } from './Subcategory';

// Interface for the product document
export interface IProduct extends Document {
  name: string;
  info: string;
  description?: string;
  ref: string;
  price: number;
  tva:number;
  imageUrl?: string;
  images?: string[];
  material?: string;
  color?: string;
  dimensions?: string;
  warranty?: string;
  category: ICategory | string;  // Reference to a category document or category ID
  subcategory: ISubcategory | string | null; 
  boutique: IBoutique | string | null; 
  brand?: IBrand | string | null;  // Reference to a brand document, brand ID, or null
  stock: number;
  user: IUser | string;  // Reference to a User document or User ID
  discount?: number;
  weight?: string;
  status: string;
  statuspage: string;
  vadmin: string;
  slug: string;
  nbreview:number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper function to slugify product names
const slugifyProductName = (name: string, ref: string): string => {
  return `${name.toLowerCase().replace(/ /g, '-')}-${ref.toLowerCase().replace(/ /g, '-')}`;
};

// Define the product schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  info: { type: String, required: true },
  description: { type: String },
  ref: { type: String, required: true, unique: true },  // Ensure `ref` is unique
  material: { type: String },
  dimensions: { type: String },
  color: { type: String },
  warranty: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory',  default: null  }, 
  boutique: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique', default: null  },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', default: null },  // Brand can be null or an ObjectId
  stock: { type: Number, required: true, min: 0 },  // Ensure stock is a non-negative number
  price: { type: Number, required: true, min: 0 },  // Ensure price is a non-negative number
  tva:{ type: Number, default: 0, min: 0, max: 100 },
  discount: { type: Number, default: 0, min: 0, max: 100 },  // Discount should be a percentage between 0 and 100
  weight: { type: String },
  status: { type: String, default: 'in stock' },  // Enum for status
  statuspage: { type: String, default: 'none' },
  vadmin: { type: String,  default: 'not-approve' },  // Enum for admin approval
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Ensure product is associated with a user
  imageUrl: { type: String },
  images: [{ type: String }],  // Array of image URLs
  slug: { type: String, unique: true },  // Ensure `slug` is unique
  nbreview:{type:Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to generate the slug before saving the product
ProductSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isModified('ref')) {
    this.slug = slugifyProductName(this.name, this.ref);
  }
  next();
});



// Create and export the Product model
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
