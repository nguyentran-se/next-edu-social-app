import { useRouter } from 'next/router';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Search from '@mui/icons-material/Search';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import MuiLink from '@mui/material/Link';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Image from 'next/image';
import NextLink from 'next/link';
import React, { useEffect, useLayoutEffect, useRef, useState, useTransition } from 'react';
import ActiveLink from 'components/ActiveLink';
import PostCard from 'components/PostCard';
import dynamic from 'next/dynamic';
import { AppLayout } from 'layout';
import { useModalContext } from 'contexts';
import {
  useAddGroupUsersMutation,
  useGroupDetailQuery,
  useGroupPostsQuery,
  useGroupUsersQuery,
  useUsersNotInGroupQuery,
} from 'queries';
import { GroupType, GroupUser, NextPageWithLayout, User } from '@types';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Select from 'components/Select';
import MemberCard from 'components/MemberCard';
import UserAvatar from 'components/UserAvatar';
import { IoChatbubbleSharp } from 'react-icons/io5';
import { useTalkSession } from 'hooks';
import { User as TalkUser } from 'talkjs/all';
import { talkInstance } from 'services';
import SearchInput from 'components/SearchInput';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SearchPopper from 'components/SearchPopper';
import group1 from 'assets/images/group1.png';
import group2 from 'assets/images/group2.png';
import group3 from 'assets/images/group3.png';
import group4 from 'assets/images/group4.png';

const groupImage = {
  [GroupType.Class]: group1,
  [GroupType.Course]: group2,
  [GroupType.Department]: group3,
  [GroupType.Normal]: group4,
};
export const IMG_SRC =
  'https://images.unsplash.com/photo-1673908495930-aa64c3fd2638?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';

