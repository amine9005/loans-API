import { Request, Response } from "express";
import ProductModel from "../models/products.model";
import ordersModel from "../models/orders.model";
import productsModel from "../models/products.model";

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

const getSalesData = async (req: Request, res: Response) => {
  const { filter } = req.params;

  try {
    if (filter === "1W") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7
      );
      // console.log("date: ", targetDate);
      // console.log("target day: ", targetDate.getDate());
      // console.log("target time: ", targetDate.getHours());
      await ordersModel
        .find({ dateCreated: { $gte: targetDate }, status: "shipped" })
        .then((orders) => {
          console.log("Orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    } else if (filter === "1M") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        currentDate.getDate()
      );
      await ordersModel
        .find({ dateCreated: { $gte: targetDate }, status: "shipped" })
        .then((orders) => {
          console.log("Orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    } else if (filter === "YTD") {
      const currentDate = new Date();
      const targetDate = new Date(currentDate.getFullYear(), 0, 0);
      await ordersModel
        .find({ dateCreated: { $gte: targetDate }, status: "shipped" })
        .then((orders) => {
          console.log("Orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    } else if (filter === "1Y") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      await ordersModel
        .find({ dateCreated: { $gte: targetDate }, status: "shipped" })
        .then((orders) => {
          console.log("Orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    } else if (filter === "3Y") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear() - 3,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      await ordersModel
        .find({ dateCreated: { $gte: targetDate }, status: "shipped" })
        .then((orders) => {
          console.log("Orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    } else if (filter === "5Y") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear() - 5,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      await ordersModel
        .find({ dateCreated: { $gte: targetDate }, status: "shipped" })
        .then((orders) => {
          console.log("Orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    } else if (filter === "ALL") {
      await ordersModel
        .find()
        .then((orders) => {
          console.log("Orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Unable to find orders Unknown Filter: ", err });
  }
};

const getInventoryData = async (req: Request, res: Response) => {
  const { filter } = req.params;

  try {
    if (filter === "1W") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7
      );
      // console.log("date: ", targetDate);
      // console.log("target day: ", targetDate.getDate());
      // console.log("target time: ", targetDate.getHours());
      await productsModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((products) => {
          console.log("Products found");
          return res.status(200).json({ products: products });
        })
        .catch((err) => {
          console.log("Unable to find Products " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find Products " + err.message });
        });
    } else if (filter === "1M") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        currentDate.getDate()
      );
      await productsModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((products) => {
          console.log("Products found");
          return res.status(200).json({ products: products });
        })
        .catch((err) => {
          console.log("Unable to find Products " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find Products " + err.message });
        });
    } else if (filter === "YTD") {
      const currentDate = new Date();
      const targetDate = new Date(currentDate.getFullYear(), 0, 0);
      await productsModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((products) => {
          console.log("Products found");
          return res.status(200).json({ products: products });
        })
        .catch((err) => {
          console.log("Unable to find products " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find products " + err.message });
        });
    } else if (filter === "1Y") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      await productsModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((products) => {
          console.log("Products found");
          return res.status(200).json({ products: products });
        })
        .catch((err) => {
          console.log("Unable to find Products " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find Products " + err.message });
        });
    } else if (filter === "3Y") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear() - 3,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      await productsModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((products) => {
          console.log("products found");
          return res.status(200).json({ products: products });
        })
        .catch((err) => {
          console.log("Unable to find products " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find products " + err.message });
        });
    } else if (filter === "5Y") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear() - 5,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      await productsModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((products) => {
          console.log("products found");
          return res.status(200).json({ products: products });
        })
        .catch((err) => {
          console.log("Unable to find products " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find products " + err.message });
        });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Unable to find Products Unknown Filter: ", err });
  }
};
const getOrdersData = async (req: Request, res: Response) => {
  const { filter } = req.params;

  try {
    if (filter === "1W") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7
      );
      // console.log("date: ", targetDate);
      // console.log("target day: ", targetDate.getDate());
      // console.log("target time: ", targetDate.getHours());
      await ordersModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((orders) => {
          console.log("orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find Products " + err.message });
        });
    } else if (filter === "1M") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        currentDate.getDate()
      );
      await ordersModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((orders) => {
          console.log("orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    } else if (filter === "YTD") {
      const currentDate = new Date();
      const targetDate = new Date(currentDate.getFullYear(), 0, 0);
      await ordersModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((orders) => {
          console.log("Orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    } else if (filter === "1Y") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      await ordersModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((orders) => {
          console.log("Orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    } else if (filter === "3Y") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear() - 3,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      await ordersModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((orders) => {
          console.log("Orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    } else if (filter === "5Y") {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear() - 5,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      await ordersModel
        .find({ dateCreated: { $gte: targetDate } })
        .then((orders) => {
          console.log("Orders found");
          return res.status(200).json({ orders: orders });
        })
        .catch((err) => {
          console.log("Unable to find orders " + err.message);
          return res
            .status(404)
            .json({ error: "Unable to find orders " + err.message });
        });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Unable to find Products Unknown Filter: ", err });
  }
};
export default {
  getInventorySize,
  getOrdersSize,
  getSalesData,
  getInventoryData,
  getOrdersData,
};
