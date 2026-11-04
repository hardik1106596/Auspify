import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof shippingAddress !== "string" ||
      !shippingAddress.trim()
    ) {
      return res.status(400).json({
        message: "Items and shipping address are required",
      });
    }

    // Validate quantities and product IDs.
    for (const item of items) {
      if (
        !mongoose.isValidObjectId(item.product) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Each item needs a valid product ID and quantity",
        });
      }
    }

    // Never trust prices or totals sent by the frontend.
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image || "",
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: shippingAddress.trim(),
      totalAmount,
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);
    return res.status(500).json({
      message: "Unable to create order",
    });
  }
};

// GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch order history",
    });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Get order error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch order",
    });
  }
};
