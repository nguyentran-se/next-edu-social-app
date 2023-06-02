import { useRouter } from 'next/router';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Image from 'next/image';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import ActiveLink from 'components/ActiveLink';
import PostCard from 'components/PostCard';
import dynamic from 'next/dynamic';
import { AppLayout, getGroupDetailLayout, withGroupDetailLayout } from 'layout';
import {
  useCreateGroupPostMutation,
  useGroupDetailQuery,
  useGroupPostsQuery,
  useUserMeQuery,
  useUsersNotInGroupQuery,
} from 'queries';
import { useWindowValue } from 'hooks/useWindowValue';
import { useModalContext } from 'contexts';
import Editor from 'components/Editor';
import { Callback, CreateGroupPostPayload } from '@types';
import { useRefState } from 'hooks';
import Head from 'next/head';
import UserAvatar from 'components/UserAvatar';

// const DynamicPostCard = dynamic(() => import('../../../components/PostCard'), { ssr: false });

function GroupDetail() {
  const [editorValueRef, setEditorValue] = useRefState('');
  const editorValue = editorValueRef.current;

  const router = useRouter();
  const { gid } = router.query as { gid: string };
  const screenWidth = useWindowValue({ path: 'screen.width', initialValue: 1200 });
  const { dispatch } = useModalContext();

  const userMeQuery = useUserMeQuery({ enabled: false });
  const groupPostsQuery = useGroupPostsQuery(gid);
  const createPostMutation = useCreateGroupPostMutation(gid);

  useEffect(() => {
    const isEmptyContent = !editorValue.replaceAll(/<\/*(p|br)>/g, '').trim();
    dispatch({ type: 'disable_action', payload: isEmptyContent });
  }, [dispatch, editorValue]);

  function handleOnEditerChange(value: string) {
    setEditorValue(value);
  }

  function handleWritePostClick() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Create post',
        saveTitle: 'Post',
        content: () => (
          <Box sx={{ height: 300 }}>
            <Editor onChange={handleOnEditerChange} autoFocus />
          </Box>
        ),
      },
      onCreateOrSave: () => {
        const body: CreateGroupPostPayload = {
          content: editorValueRef.current,
          groupId: +(gid as string),
          ownerId: userMeQuery.data!.id,
        };
        createPostMutation.mutate(body);
      },
    });
  }

  return (
    <>
      <Head>
        <title>Group | FUniverse</title>
      </Head>
      <Box sx={{ mb: 3, width: `calc((${screenWidth}px - 240px) / 2)`, mx: 'auto', pb: 8 }}>
        <PostWrite onPostWriteClick={handleWritePostClick} />
        {groupPostsQuery.data?.map((post, index) => (
          <PostCard key={post.id} data={post} />
        ))}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexFlow: 'column',
            justifyContent: 'center',
            mt: 6,
          }}
        >
          <Typography variant="h4" fontSize={20} color="initial">
            Create a post for your group
          </Typography>
          <Typography variant="body1" fontSize={17} color="initial" textAlign={'center'}>
            Get the conversation started with a welcome post. Anyone who joins will be able to see
            it and comment.
          </Typography>
          <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={handleWritePostClick}>
            Create post
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default GroupDetail;
//WARN: withGroupDetailLayout not working @@
GroupDetail.getNestedLayout = (page: React.ReactElement) => getGroupDetailLayout(page);

function PostWrite({ onPostWriteClick }: { onPostWriteClick: Callback }) {
  const userMeQuery = useUserMeQuery({ enabled: false });

  function handleWritePostClick() {
    onPostWriteClick();
  }
  return (
    <Paper sx={{ p: 2, mb: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0 10px' }}>
        <UserAvatar user={userMeQuery.data} />
        <Box
          onClick={handleWritePostClick}
          sx={{
            cursor: 'pointer',
            borderRadius: '20px',
            p: '12.5px',
            pl: 2,
            flexGrow: 1,
            backgroundColor: '#F0F2F5',
            color: '#1c1e21',
            userSelect: 'none',
            '&:hover': { backgroundColor: 'rgba(228, 230, 232, 0.7)' },
            '&:active': { backgroundColor: 'rgb(228, 230, 232)' },
            fontSize: 14,
          }}
        >
          Write something...
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
    </Paper>
  );
}
