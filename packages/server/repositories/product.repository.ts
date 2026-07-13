import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient, type Product } from '../generated/prisma/client';

//#region Implementation details

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
  }),
});

//#endregion

//#region Public interface

export const productRepository = {
  getProduct(productId: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id: productId },
    });
  },
};

//#endregion
