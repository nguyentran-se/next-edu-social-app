import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Comment, CreatePostCommentPayload } from '@types';
// import { CreatePostPayload } from '@types';
import { postApis } from 'apis';
import { AxiosError } from 'axios';
import { useModalContext } from 'contexts';
import { useLazyQuery } from 'hooks';
import { useRouter } from 'next/router';
import { QueryKeys } from 'queries';
import { toast } from 'react-hot-toast';

export function useCreatePostCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePostCommentPayload) => postApis.createPostComment(body),
    onSuccess: (response) => {
      // queryClient.invalidateQueries({ queryKey: [QueryKeys.Comments] });
    },
  });
}

export function usePostCommentsQuery({
  postId,
  initialData,
}: {
  postId: string;
  initialData: Comment[];
}) {
  // return useQuery({
  //   queryKey: [QueryKeys.Posts, postId, QueryKeys.Comments],
  //   queryFn: () => postApis.getPostComments(postId),
  //   initialData,
  // });
  return useLazyQuery({
    queryKey: [QueryKeys.Posts, postId, QueryKeys.Comments],
    queryFn: () => postApis.getPostComments(postId),
    initialData,
  });
}

export function useNewFeedQuery() {
  return useQuery({
    queryKey: [QueryKeys.Posts],
    queryFn: () => postApis.getNewFeed(),
  });
}

export function usePostDetailQuery(pid: string) {
  return useQuery({
    queryKey: [QueryKeys.Posts, pid],
    queryFn: () => postApis.getPostDetail(pid),
    enabled: Boolean(pid),
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const gid = router.query?.gid;
  return useMutation<unknown, AxiosError<{ message: string }>, number>({
    mutationFn: (postId) => postApis.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Posts] });
      if (gid) {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.Groups, gid, QueryKeys.Posts] });
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data.message ||
          'Oops! Something went wrong. Please try again later or contact support if the problem persists.',
      );
    },
  });
}
