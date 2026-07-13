import axios from 'axios';

type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
};

export type GetReviewResponse = {
  summary: string | null;
  reviews: Review[];
};

export type SummarizeResponse = {
  summary: string;
};

export const reviewsApi = {
  async fetchReviews(productId: number) {
    return axios
      .get<GetReviewResponse>(`/api/products/${productId}/reviews`)
      .then((response) => response.data);
  },
  async summarizeReviews(productId: number) {
    return axios
      .post<SummarizeResponse>(`/api/products/${productId}/reviews/summarize`)
      .then((response) => response.data);
  },
};
