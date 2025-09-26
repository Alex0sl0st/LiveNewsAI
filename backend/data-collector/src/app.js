import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import mainRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function notFound(req, res) {
  res.status(404).send("<h1>Not Found</h1>");
}

app.use("/", mainRouter);
app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
