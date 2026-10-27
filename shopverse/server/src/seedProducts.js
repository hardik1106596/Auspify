
import mongoose from "mongoose";
import dotenv from "dotenv";

import Product from "./models/Product.js";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const fs = require("node:fs");
const path = require("node:path");

dotenv.config();

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const dataPath = path.resolve("../src/data.js");
    const content = fs.readFileSync(dataPath, "utf8");

    const productSection = content.match(
      /export const products\s*=\s*(\[[\s\S]*?\]);/
    );

    if (!productSection) {
      throw new Error("Could not find products in src/data.js");
    }

    // data.js is a local project file containing the demo array.
    const demoProducts = Function(
      `"use strict"; return (${productSection[1]});`
    )();

    let added = 0;
    let skipped = 0;

    for (const item of demoProducts) {
      const exists = await Product.exists({
        name: item.name,
        category: item.category,
      });

      if (exists) {
        skipped++;
        continue;
      }

      await Product.create({
        name: item.name,
        description: `ShopVerse ${item.category} collection`,
        price: item.price,
        category: item.category,
        image: item.image,
        stock: 10,
        featured: item.tag === "Best seller",
      });

      added++;
    }

    console.log(`Added ${added} products. Skipped ${skipped} existing products.`);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();
