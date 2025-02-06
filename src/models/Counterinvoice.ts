import mongoose, { Document, Model} from 'mongoose';

export interface ICounterinvoice extends Document {
  _id: string;
  name: string;
  value:number;
  createdAt: Date;
  updatedAt: Date;
}



const CounterinvoiceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
  });

const Counterinvoice: Model<ICounterinvoice> = mongoose.models.Counterinvoice || mongoose.model<ICounterinvoice>('Counterinvoice', CounterinvoiceSchema);

export default Counterinvoice;
