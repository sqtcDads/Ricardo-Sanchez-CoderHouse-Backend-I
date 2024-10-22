import { Router } from "express";
import * as Products from "../db/products.js";

export default function productsRouter() {
  const router = Router();

  router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const allProducts = await Products.getProducts();
    const products = allProducts.slice((page - 1) * limit, page * limit);
    res.json({
      data: products,
      page,
      limit,
      totalPages: Math.ceil(allProducts.length / limit),
      total: allProducts.length,
    });
  });

  router.get("/:pid", async (req, res) => {
    const product = await Products.getProduct(req.params.pid);
    if (product) {
      res.json({ data: product });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  router.post("/", async (req, res) => {
    const product = req.body;
    const createdProduct = await Products.createProduct(product);
    res.json({ data: createdProduct });
  });

  router.put("/:pid", async (req, res) => {
    const product = req.body;
    const updatedProduct = await Products.updateProduct(
      req.params.pid,
      product
    );
    res.json({ data: updatedProduct });
  });

  router.delete("/:pid", async (req, res) => {
    await Products.deleteProduct(req.params.pid);
    res.json({ data: req.params.pid });
  });

  return router;
}
