import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {
  PrismaClient,
  type Review,
  type Summary,
} from '../generated/prisma/client';
import dayjs from 'dayjs';

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

export const reviewRepository = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  storeReviewsSummary(productId: number, summary: string): Promise<Summary> {
    const now = new Date();
    const expiresAt = dayjs().add(7, 'days').toDate();
    const data = {
      content: summary,
      expiresAt,
      generatedAt: now,
      productId,
    };

    return prisma.summary.upsert({
      where: { productId },
      create: data,
      update: data,
    });
  },

  async getReviewsSummary(productId: number): Promise<string | null> {
    const summary = await prisma.summary.findFirst({
      where: {
        AND: [{ productId }, { expiresAt: { gt: new Date() } }],
      },
    });

    return summary ? summary.content : null;
  },
};

//#endregion
