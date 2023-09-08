import { Request, Response } from "express";
import ProductModel from "../models/products.model";
import { ObjectId } from "mongodb";

const addProduct = async (req: Request, res: Response) => {
  const {
    name,
    thumbnail,
    pictures,
    slag,
    price,
    short_description,
    description,
    featured,
    quantity,
  } = req.body;

  if (
    !name ||
    !thumbnail ||
    !pictures ||
    !slag ||
    !price ||
    !quantity ||
    !short_description ||
    !description ||
    featured == undefined
  ) {
    console.log("product body: " + JSON.stringify(req.body));
    console.log("name: " + JSON.stringify(name));
    console.log("thumbnail: " + JSON.stringify(thumbnail));
    console.log("pictures: " + JSON.stringify(pictures));
    console.log("slag: " + JSON.stringify(slag));
    console.log("price: " + JSON.stringify(price));
    console.log("short_description: " + JSON.stringify(short_description));
    console.log("description: " + JSON.stringify(description));
    console.log("featured: " + JSON.stringify(featured));
    console.log("quantity: " + JSON.stringify(quantity));
    return res.status(400).json({ error: "all fields are required" });
  }
  new ProductModel({
    name,
    thumbnail,
    pictures,
    slag,
    price,
    quantity,
    short_description,
    description,
    featured,
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
        .status(404)
        .json({ error: "Unable to find products " + err.message });
    });
};

const deleteProduct = async (req: Request, res: Response) => {
  ProductModel.findByIdAndDelete(req.params.id)
    .then(() => {
      console.log("product deleted");
      return res.status(200).json({ message: "Product Deleted Successfully" });
    })
    .catch((err: Error) => {
      console.log("Unable to delete product " + err.message);
      return res
        .status(500)
        .json({ error: "Unable to delete product " + err.message });
    });
};

const updateProduct = async (req: Request, res: Response) => {
  const {
    name,
    thumbnail,
    pictures,
    slag,
    price,
    quantity,
    short_description,
    description,
    featured,
  } = req.body;
  if (
    !name ||
    !thumbnail ||
    !pictures ||
    !slag ||
    !price ||
    !quantity ||
    !short_description ||
    !description ||
    featured == undefined
  ) {
    return res.status(400).json({ error: "all fields are required" });
  }
  ProductModel.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        name,
        thumbnail,
        pictures,
        slag,
        price,
        quantity,
        short_description,
        description,
        featured,
      },
    }
  )
    .then(() => {
      console.log("product updated");
      return res.status(200).json({ message: "product updated successfully " });
    })
    .catch((err: Error) => {
      console.log("Unable to update product " + err.message);
      return res
        .status(500)
        .json({ error: "Unable to update product " + err.message });
    });
};

const addThumbnail = async (req: Request, res: Response) => {
  console.log("adding Thumbnail");
  if (req.file) {
    const path = await req.file.path;
    console.log("path: ", path);
    return res.status(200).json({ path });
  }
  return res.status(500).json({ error: "Unable to upload thumbnail" });
};

export default {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  addThumbnail,
};
