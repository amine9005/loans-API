import { Request, Response } from "express";
import ProductModel from "../models/products.model";

const addProduct = async (req: Request, res: Response) => {
  const { name, thumbnail, pictures, slag, price, quantity } = req.body;
  if (!name || !thumbnail || !pictures || !slag || !price || !quantity) {
    return res.status(400).json({ error: "all fields are required" });
  }

  new ProductModel({
    name,
    thumbnail,
    pictures,
    slag,
    price,
    quantity,
  })
    .save()
    .then((product) => {
      console.log("Successfully created new product");
      return res.status(200).json({ product });
    })
    .catch((err) => {
      console.log("Unable to create product! " + err.message);
      return res.status(500).json({ error: "Unable to create product!" });
    });
};

const getProducts = async (req: Request, res: Response) => {
  ProductModel.find()
    .then((prods) => {
      console.log("Products found");
      return res.status(200).json({ products: prods });
    })
    .catch((err) => {
      console.log("Unable to find products " + err.message);

      return res
        .status(500)
        .json({ error: "Unable to find products " + err.message });
    });
};

const getProductById = async (req: Request, res: Response) => {
  ProductModel.findById(req.params.id)
    .then((prods) => {
      console.log("Products found");
      return res.status(200).json({ product: prods });
    })
    .catch((err) => {
      console.log("Unable to find products " + err.message);

      return res
        .status(500)
        .json({ error: "Unable to find products " + err.message });
    });
};

export default { addProduct, getProducts, getProductById };
