import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePostCommentPayload } from '@types';
import { commentApis } from 'apis';
import { AxiosError } from 'axios';
import { useModalContext } from 'contexts';
import { QueryKeys } from 'queries';
import { toast } from 'react-hot-toast';

export function useDeleteCommentMutation(postId: number) {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<{ message: string }>, number>({
    mutationFn: (commentId) => commentApis.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Posts, `${postId}`, QueryKeys.Comments],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data.message ||
          'Oops! Something went wrong. Please try again later or contact support if the problem persists.',
      );
    },
  });
}
