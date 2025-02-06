import mongoose, { Document, Model, Schema } from 'mongoose';
import crypto from 'crypto'; // For generating random strings
import { IUser } from './User';
import { IAddress } from './Address';

// Define the IOrder interface extending Mongoose's Document
export interface IOrder extends Document {
  ref: string;
  user: IUser | string;
  address: IAddress | string;
  orderItems: Array<{
    product: Schema.Types.ObjectId;
    refproduct: string;
    name: string;
    tva: number;
    quantity: number;
    image: string;
    discount: number;
    price: number;
  }>;
  paymentMethod: string;
  deliveryMethod: string;
  deliveryCost: number;
  total: number;
  orderStatus: string;
  statustimbre: boolean;
  statusinvoice: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Order schema
const OrderSchema = new Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ref: { type: String },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    orderItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        refproduct: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        tva: { type: Number, required: true },
        image: { type: String, required: true },
        discount: { type: Number, default: 0 },
        price: { type: Number, required: true },
      },
    ],
    paymentMethod: { type: String },
    deliveryMethod: { type: String, required: true },
    deliveryCost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    orderStatus: { type: String, default: 'Processing' },
    statustimbre: { type: Boolean, default: true },
    statusinvoice: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save hook to generate random `ref` if not provided
OrderSchema.pre<IOrder>('save', function (next) {
  if (!this.ref) {
    const randomRef = crypto.randomBytes(4).toString('hex'); // 8-character hex string
    this.ref = `ORDER-${randomRef}`;
  }
  next();
});

// Define the Order model
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;