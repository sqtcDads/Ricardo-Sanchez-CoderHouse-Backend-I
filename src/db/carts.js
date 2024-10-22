import { getAll, getItem, addItem, updateItem, deleteItem } from "./utils.js";
import * as Products from "./products.js";

export async function getCarts() {
  const carts = await getAll("carts");
  return Object.values(carts).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export async function getCart(cid) {
  return getItem("carts", cid);
}

export async function createCart(cart) {
  return addItem("carts", cart);
}

export async function updateCart(cid, cart) {
  return updateItem("carts", cid, cart);
}

export async function deleteCart(cid) {
  return deleteItem("carts", cid);
}

export async function addProductToCart(cid, pid) {

  const product = await Products.getProduct(pid);
  if (!product) {
    return { error: "Product not found" };
  }
  const cart = await getCart(cid);
  const productIndex = cart.products.findIndex((p) => p.id === pid);
  if (productIndex !== -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({ id: pid, quantity: 1 });
  }
  return updateCart(cid, cart);
}
