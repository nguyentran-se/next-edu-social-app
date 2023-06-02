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
import ListSubheader from '@mui/material/ListSubheader';
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
import React, { useEffect } from 'react';
import ActiveLink from 'components/ActiveLink';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import { useLayoutContext, useTalkContext } from 'contexts';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys, useGroupsQuery, useUserEventsQuery, useUserMeQuery } from 'queries';
import { groupApis } from 'apis';
import { talkInstance } from 'services';
import { useWorkspaceQuery } from 'queries/workspaceQueries';

interface LayoutProps {
  children: React.ReactNode;
}
const DONT_NEED_APPBAR_PATHS = ['groups'];
const DONT_NEED_MARGIN_BOTTOM_PATHS = ['chat'];
const drawerWidth = 390;
const appbarHeight = 64;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(100% - ${90}px)`,
  minHeight: appbarHeight + 1,
  boxShadow: 'rgba(34, 51, 84, 0.2) 0px 2px 8px -3px, rgba(34, 51, 84, 0.1) 0px 5px 22px -4px',
  padding: '16px 16px 8px 16px',
  justifyContent: 'center',
  backgroundColor: '#fafbfc',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function AppLayout({ children }: LayoutProps) {
  const { pathname } = useRouter();
  // const trigger = useScrollTrigger({
  //   //Height: header + background + groundInfoheader = 64 + 400 + btw(188)
  //   threshold: 550,
  // });
  const { sidebarOpen } = useLayoutContext();
  const isRenderAppBar = DONT_NEED_APPBAR_PATHS.some((p) => !pathname.includes(p));
  const isMarginBottomMainLayout = DONT_NEED_MARGIN_BOTTOM_PATHS.some((p) => !pathname.includes(p));
  useGroupsQuery();
  const userMeQuery = useUserMeQuery();
  useUserEventsQuery();
  const workspaceQuery = useWorkspaceQuery();
  const { dispatchTalk } = useTalkContext();
  useEffect(() => {
    if (!userMeQuery.data) return;
    const { id, name, personalMail, avatar, role } = userMeQuery.data;

    const currentUser = talkInstance.createUser({
      id: id,
      name,
      email: personalMail,
      // photoUrl: '',
      // welcomeMessage: 'Hello!',
      // role
    });
    // dispatchTalk({ type: 'CREATE_SESSION', payload: currentUser });

    return () => {
      // dispatchTalk({ type: 'DESTROY_SESSION' });
    };
  }, [dispatchTalk, userMeQuery.data]);

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {isRenderAppBar && (
          <AppBar position="fixed" open={sidebarOpen}>
            <Typography variant="h6" color="black">
              {workspaceQuery.data?.name}
            </Typography>
          </AppBar>
        )}
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, position: 'relative' }}>
          {isRenderAppBar && <DrawerHeader sx={{ mb: isMarginBottomMainLayout ? 3 : 0 }} />}
          {children}
        </Box>
      </Box>
    </>
  );
}

export default AppLayout;
