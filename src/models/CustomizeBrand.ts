import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User';



export interface ICustomizeBrand extends Document {
    title: string;
    subtitle:string;
  user: IUser | string; 
  createdAt?: Date;
  updatedAt?: Date;
}

export const CustomizeBrandSchema: Schema = new Schema({
    title: {type:String,required:true},
  subtitle: {type:String,required:false},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });



const CustomizeBrand: Model<ICustomizeBrand> = mongoose.models.CustomizeBrand || mongoose.model<ICustomizeBrand>('CustomizeBrand', CustomizeBrandSchema);

export default CustomizeBrand;