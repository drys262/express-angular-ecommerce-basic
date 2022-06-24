import { PrismaClient, Prisma } from "@prisma/client";
import { Client } from "@elastic/elasticsearch";

const prisma = new PrismaClient();
const client = new Client({
  node: "http://localhost:9200",
});

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Dylan",
    email: "dkchavez0987@gmail.com",
  },
];

const productData: Prisma.ProductCreateInput[] = [
  {
    name: "Samsung TV",
    sku: "tv1",
    price: 2000,
  },
  {
    name: "iPhone",
    sku: "iphone",
    price: 1200,
  },
  {
    name: "Acer Laptop",
    sku: "acerlaptop",
    price: 3000,
  },
  {
    name: "MSI Laptop",
    sku: "msilaptop",
    price: 4000,
  },
  {
    name: "Razer Keyboard",
    sku: "razerkeyboard",
    price: 200,
  },
];

async function main() {
  console.log(`Start seeding ...`);

  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.userCart.deleteMany({});

  for (const data of userData) {
    const user = await prisma.user.create({ data });
    console.log(`Created user with id: ${user.id}`);
  }

  for (const data of productData) {
    const product = await prisma.product.create({ data });
    console.log(`Created product with id: ${product.id}`);
    await client.index({
      index: "product-index",
      body: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
      },
    });
  }

  await client.indices.refresh({ index: "product-index" });
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
