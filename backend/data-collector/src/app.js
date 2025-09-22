import "dotenv/config";
import express from "express";

import mainRouter from "./routes/index.js";

const app = express();
const PORT = process.env.PORT;

function notFound(req, res) {
  res.status(404).send("<h1>Not Found</h1>");
}

app.use("/", mainRouter);
app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
