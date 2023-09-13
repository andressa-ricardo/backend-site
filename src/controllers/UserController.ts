import { Router, Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { prisma } from "../models/prisma/Client";
import jwt from "jsonwebtoken";

const userController = Router();

userController.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "preencha todas as lacunas" });
  }
  const passwordHash = await hash(password, 8);
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userAlreadyExists) {
    console.log("usuario ja existe");
    return res.status(400).json({ error: "usuario ja existe" });
  }

  try {
    const createUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: passwordHash,
      },
    });
    res.status(201).json(createUser);
  } catch (e) {
    console.error(e);
    console.log("erro ao criar o usuario");
    res.status(500).json({ error: "Erro ao criar o usuário." });
  }
});

userController.post("/verify", async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if(!token){
    return res.status(401).send()
  }
  try{
    jwt.verify(token, process.env.SECRET!)
    return res.status(204).send()
  } catch {
    return res.status(401).send()
  }
})

userController.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "preencha todos as lacunas." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "usuário não encontrado." });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "senha incorreta." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET as string, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "login bem-sucedido!", token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "erro ao autenticar o usuário." });
  }
});

userController.get("/users", async (req: Request, res: Response) => {
  try {
    const getUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
    res.status(200).json(getUsers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "erro ao pegar usuarios" });
  }
});

export default userController;
