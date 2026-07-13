import type { Request, Response } from 'express';
import { reviewService } from '../services/review.serice';
import { productRepository } from '../repositories/product.repository';
import { reviewRepository } from '../repositories/review.repository';

//#region Implementation details

//#endregion

//#region Public interface

export const reviewController = {
  async getReviews(request: Request, response: Response) {
    const productId = Number(request.params.id);

    if (isNaN(productId)) {
      response.status(400).json({ error: 'Invalid product ID' });
      return;
    }

    const product = await productRepository.getProduct(productId);
    if (!product) {
      response.status(404).json({ error: 'Product not found' });
      return;
    }

    const reviews = await reviewRepository.getReviews(productId);
    const summary = await reviewRepository.getReviewsSummary(productId);

    response.json({
      summary,
      reviews,
    });
  },

  async summarizeReviews(request: Request, response: Response) {
    const productId = Number(request.params.id);

    if (isNaN(productId)) {
      response.status(400).json({ error: 'Invalid product ID' });
      return;
    }

    const product = await productRepository.getProduct(productId);
    if (!product) {
      response.status(404).json({ error: 'Product not found' });
      return;
    }

    const atLeastOneReview = await reviewRepository.getReviews(productId, 1);
    if (!atLeastOneReview.length) {
      response.status(400).json({ error: 'There are no reviews to summarize' });
      return;
    }

    const summary = await reviewService.summarizeReviews(productId);
    response.json({ summary });
  },
};

//#endregion
