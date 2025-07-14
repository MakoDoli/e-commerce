import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    res.json({ products });
  } catch (err) {
    console.log("Error in getProducts controller", err.message);

    res.status(500).json({ message: "Server error", error: err.message });
  }
};
