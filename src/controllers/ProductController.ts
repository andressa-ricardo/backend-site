import { Router, Request, Response } from "express";
import { prisma } from "../models/prisma/Client";

const productController = Router();

productController.post("/product", async (req: Request, res: Response) => {
  const { name, description, image, price } = req.body;
  if (!name || !description || !image || !price) {
    return res.status(400).json({ error: "Preencha todas as lacunas" });
  }
  try {
    const postProduct = await prisma.product.create({
      data: {
        name: name,
        image: image,
        description: description,
        price: price,
      },
    });
    res.status(201).json(postProduct);
  } catch (e) {
    console.error(e);
    console.log("erro ao postar o produto");
    res.status(500).json({ error: "Erro ao postar o produto." });
  }
});

export default productController;