import express from "express";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";

import { config } from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";

config();

const app = express();

// authentication
app.use(express.json()); //req.body parser
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
