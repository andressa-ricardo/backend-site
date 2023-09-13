import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import productController from "./controllers/ProductController";
import userController from "./controllers/UserController";
import dotenv from "dotenv"

const app = express();
const PORT = 3000;
dotenv.config()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(productController)
app.use(userController)

export const auth = {
  secret: String(process.env.SECRET),
  expires: '1h',
};

app.get("/", (req, res) => {
  res.send("rodando");
});

app.listen(PORT, () => {
  console.log("servidor rodando");
});
