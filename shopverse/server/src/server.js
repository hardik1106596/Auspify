import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    service: "ShopVerse API",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  }),
);

const port = process.env.PORT || 5000;

app.use("/api/products", productRoutes);

async function start() {
  if (!process.env.MONGODB_URI)
    throw new Error("MONGODB_URI is missing. Create server/.env from server/.env.example.");

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
    throw new Error("JWT_SECRET must be at least 32 characters.");

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected:", mongoose.connection.name);
  app.listen(port, () => console.log(`ShopVerse API running at http://localhost:${port}`));
}

start().catch((err) => {
  console.error("Failed to start ShopVerse API:", err.message);
  process.exit(1);
});
