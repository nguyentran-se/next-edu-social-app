import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import { Group, GroupSearch, User } from '@types';
import ActiveLink from 'components/ActiveLink';
import SearchInput from 'components/SearchInput';
import UserAvatar from 'components/UserAvatar';
import { useTalkSession } from 'hooks';
import { useRouter } from 'next/router';
import { useSearchInChatQuery, useUserMeQuery } from 'queries';
import { useEffect, useRef, useState } from 'react';
import { talkInstance } from 'services';
import { capitalizeAndOmitUnderscore } from 'utils';
import { User as TalkUser } from 'talkjs/all';
function ChatsDrawerTab() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const params = { value: searchValue };

  const searchChatQuery = useSearchInChatQuery(params);
  const inboxEle = useRef<HTMLElement>(null);
  const [talkSession] = useTalkSession();
  const router = useRouter();

  useEffect(() => {
    if (!talkSession) return;
    const inbox = talkSession.createInbox({
      selected: null,
    });
    inbox.onSelectConversation((event) => {
      event.preventDefault();
      router.push(`/chat/${event.conversation.id}`);
    });
    inbox.mount(inboxEle.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talkSession]);

  const { users, groups } = searchChatQuery.data ?? {};

  return (
    <Box sx={{ pt: 3, height: '100%', position: 'relative' }}>
      <Typography
        variant="h4"
        color="initial"
        sx={{ mb: 2, fontSize: 20, fontWeight: 700, color: '#000', px: 2 }}
      >
        Chats
      </Typography>
      {isSearchFocused && <ChatsSearch users={users ?? []} groups={groups ?? []} />}
      <Box sx={{ px: 2, mb: 2 }}>
        <SearchInput
          placeholder="Search Workspace chat..."
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 100)}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          autoComplete="off"
        />
      </Box>
      <Box ref={inboxEle} sx={{ height: 'calc(100% - 48px - 37px - 16px)' }}></Box>
    </Box>
  );
}

export default ChatsDrawerTab;

function ChatsSearch({ users, groups }: { users: User[]; groups: GroupSearch[] }) {
  const chatboxEleRef = useRef<HTMLElement>(null);
  const [talkSession, currentUser] = useTalkSession();
  const router = useRouter();

  function handleUserSearchClick(user: User) {
    if (!talkSession || !currentUser) return;
    const otherUser = talkInstance.createUser({
      id: user.id,
      name: user.name,
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

  function handleGroupSearchClick(group: GroupSearch) {
    if (!talkSession) return;
    const users: TalkUser[] = group.members
      .map((u) => talkInstance.createUser({ id: u.id, name: u.name }))
      .filter(Boolean)
      .concat(currentUser) as TalkUser[];
    const { chatbox, conversationId } = talkInstance.createGroupConversation({
      users,
      talkSession,
      groupDetail: group as any,
    });
    chatbox.mount(chatboxEleRef.current);
    setTimeout(() => {
      router.push(`/chat/${conversationId}`);
    }, 0);
  }
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 'calc(24px + 41px + 37px)',
        left: 0,
        right: 0,
        bottom: 0,
        background: '#fff',
      }}
    >
      <List
        subheader={
          <ListSubheader
            disableSticky
            sx={{ mb: 0.5, fontSize: '17px', fontWeight: 500, color: 'rgba(34, 51, 84)' }}
          >
            Users
          </ListSubheader>
        }
      >
        {users.map((user) => (
          <ListItem
            key={user.id}
            disablePadding
            sx={{ display: 'block' }}
            onClick={() => handleUserSearchClick(user)}
          >
            <ListItemButton sx={{ minHeight: 48, justifyContent: 'initial', px: 2.5 }}>
              <ListItemAvatar>
                <UserAvatar user={user} />
              </ListItemAvatar>

              <ListItemText
                primary={user.name}
                secondary={capitalizeAndOmitUnderscore(user.role)}
                sx={{
                  opacity: 1,
                  '& .MuiTypography-root': {
                    fontWeight: '600',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List
        subheader={
          <ListSubheader
            disableSticky
            sx={{ mb: 0.5, fontSize: '17px', fontWeight: 500, color: 'rgba(34, 51, 84)' }}
          >
            Groups
          </ListSubheader>
        }
      >
        {groups.map((group) => (
          <ListItem
            key={group.id}
            disablePadding
            sx={{ display: 'block' }}
            onClick={() => handleGroupSearchClick(group)}
          >
            <ListItemButton sx={{ minHeight: 48, justifyContent: 'initial', px: 2.5 }}>
              <ListItemAvatar>
                <UserAvatar user={group} variant="square" />
              </ListItemAvatar>
              <ListItemText
                primary={group.name}
                secondary={capitalizeAndOmitUnderscore(group.type)}
                sx={{
                  opacity: 1,
                  '& .MuiTypography-root': {
                    fontWeight: '600',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box ref={chatboxEleRef} sx={{ display: 'none' }}></Box>
    </Box>
  );
}
