export interface ApiResponse {
    success: boolean;
    message: string;
    data: any; // Use a more specific type if the data structure is consistent
  }