import { getAll, getItem, addItem, updateItem, deleteItem } from "./utils.js";

export async function getProducts() {
  const products = await getAll("products");
  return Object.values(products).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export async function getProduct(pid) {
  return getItem("products", pid);
}

export async function createProduct(product) {
  return addItem("products", product);
}

export async function updateProduct(pid, product) {
  return updateItem("products", pid, product);
}

export async function deleteProduct(pid) {
  return deleteItem("products", pid);
}
