import Paper from '@mui/material/Paper';
import { withGroupDetailLayout } from 'layout';
import React, { useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import SearchInput from 'components/SearchInput';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import ChatBubble from '@mui/icons-material/ChatBubble';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Close from '@mui/icons-material/Close';
import { IoChatbubbleSharp } from 'react-icons/io5';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import {
  useGroupUsersQuery,
  useRemoveGroupUserMutation,
  useSetAdminMutation,
  useUserMeQuery,
  useUsersQuery,
} from 'queries';
import CircularProgress from 'components/CircularProgress';
import { Callback, GroupUser } from '@types';
import UserAvatar from 'components/UserAvatar';
import Link from 'next/link';
import { talkInstance } from 'services';
import { useTalkSession } from 'hooks';
import Talk from 'talkjs';
import Popper from '@mui/material/Popper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ClickAwayListener from '@mui/material/ClickAwayListener';
interface MemberCardProps {
  data: GroupUser;
  subContent?: React.ReactNode;
  onCloseClick?: (data: GroupUser) => void;
}
function MemberCard({ data, subContent, onCloseClick }: MemberCardProps) {
  const [moreAnchorEle, setMoreAnchorEle] = useState<HTMLElement | null>(null);
  const router = useRouter();

  const userMeQuery = useUserMeQuery({ enabled: false });
  const removeMemberMutation = useRemoveGroupUserMutation(router.query.gid as string, data.id);
  const setAdminMutation = useSetAdminMutation(router.query.gid as string, data.id);

  const isCurrentUser = userMeQuery.data?.id === data.id;
  const nameLinkHref = isCurrentUser ? '/me' : `/user/${data.id}`;
  const [talkSession, currentUser] = useTalkSession();
  const chatboxEleRef = useRef(null);

  function handleMessageClick() {
    if (!talkSession || !currentUser) return;
    const otherUser = talkInstance.createUser({
      id: data.id,
      name: data.name,
    });
    if (!otherUser) return;
    const { chatbox, conversationId } = talkInstance.createOneOnOneConversation({
      currentUser,
      otherUser,
      talkSession,
    });
    // WARN: do a trick to make TalkJS work
    chatbox.mount(chatboxEleRef.current);
    setTimeout(() => {
      router.push(`/chat/${conversationId}`);
    }, 0);
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0 10px', mb: 3 }}>
      <UserAvatar sx={{ width: 56, height: 56, fontSize: 24 }} user={data} />
      <Box>
        <Typography
          variant="h6"
          color="initial"
          component={Link}
          href={nameLinkHref}
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          {data.name}
        </Typography>
        {subContent && (
          <Typography variant="body2" fontSize={13} fontWeight={500}>
            {subContent}
          </Typography>
        )}
      </Box>
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: '0 8px' }}>
        {!Boolean(onCloseClick) && userMeQuery.data!.id !== data.id && (
          <Button
            startIcon={<IoChatbubbleSharp />}
            variant="contained"
            color="inherit"
            onClick={handleMessageClick}
          >
            Message
          </Button>
        )}
        {!Boolean(onCloseClick) && (
          <ClickAwayListener onClickAway={() => setMoreAnchorEle(null)}>
            <Button
              sx={{
                px: '0px',
                height: '36px',
                minWidth: '48px',
                '& .MuiButton-startIcon': { m: 0 },
              }}
              startIcon={<MoreHoriz />}
              variant="contained"
              color="inherit"
              onClick={(e) => setMoreAnchorEle(e.currentTarget)}
            />
          </ClickAwayListener>
        )}
        {Boolean(onCloseClick) && (
          <IconButton onClick={() => onCloseClick!(data)} color="inherit">
            <Close />
          </IconButton>
        )}
      </Box>
      <Popper
        open={Boolean(moreAnchorEle)}
        anchorEl={moreAnchorEle}
        // onClose={() => setMoreAnchorEle(null)}
        placement="bottom-start"
      >
        <Paper>
          <List sx={{ p: 1 }}>
            <ListItemButton
              onClick={() => {
                setMoreAnchorEle(null);
                setAdminMutation.mutate({ value: !data.groupAdmin });
              }}
            >
              {data.groupAdmin ? 'Unset admin' : 'Set admin'}
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setMoreAnchorEle(null);
                removeMemberMutation.mutate();
              }}
            >
              {isCurrentUser ? 'Leave group' : 'Remove member'}
            </ListItemButton>
          </List>
        </Paper>
      </Popper>
      <Box ref={chatboxEleRef} sx={{ display: 'none' }}></Box>
    </Box>
  );
}
export default React.memo(MemberCard);
