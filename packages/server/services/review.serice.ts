import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';

//#region Implementation details

//#endregion

//#region Public interface

export const reviewService = {
  async summarizeReviews(productId: number): Promise<string> {
    const existingSummary = await reviewRepository.getReviewsSummary(productId);
    if (existingSummary) {
      return existingSummary;
    }

    const reviews = await reviewRepository.getReviews(productId, 10);
    const joinedReviews = reviews.map((r) => r.content).join('\n\n');
    const summary = await llmClient.summarizeReview(joinedReviews);

    await reviewRepository.storeReviewsSummary(productId, summary);

    return summary;
  },
};

//#endregion
