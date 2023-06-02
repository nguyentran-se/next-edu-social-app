import { Owner } from './common';

export interface CreatePostCommentPayload {
  content: string;
  ownerId: string | number;
  postId: string | number;
}
export interface Comment {
  id: number;
  content: string;
  owner: Owner;
  createdDateTime: Date;
}
