import { Router } from "express";
import * as Carts from "../db/carts.js";

export default function cartsRouter() {
  const router = Router();

  router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const allCarts = await Carts.getCarts();
    const carts = allCarts.slice((page - 1) * limit, page * limit);
    res.json({
      data: carts,
      page,
      limit,
      totalPages: Math.ceil(allCarts.length / limit),
      total: allCarts.length,
    });
  });

  router.get("/:cid", async (req, res) => {
    const cart = await Carts.getCart(req.params.cid);
    if (cart) {
      res.json({ data: cart });
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  });

  router.post("/", async (req, res) => {
    const cart = req.body;
    const createdCart = await Carts.createCart(cart);
    res.json({ data: createdCart });
  });

  router.post("/:cid/product/:pid", async (req, res) => {
    const cart = await Carts.addProductToCart(req.params.cid, req.params.pid);
    if (cart.error) {
      res.status(404).json({ error: cart.error });
      return;
    }
    res.json({ data: cart });
  });

  router.delete("/:cid", async (req, res) => {
    await Carts.deleteCart(req.params.cid);
    res.json({ data: req.params.cid });
  });

  return router;
}
