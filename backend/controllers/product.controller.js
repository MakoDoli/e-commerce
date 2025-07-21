import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

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
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: cloudinaryResponse?.secure_url || "",
    });

    res.status(201).json({ product });
  } catch (error) {
    console.log("Error creating product", error.message);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.log("Error deleting image from cloudinary", error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json("Product deleted successfully");
  } catch (error) {
    console.log("Error deleting product", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
        },
      },
    ]);
    res.json({ products });
  } catch (error) {
    console.log("Error getting recommended products", error);
    res.status(500).json({
      message: "Error getting recommended products",
      error: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category: category });
  try {
  } catch (error) {
    console.log(error);
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(res.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductCache();
    } else {
      res.status(404).json({ message: "No Product Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating featured product",
      error: error.message,
    });
  }
};

async function updateFeaturedProductCache() {
  try {
    // lean() returns javascript object instead mongoose document
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function", error);
  }
}
