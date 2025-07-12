import express from "express";

import authRoutes from "./routes/auth.route.js";

import { config } from "dotenv";
import { connectDB } from "./lib/db.js";

config();

const app = express();

// authentication
app.use(express.json()); //req.body parser

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
