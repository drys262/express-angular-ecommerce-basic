import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Client } from "@elastic/elasticsearch";
import cors from "cors";
import bodyParser from "body-parser";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;
const client = new Client({
  node: "http://localhost:9200",
});

async function main() {
  app.use(cors());
  app.use(bodyParser.json());
  app.get("/products", async (_req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
  });

  app.get("/user-cart", async (_req, res) => {
    const user = await prisma.user.findFirst({
      where: { email: "dkchavez0987@gmail.com" },
    });

    if (!user) {
      return res.json("User is not found!");
    }

    const cart = await prisma.userCart.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        userId: true,
        quantity: true,
        status: true,
        product: { select: { name: true, sku: true, price: true } },
      },
    });

    return res.json(cart);
  });
  app.post("/add-to-cart", async (req, res) => {
    const user = await prisma.user.findFirst({
      where: { email: "dkchavez0987@gmail.com" },
    });

    if (!user) {
      return res.json("User is not found!");
    }

    const userCart = await prisma.userCart.create({
      data: {
        userId: user.id,
        productId: req.body.productId,
        quantity: req.body.quantity,
      },
    });

    res.json(userCart);
  });

  app.post("/remove-to-cart", async (req, res) => {
    const user = await prisma.user.findFirst({
      where: { email: "dkchavez0987@gmail.com" },
    });

    if (!user) {
      return res.json("User is not found!");
    }

    await prisma.userCart.delete({
      where: { id: req.body.cartId },
    });

    res.json({ status: 200 });
  });

  app.get("/product/:productId", async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.send({ message: "Product ID given is not found." });
      }

      res.send(product);
    } catch (error) {
      console.log("error", error);
      res.send({ message: "Something went wrong with the request." });
    }
  });

  app.get("/search", async (req, res) => {
    const query = req.query.q;

    console.log("query here", query);
    const { body } = await client.search({
      index: "product-index",
      body: {
        query: {
          wildcard: {
            name: {
              value: `*${query}*`,
            },
          },
        },
      },
    });
    res.json(body.hits.hits.map((hit: any) => hit._source));
  });

  await app.listen(PORT);

  console.log(`Server started on http://localhost:${PORT}`);
}

main();
