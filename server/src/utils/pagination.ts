export interface PaginationInput {
  page: number;
  limit: number;
}

export const getOffset = ({ page, limit }: PaginationInput) => (page - 1) * limit;

