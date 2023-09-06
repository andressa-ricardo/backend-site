import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import productController from "./controllers/ProductController";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(productController)

app.get("/", (req, res) => {
  res.send("rodando");
});

app.listen(PORT, () => {
  console.log("servidor rodando");
});
