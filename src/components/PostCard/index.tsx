import CameraAltOutlined from '@mui/icons-material/CameraAltOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Comment, CreatePostCommentPayload, Post } from '@types';
import Editor from 'components/Editor';
import UserAvatar from 'components/UserAvatar';
import dayjs from 'dayjs';
import { useWindowValue } from 'hooks';
import {
  QueryKeys,
  useCreatePostCommentMutation,
  usePostCommentsQuery,
  useUserMeQuery,
} from 'queries';
import { useEffect, useRef, useState } from 'react';
import BaseReactQuill from 'react-quill';
import PostComment from './PostComment';
import PostCardHeader from './PostCardHeader';
import { useQueryClient } from '@tanstack/react-query';
import { AiOutlineLike } from 'react-icons/ai';
import { TfiComment } from 'react-icons/tfi';
interface PostCardProps {
  data: Post;
  visibleGroup?: boolean;
}
function PostCard({ data, visibleGroup }: PostCardProps) {
  const [commentData, setCommentData] = useState('');
  const commentEditorRef = useRef<BaseReactQuill>(null);

  const screenWidth = useWindowValue({ path: 'screen.width', initialValue: 1200 });
  // TODO: setQueryData when create comment successfully!

  const createCommentMutation = useCreatePostCommentMutation();
  const userMeQuery = useUserMeQuery({ enabled: false });
  const queryClient = useQueryClient();
  const [triggerPostCommentsQuery, postCommentsQuery] = usePostCommentsQuery({
    postId: `${data.id}`,
    initialData: data.comments,
  });

  function handleKeyDown(event: KeyboardEvent) {
    const isEmptyContent = !commentData.replaceAll(/<\/*(p|br)>/g, '').trim();
    if (!commentEditorRef.current || isEmptyContent) return;
    const commentBody: CreatePostCommentPayload = {
      content: commentData,
      ownerId: userMeQuery.data!.id,
      postId: data.id,
    };
    createCommentMutation.mutate(commentBody, {
      onSuccess: (response) => {
        triggerPostCommentsQuery();
        setCommentData('');
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.Posts, `${commentBody.postId}`, QueryKeys.Comments],
        });
      },
    });
  }

  return (
    <Box sx={{ width: `calc((${screenWidth}px - 240px) / 2)`, mx: 'auto', mb: '32px' }}>
      <Paper sx={{ padding: 2 }}>
        <PostCardHeader data={data} visibleGroup={visibleGroup} />
        <Typography
          variant="body1"
          margin="12px 0"
          fontSize={16}
          dangerouslySetInnerHTML={{ __html: `${data?.content.replaceAll('&nbsp;', ' ') ?? ''}` }}
          sx={{ wordBreak: 'break-word' }}
        />
        <Box sx={{ display: 'flex' }}>
          <Typography variant="body2" marginLeft="auto">
            {postCommentsQuery.data?.length} comments
          </Typography>
        </Box>
        <Divider sx={{ margin: '4px 0' }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0 4px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Button
            variant="text"
            color="inherit"
            startIcon={<AiOutlineLike size={24} />}
            sx={{ flex: 1 }}
          >
            Like
          </Button>
          <Button
            variant="text"
            color="inherit"
            startIcon={<TfiComment size={18} style={{ transform: 'translateY(2px)' }} />}
            sx={{ flex: 1 }}
            onClick={() => commentEditorRef.current?.focus()}
          >
            Comment
          </Button>
        </Box>
        <Divider sx={{ margin: '4px 0' }} />
        {/* Comment */}
        <PostCommentList data={postCommentsQuery.data || ([] as Comment[])} postId={data.id} />
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
          <UserAvatar
            user={userMeQuery.data}
            sx={{ width: 32, height: 32, display: 'inline-flex', mr: '8px' }}
          />
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderRadius: 5, width: '100%', display: 'inline-block' }}>
              <Editor
                value={commentData}
                onChange={setCommentData}
                ref={commentEditorRef}
                className="comment-quill-editor"
                bounds=".comment-quill-editor"
                placeholder="Write a comment..."
                disableNewLineByEnter
                onKeyDown={handleKeyDown}
              />
            </Box>
            <Typography variant="body2" color="inherit" fontSize={13}>
              Press Enter to post.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default PostCard;

function PostCommentList({ data, postId }: { data: Comment[]; postId: number }) {
  return (
    <>
      {data.map((comment) => (
        <PostComment key={comment.id} data={comment} postId={postId} />
      ))}
    </>
  );
}
