import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User';



export interface ICustomizeCategoy extends Document {
    title: string;
    subtitle:string;
  user: IUser | string; 
  createdAt?: Date;
  updatedAt?: Date;
}

export const CustomizeCategoySchema: Schema = new Schema({
    title: {type:String,required:true},
  subtitle: {type:String,required:false},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });



const CustomizeCategoy: Model<ICustomizeCategoy> = mongoose.models.CustomizeCategoy || mongoose.model<ICustomizeCategoy>('CustomizeCategoy', CustomizeCategoySchema);

export default CustomizeCategoy;