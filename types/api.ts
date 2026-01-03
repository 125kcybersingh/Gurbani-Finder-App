/**
 * API response type definitions
 */

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface SearchResponse {
  results: any[];
  query: string;
  mode: string;
  count: number;
}

export interface RecognitionResponse {
  success: boolean;
  text?: string;
  confidence?: number;
  shabadId?: number;
  lineId?: number;
  error?: string;
}

