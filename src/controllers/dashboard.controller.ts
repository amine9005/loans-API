import { Request, Response } from "express";
import ProductModel from "../models/products.model";
import ordersModel from "../models/orders.model";

/*
+ * Retrieves the size of the inventory.
+ *
+ * @param {Request} req - The request object.
+ * @param {Response} res - The response object.
+ * @return {Promise<void>} The size of the inventory as a JSON response.
+ */
const getInventorySize = async (req: Request, res: Response) => {
  ProductModel.find()
    .then((prods) => {
      console.log("Products found");
      return res.status(200).json({ products: prods.length });
    })
    .catch((err) => {
      console.log("Unable to find products " + err.message);
      return res
        .status(500)
        .json({ error: "Unable to find products " + err.message });
    });
};

/*
+ * Retrieves the size of the orders from the database.
+ *
+ * @param {Request} req - The request object.
+ * @param {Response} res - The response object.
+ * @return {Promise<void>} The size of the orders in the response.
*/
const getOrdersSize = async (req: Request, res: Response) => {
  ordersModel
    .find()
    .then((orders) => {
      console.log("Orders found");
      return res.status(200).json({ orders: orders.length });
    })
    .catch((err) => {
      console.log("Unable to find orders " + err.message);
      return res
        .status(500)
        .json({ error: "Unable to find orders " + err.message });
    });
};

export default {
  getInventorySize,
  getOrdersSize,
};
