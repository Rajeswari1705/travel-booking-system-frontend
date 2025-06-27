// review.model.ts

export interface Review {
    id?: number;
    userId: number;
    packageId: string;
    comment: string;
    rating: number;
    agentResponse?: string;
  }
  