const GROUP_TABS = [
  { href: '/groups/[gid]', label: 'Posts' },
  { href: '/groups/[gid]/members', label: 'Member' },
  { href: '/groups/[gid]/media', label: 'Media' },
  {
    href: '/groups/[gid]/academic',
    label: 'Academic',
    renderIf: [GroupType.Class, GroupType.Course],
  },
];
export function getGroupDetailLayout(page: React.ReactElement) {
  return <GroupDetailLayout>{page}</GroupDetailLayout>;
}
export function withGroupDetailLayout(Component: NextPageWithLayout) {
  Component.getNestedLayout = getGroupDetailLayout;
  return Component;
}
function GroupDetailLayout({ children }: { children: React.ReactNode }) {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const router = useRouter();
  const { dispatch } = useModalContext();
  const [isPending, startTransition] = useTransition();
  const {
    query: { gid },
    pathname,
  } = router;
  const chatboxEleRef = useRef(null);

  const groupDetailQuery = useGroupDetailQuery(gid as string);
  const usersNotInGroupQuery = useUsersNotInGroupQuery(gid as string);
  const groupUsersQuery = useGroupUsersQuery(gid as string);

  const GROUP_TABS =
    [GroupType.Class, GroupType.Course].includes(groupDetailQuery.data?.type as GroupType) ||
    !groupDetailQuery.data?.type
      ? [
          { href: '/groups/[gid]', label: 'Posts' },
          { href: '/groups/[gid]/members', label: 'Member' },
          { href: '/groups/[gid]/media', label: 'Media' },
          { href: '/groups/[gid]/academic', label: 'Academic' },
        ]
      : [
          { href: '/groups/[gid]', label: 'Posts' },
          { href: '/groups/[gid]/members', label: 'Member' },
          { href: '/groups/[gid]/media', label: 'Media' },
        ];

  const initialTabIndex = GROUP_TABS.findIndex((tab) => tab.href.includes(pathname));
  useEffect(() => {
    setTabIndex(initialTabIndex > 0 ? initialTabIndex : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const [talkSession, currentUser] = useTalkSession();

  function handleTabChange(event: React.SyntheticEvent, newTabIndex: number) {
    startTransition(() => {
      setTabIndex(newTabIndex);
    });
  }

  function handleAddPeopleClick() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Add people',
        content: () => <AddPeoplePopup groupId={gid as string} />,
      },
      onCreateOrSave: () => {},
    });
  }

  function handleGroupMessageClick() {
    if (!groupUsersQuery.data || !currentUser || !talkSession || !groupDetailQuery.data) return;

    const users: TalkUser[] = groupUsersQuery.data
      .map((u) => talkInstance.createUser({ id: u.id, name: u.name }))
      .filter(Boolean)
      .concat(currentUser) as TalkUser[];
    const { chatbox, conversationId } = talkInstance.createGroupConversation({
      users,
      talkSession,
      groupDetail: groupDetailQuery.data,
    });
    chatbox.mount(chatboxEleRef.current);
    setTimeout(() => {
      router.push(`/chat/${conversationId}`);
    }, 0);
  }

  return (
    <>
      <Box sx={{ border: '1px solid #ccc' }}>
        <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
          <Image
            src={groupImage[groupDetailQuery.data?.type as GroupType]}
            alt=""
            fill={true}
            style={{ objectFit: 'cover', objectPosition: 'top' }}
          />
        </Box>
      </Box>

      <Paper>
        <Box sx={{ p: 2 }}>
          <Typography variant="h2" fontWeight={600} gutterBottom>
            {groupDetailQuery.data?.name}
          </Typography>
          <Typography
            variant="body2"
            color="initial"
            sx={{ display: 'flex', alignItems: 'center', gap: '0 4px', mb: 1 }}
          >
            {groupDetailQuery.data?.private ? <LockOutlinedIcon /> : <PublicOutlinedIcon />}
            {groupDetailQuery.data?.private ? 'Closed group' : 'Open group'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <AvatarGroup max={6} total={groupUsersQuery.data?.length}>
              {/* <Avatar src={IMG_SRC} />
              <Avatar src={IMG_SRC} />
              <Avatar src={IMG_SRC} />
              <Avatar src={IMG_SRC} />
              <Avatar src={IMG_SRC} />
              <Avatar src={IMG_SRC} /> */}
              {groupUsersQuery.data?.map((user) => (
                <UserAvatar key={user.id} sx={{ width: 40, height: 40 }} user={user} />
              ))}
            </AvatarGroup>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0 10px' }}>
              <Button
                startIcon={<PersonAdd />}
                variant="contained"
                size="small"
                onClick={handleAddPeopleClick}
              >
                Add people
              </Button>
              <Button
                startIcon={<IoChatbubbleSharp />}
                variant="contained"
                size="small"
                onClick={handleGroupMessageClick}
              >
                Group Message
              </Button>
            </Box>
          </Box>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Tabs
              value={tabIndex > GROUP_TABS.length - 1 ? 0 : tabIndex}
              onChange={handleTabChange}
              sx={{
                '.Mui-selected': {
                  color: initialTabIndex === -1 ? 'rgba(34, 51, 84, 0.7) !important' : '#5569ff',
                },
              }}
              // @ts-ignore: Know what is going on
              indicatorColor={initialTabIndex === -1 ? '#fff' : 'primary'}
            >
              {GROUP_TABS.map(({ label, href }) => (
                <Tab
                  key={label}
                  component={NextLink}
                  href={{ pathname: href, query: { gid } }}
                  label={label}
                />
              ))}
            </Tabs>
            <SearchPopper redirect={`/groups/${gid}/search`} />
          </Stack>
        </Box>
      </Paper>
      <Box sx={{ my: '24px' }}>
        {children}
        <Box ref={chatboxEleRef} sx={{ display: 'none', width: '100%', height: '100%' }}></Box>
      </Box>
    </>
  );
}

export default GroupDetailLayout;

function AddPeoplePopup({ groupId }: { groupId: string }) {
  const addGroupUsersMutation = useAddGroupUsersMutation(groupId);
  const { data } = useUsersNotInGroupQuery(groupId) as { data: GroupUser[] };

  const [selectedOptions, setSelectedOptions] = useState<GroupUser[]>([]);
  const selectedIds = selectedOptions.map((sO) => sO.id);
  const options = data
    .filter((user) => Boolean(user.name))
    .filter((user) => !selectedIds.includes(user.id))
    .map((user) => ({ ...user, label: user.name, value: user.id }));

  function handleSelectChange(option: GroupUser & { label: string; value: any }) {
    const { label, value, ...user } = option;
    setSelectedOptions([user, ...selectedOptions]);
  }

  function handleCloseClick(option: GroupUser) {
    setSelectedOptions(selectedOptions.filter((user) => user.id !== option.id));
  }
  function handleSubmit(e: any) {
    e.preventDefault();
    addGroupUsersMutation.mutate({ groupId, userIds: selectedIds });
  }
  return (
    <Box>
      <Box id="entityForm" component={'form'} onSubmit={handleSubmit} />
      <Select
        placeholder="Add people"
        options={options}
        fieldName="people"
        onChange={handleSelectChange}
        value={''}
      />
      <Box>
        {selectedOptions.map((user) => (
          <MemberCard key={user.id} data={user} onCloseClick={handleCloseClick} />
        ))}
      </Box>
    </Box>
  );
}
