import { Post } from '@prisma/client';

export interface FetchPostsResponse {
  posts: Post[];
  lastPage: number;
  total: number;
  page: number;
}

export interface SearchParams {
  q: string;
  sort_by: string;
  page: string;
}
