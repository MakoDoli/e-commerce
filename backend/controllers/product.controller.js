import { redis } from "../lib/redis.js";
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

export const getFeaturedProducts = async (req, res) => {
  try {
    // find in redis
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    // if not in redis, find in mongodb
    featuredProducts = await Product.find({ isFeatured: true }).lean(); // .lean()
    // returns javascript object instead of
    // mongodb document, which is good for
    //performance

    if (!featuredProducts) {
      return res
        .status(404)
        .json({ message: "No featured products was found" });
    }
    // because not in redis, save in redis
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (err) {
    console.log("Error in featured products", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, image, price, description, category } = req.body;
  } catch (error) {
    console.error(error);
  }
};
