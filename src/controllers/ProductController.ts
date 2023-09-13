import { Router, Request, Response } from "express";
import { prisma } from "../models/prisma/Client";
import authMiddlleware from "../middleware/authMiddlleware";

const productController = Router();

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

productController.post(
  "/product",
  authMiddlleware,
  async (req: Request, res: Response) => {
    let { name, description, image, price } = req.body;
    
    name = capitalize(name);
    description = capitalize(description);

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
  }
);

productController.get(
  "/products",
  authMiddlleware,
  async (req: Request, res: Response) => {
    try {
      const getProducts = await prisma.product.findMany();
      res.status(200).json(getProducts);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "erro ao pegar os produtos" });
    }
  }
);

productController.put(
  "/product/:id",
  authMiddlleware,
  async (req: Request, res: Response) => {
    const productId = req.params.id;
    const { name, description, image, price } = req.body;

    try {
      const updatedProduct = await prisma.product.update({
        where: {
          id: parseInt(productId),
        },
        data: {
          name: name,
          image: image,
          description: description,
          price: price,
        },
      });

      if (!updatedProduct) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.status(200).json(updatedProduct);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Erro ao atualizar o produto." });
    }
  }
);

productController.delete(
  "/product/:id",
  authMiddlleware,
  async (req: Request, res: Response) => {
    const productId = req.params.id;

    try {
      const deletedProduct = await prisma.product.delete({
        where: {
          id: parseInt(productId),
        },
      });

      if (!deletedProduct) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.status(204).send();
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Erro ao excluir o produto." });
    }
  }
);

export default productController;
