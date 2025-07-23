import express from "express";
import { addToCart } from "../controllers/cart.controller.js";
import {
  protectRoute,
  updateQuantity,
  removeAllFromCart,
  getCartProducts,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.post("/:ud", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, updateQuantity);

export default router;
