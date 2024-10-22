import fs from "fs";
import crypto from "crypto";

const TABLES_PATH = `${process.cwd()}/src/db/tables`;

export async function getAll(table) {
  const data = await fs.promises.readFile(`${TABLES_PATH}/${table}.json`);
  return JSON.parse(data);
}

export async function getItem(table, id) {
  const data = await getAll(table);
  return data[id];
}

export async function addItem(table, item) {
  const data = await getAll(table);
  item.id = getId(Object.keys(data));
  data[item.id] = item;
  data[item.id].createdAt = Date.now();
  data[item.id].updatedAt = data[item.id].createdAt;
  await fs.promises.writeFile(
    `${TABLES_PATH}/${table}.json`,
    JSON.stringify(data, null, 2)
  );
  return data[item.id];
}

export async function updateItem(table, id, item) {
  delete item.id;
  const data = await getAll(table);
  data[id] = { ...data[id], ...item };
  data[id].updatedAt = Date.now();
  await fs.promises.writeFile(
    `${TABLES_PATH}/${table}.json`,
    JSON.stringify(data, null, 2)
  );
  return data[id];
}

export async function deleteItem(table, id) {
  const data = await getAll(table);
  delete data[id];
  await fs.promises.writeFile(
    `${TABLES_PATH}/${table}.json`,
    JSON.stringify(data, null, 2)
  );
}

function getId(existingIds) {
  let id;
  do {
    id = crypto.randomBytes(16).toString("hex");
  } while (existingIds.includes(id));
  return id;
}
