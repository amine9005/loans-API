import mongoose, { Schema, Document } from "mongoose";

export interface IOrder {
  orderItems: Array<string>;
  shippingAddress: string;
  paymentMethod: string;
  itemsPrice: Array<number>;
  shippingPrice: number;
  totalPrice: number;
}

export interface IOrderModel extends IOrder, Document {}

const OrderSchema = new Schema({
  orderItems: { type: Array<string>, required: true },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  itemsPrice: { type: Array<number>, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

export default mongoose.model<IOrderModel>("Order", OrderSchema);
