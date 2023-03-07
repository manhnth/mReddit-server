export class CreatePostDto {
  authorId: number;
  title: string;
  text: string;
  subredditId?: number;
  // voteStatus: number;
}

export class FetchPostsParams {
  take: number;
  skip: number;
  page: number;
}

export class UpdatePostDto {
  title: string;
  text: string;
}
