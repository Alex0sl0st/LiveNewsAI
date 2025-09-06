import express from "express";
import cors from "cors";
import mainRouter from "./routes/index.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api", mainRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
