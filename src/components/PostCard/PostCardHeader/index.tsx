import ArrowRight from '@mui/icons-material/ArrowRight';
import CameraAltOutlined from '@mui/icons-material/CameraAltOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Typography from '@mui/material/Typography';
import { Comment, CreatePostCommentPayload, Post } from '@types';
import Editor from 'components/Editor';
import UserAvatar from 'components/UserAvatar';
import dayjs from 'dayjs';
import { useWindowValue } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCreatePostCommentMutation, useDeletePostMutation, useUserMeQuery } from 'queries';
import { useEffect, useRef, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa';
import IconButton from '@mui/material/IconButton';
import Popper from '@mui/material/Popper';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
export default function PostCardHeader({
  data,
  visibleGroup = false,
}: {
  data: Post;
  visibleGroup?: boolean;
}) {
  const [postMoreAnchorEle, setPostMoreAnchorEle] = useState<HTMLElement | null>(null);

  const { owner, createdDateTime, group } = data;
  const userMeQuery = useUserMeQuery({ enabled: false });
  const deletePostMutation = useDeletePostMutation();
  const formatCreatedDateTime = dayjs(createdDateTime).format('MMMM D [at] HH:mm');

  const currentUserId = userMeQuery.data?.id;
  const nameLinkHref = currentUserId === owner.id ? '/me' : `/user/${owner.id}`;

  return (
    <Box sx={{ display: 'flex', gap: '0 8px', alignItems: 'center' }}>
      <UserAvatar user={owner} />
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h4"
            fontWeight={600}
            component={Link}
            href={nameLinkHref}
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {owner.name}
          </Typography>
          {visibleGroup && (
            <>
              <FaCaretRight fontSize={18} style={{ transform: 'translateY(1px)' }} />
              <Typography
                sx={{
                  transition: 'all .1s linear',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                variant="h4"
                fontWeight={600}
                component={Link}
                href={`/groups/${group.id}`}
              >
                {group.name}
              </Typography>
            </>
          )}
        </Box>
        <Typography variant="body2">{formatCreatedDateTime}</Typography>
      </Box>
      <ClickAwayListener onClickAway={() => setPostMoreAnchorEle(null)}>
        <IconButton
          sx={{ ml: 'auto', alignSelf: 'flex-start' }}
          onClick={(e) => {
            setPostMoreAnchorEle(e.currentTarget);
          }}
          size="small"
        >
          <MoreHorizIcon />
        </IconButton>
      </ClickAwayListener>
      <Popper
        open={Boolean(postMoreAnchorEle)}
        anchorEl={postMoreAnchorEle}
        // onClose={() => setMoreAnchorEle(null)}
        placement="bottom-end"
      >
        <Paper>
          <List sx={{ p: 0.5 }}>
            <ListItemButton onClick={() => deletePostMutation.mutate(data.id)}>
              Delete
            </ListItemButton>
          </List>
        </Paper>
      </Popper>
    </Box>
  );
}
