import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import crypto from 'crypto';

/**
 * 1) Interface for your User document, extending mongoose.Document.
 *    - `_id` is declared as `Types.ObjectId` so that TypeScript knows
 *      exactly what type `_id` is.
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  phone: string;
  email: string;
  password?: string;
  isverified: boolean;
  verifyToken: string;
  verifyTokenExpire: Date;
  role: 'SuperAdmin' | 'Admin' | 'Visiteur';
  createdAt?: Date;
  updatedAt?: Date;
  getVerificationToken: () => string;
}

/**
 * 2) Define the schema with the IUser interface.
 */
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isverified: { type: Boolean, default: false },
    verifyToken: { type: String },
    verifyTokenExpire: { type: Date },
    role: {
      type: String,
      enum: ['SuperAdmin', 'Admin', 'Visiteur'],
      default: 'Visiteur',
    },
  },
  { timestamps: true }
);

/**
 * 3) Add methods to the schema.
 */
UserSchema.methods.getVerificationToken = function (): string {
  // Generate the token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash the token
  this.verifyToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expiration (30 minutes)
  this.verifyTokenExpire = new Date(Date.now() + 30 * 60 * 1000);

  return verificationToken;
};

/**
 * 4) Create the model using the IUser interface as a generic.
 */
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
