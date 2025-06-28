// src/app/models/review.model.ts

import { AgentResponse } from './agent-response.model'; // <--- ADD THIS LINE

export interface Review {
  reviewId: number;
  comment: string;
  packageId: number;
  rating: number;
  timestamp: string;
  userId: number;
  agentResponse?: AgentResponse | null; // This now correctly refers to the imported interface
}