import { Request, Response } from "express";
import ProductModel from "../models/products.model";

const addProduct = async (req: Request, res: Response) => {
  const { name, thumbnail, pictures, slag, price, quantity } = req.body;
  if (!name || !thumbnail || !pictures || !slag || !price || !quantity) {
    return res.status(400).json({ error: "all fields are required" });
  }

  const product = new ProductModel({
    name,
    thumbnail,
    pictures,
    slag,
    price,
    quantity,
  })
    .save()
    .then(() => {
      console.log("Successfully created new product");
      return res.status(200).json({ message: "successfully added a product" });
    })
    .catch((err) => {
      console.log("Unable to create product! " + err.message);
      return res.status(500).json({ error: "Unable to create product!" });
    });
};

export default { addProduct };
