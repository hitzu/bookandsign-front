export interface GetContactMethodsResponse {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    method: string;
    rank: number;
  }