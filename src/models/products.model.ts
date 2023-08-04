import mongoose, { Schema, Document } from "mongoose";

export interface IProducts {
  name: string;
  thumbnail: string;
  pictures: Array<string>;
  short_description: string;
  description: string;
  slag: string;
  price: string;
  quantity: number;
  featured: boolean;
}

export interface IProductModel extends IProducts, Document {}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
  pictures: { type: Array<string>, required: true },
  slag: { type: String, required: true },
  featured: { type: Boolean, required: true },
  short_description: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

export default mongoose.model<IProductModel>("Product", ProductSchema);
