import { getRandomId } from "./getRandomId.js";

function buildNews({ title = "", text = "", url }) {
  return { title, text, url, id: getRandomId() };
}

export { buildNews };
