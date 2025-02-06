import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User';



export interface ICompanies extends Document {
  name: string;
  matriculefiscal:string;
  address:string;
  numtele:string
  gerantsoc:string;
  imgPattente:string;
  user: IUser | string; 
  createdAt?: Date;
  updatedAt?: Date;
}

const CompaniesSchema: Schema = new Schema({
  name: {type:String,required:true},
  matriculefiscal:{type:String,required:true},
  address:{type:String,required:true},
  numtele:{type:String,required:true},
  gerantsoc:{type:String,required:true},
  imgPattente:{type:String,required:true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });



const Companies: Model<ICompanies> = mongoose.models.Companies || mongoose.model<ICompanies>('Companies', CompaniesSchema);

export default Companies;