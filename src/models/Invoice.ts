import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';
import { IAddress } from './Address';
import { ICompanies } from './Companies';

export interface IInvoice extends Document {
  _id: string;
  ref:string;
  nborder:string;
  user: IUser | string;
  address: IAddress| string;
  companies:ICompanies | string;
  Items: Array<{
    product: Schema.Types.ObjectId;
    refproduct:string;
    name: string;
    tva:number;
    quantity: number ; // Changed to number
    image: string;
    discount:number;
    price: number;     // Changed to number
  }>;
  paymentMethod:string;
  deliveryMethod:string;
  deliveryCost:number;
  total: number;
  orderStatus: string;
  createdAt: Date;
  updatedAt: Date;
}



const InvoiceSchema : Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ref:{type: String},
    nborder:{type: String},
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    companies: { type: mongoose.Schema.Types.ObjectId, ref: 'Companies' },
    Items: [
        {
          
          product: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
          },
          refproduct:{
            type:String,
            required:true,
          },
          name: {
            type: String,
            required: true,
          },
          tva:{
            type:Number,
            required:true,
          },
          quantity: {
            type: Number,  // Changed to Number
            required: true,
          },
          image: {
            type: String,
            required: true,
          },
          discount:{
            type:Number,
          },
          price: {
            type: Number,  // Changed to Number
            required: true,
          },
        },
      ],
      paymentMethod: { // Optional field for payment method
        type: String,
      },
      deliveryMethod:{
        type:String,
        require:true,
      },
      deliveryCost:{
        type:Number,
        
      },
      total: {
        type: Number,
        required: true,
      },
     
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },

});

const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
