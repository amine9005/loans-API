import { Int32 } from "mongodb";
import mongoose, { Schema, Document } from "mongoose";

export interface IProducts {
  name: string;
  thumbnail: string;
  pictures: Array<string>;
  slag: string;
  price: string;
  quantity: Int32;
}

export interface IProductModel extends IProducts, Document {}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
  pictures: { type: Array<string>, required: true },
  slag: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Int32, required: true },
});

export default mongoose.model<IProductModel>("Product", ProductSchema);
