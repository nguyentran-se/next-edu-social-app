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
import Link from 'next/link';
import { useCreatePostCommentMutation, useDeleteCommentMutation, useUserMeQuery } from 'queries';
import { useEffect, useRef, useState } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import Popper from '@mui/material/Popper';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
const defaultButtonStyle: ButtonProps = {
  size: 'small',
  variant: 'text',
  sx: {
    ':hover': {
      backgroundColor: 'unset',
      textDecoration: 'underline',
    },
    color: '#65676B',
    fontWeight: 600,
    width: 'fit-content',
    minWidth: 'unset',
    height: '20px',
    p: 0,
  },
  disableTouchRipple: true,
};
export default function PostComment({ data, postId }: { data: Comment; postId: number }) {
  const [postMoreAnchorEle, setPostMoreAnchorEle] = useState<HTMLElement | null>(null);

  const { owner, content, createdDateTime } = data;
  const formatCreatedDate = dayjs(createdDateTime).fromNow();

  const userMeQuery = useUserMeQuery({ enabled: false });
  const deleteCommentMutation = useDeleteCommentMutation(postId);

  const currentUserId = userMeQuery.data?.id;
  const nameLinkHref = currentUserId === owner.id ? '/me' : `/user/${owner.id}`;

  return (
    <Box
      sx={{
        marginTop: 2,
        '&:hover': {
          '& .comment-action': {
            visibility: 'visible',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: '0 8px' }}>
        <UserAvatar sx={{ width: 32, height: 32 }} user={owner} />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0 8px' }}>
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#F2F3F5',
                p: 1,
                pr: 2,
                pt: 0.5,
                borderRadius: 4,
              }}
            >
              <Typography
                variant="body1"
                fontWeight={600}
                component={Link}
                href={nameLinkHref}
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                {owner.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{ wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: content.replaceAll('&nbsp;', ' ') ?? '' }}
              />
            </Paper>
            <ClickAwayListener onClickAway={() => setPostMoreAnchorEle(null)}>
              <IconButton
                sx={{ visibility: Boolean(postMoreAnchorEle) ? 'visible' : 'hidden' }}
                className="comment-action"
                onClick={(e) => {
                  setPostMoreAnchorEle(e.currentTarget);
                }}
                size="small"
              >
                <MoreHorizIcon />
              </IconButton>
            </ClickAwayListener>
          </Box>
          <ButtonGroup>
            <Button {...defaultButtonStyle}>Like</Button>
            <Button {...defaultButtonStyle}>Reply</Button>
            <Button
              {...defaultButtonStyle}
              sx={{ ...defaultButtonStyle.sx, fontWeight: 400, ml: '12px !important' }}
            >
              {formatCreatedDate}
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      <Popper
        open={Boolean(postMoreAnchorEle)}
        anchorEl={postMoreAnchorEle}
        // onClose={() => setMoreAnchorEle(null)}
        placement="bottom-end"
      >
        <Paper>
          <List sx={{ py: 0.5, px: 0.5 }}>
            <ListItemButton
              onClick={() => {
                deleteCommentMutation.mutate(data.id);
              }}
            >
              Delete
            </ListItemButton>
          </List>
        </Paper>
      </Popper>
    </Box>
  );
}
