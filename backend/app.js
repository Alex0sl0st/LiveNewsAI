import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

function getAllNews(req, res) {
  res.json(["News1", "News2"]);
}

app.get("/api/news", getAllNews);

app.use((req, res) => res.send("Not found"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
