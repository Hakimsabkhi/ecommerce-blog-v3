import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User';



export interface ICustomizeProduct extends Document {
    wbtitle: string;
    wbsubtitle:string;
    wbbanner:string;
    pctitle: string;
    pcsubtitle:string;
    pcbanner:string;
    cptitle: string;
    cpsubtitle:string;
    cpbanner:string;
  user: IUser | string; 
  createdAt?: Date;
  updatedAt?: Date;
}

export const CustomizeProductSchema: Schema = new Schema({
    wbtitle: {type:String,required:true},
  wbsubtitle: {type:String,required:false},
  wbbanner: {type:String,required:true},
  pctitle: {type:String,required:true},
  pcsubtitle: {type:String,required:false},
  pcbanner:{type:String,required:false},
  cptitle: {type:String,required:true},
  cpsubtitle: {type:String,required:false},
  cpbanner: {type:String,required:true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });



const CustomizeProduct: Model<ICustomizeProduct> = mongoose.models.CustomizeProduct || mongoose.model<ICustomizeProduct>('CustomizeProduct', CustomizeProductSchema);

export default CustomizeProduct;