import { CreatePostCommentPayload, CreateGroupPayload, Group, User } from '@types';
import axiosClient from './axiosClient';

export const commentApis = {
  createComment: (body: CreatePostCommentPayload) => axiosClient.post('/comment', body),
  deleteComment: (commentId: number) => axiosClient.delete(`/comment/${commentId}`),
};
