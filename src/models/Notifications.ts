// /src/models/Notifications.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { IOrder } from "./order"; // interface reference

export interface INotifications extends Document {
  order: IOrder | string;
  seen: boolean;
  look: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const NotificationsSchema: Schema<INotifications> = new Schema(
  {
    // Reference the "Order" model
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    // Use Boolean for clarity
    seen: { type: Boolean, default: false },
    look: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notifications: Model<INotifications> =
  mongoose.models.Notifications ||
  mongoose.model<INotifications>("Notifications", NotificationsSchema);

export default Notifications;
