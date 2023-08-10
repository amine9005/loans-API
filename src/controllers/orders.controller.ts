import { Request, Response } from "express";
import ordersModel from "../models/orders.model";
import { ObjectId } from "mongodb";

const addOrder = (req: Request, res: Response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (
    itemsPrice == undefined ||
    totalPrice == undefined ||
    orderItems == undefined ||
    shippingAddress == undefined ||
    paymentMethod == undefined ||
    shippingPrice == undefined
  ) {
    console.log("itemsPrice", itemsPrice);
    console.log("totalPrice", totalPrice);
    console.log("orderItems", orderItems);
    console.log("shippingAddress", shippingAddress);
    console.log("paymentMethod", paymentMethod);
    console.log("shippingPrice", shippingPrice);

    console.log("all fields are required");
    return res.status(400).json({ error: "All fields are required" });
  }

  new ordersModel({
    itemsPrice: itemsPrice,
    totalPrice: totalPrice,
    orderItems: orderItems,
    shippingAddress: shippingAddress,
    paymentMethod: paymentMethod,
    shippingPrice: shippingPrice,
  })
    .save()
    .then((order) => {
      console.log("success: order added");
      return res.status(200).json({ order: order });
    })
    .catch((err) => {
      console.log("error: unable to add order", err);
      return res.status(500).json({ error: err });
    });
};

const getAllOrders = (req: Request, res: Response) => {
  ordersModel
    .find()
    .then((orders) => {
      return res.status(200).json({ orders });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Unable to load orders: " + err.message });
    });
};
export default { addOrder, getAllOrders };
