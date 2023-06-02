import AccountCircle from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import ChatBubbleOutlined from '@mui/icons-material/ChatBubbleOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
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
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
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
import React, { useState } from 'react';
import ActiveLink from 'components/ActiveLink';
import { useRouter } from 'next/router';
import ArrowCircleLeftOutlined from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlined from '@mui/icons-material/ArrowCircleRightOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import EventIcon from '@mui/icons-material/EventAvailable';
import SearchInput from 'components/SearchInput';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { useModalContext } from 'contexts/ModalContext';
import { IMG_SRC } from 'layout/GroupDetailLayout';
import { useLayoutContext } from 'contexts';
import { IoChatbubbleOutline, IoNotificationsOutline } from 'react-icons/io5';
import { AiOutlineHome } from 'react-icons/ai';
import UserAvatar from 'components/UserAvatar';
import { QueryKeys, useUserEventsQuery, useUserMeQuery } from 'queries';
import HomeDrawerTab from '../DrawerTab/HomeDrawerTab';
import NotificationsDrawerTab from '../DrawerTab/NotificationsDrawerTab';
import ChatsDrawerTab from '../DrawerTab/ChatsDrawerTab';
import { __DEV__, appCookies } from 'utils';
import { useQueryClient } from '@tanstack/react-query';

enum TabDrawerIndexEnum {
  Home,
  Notifications,
  Chats,
}
const TAB_MENU = [
  // { icon: <HomeOutlined fontSize="large" /> },
  { icon: <AiOutlineHome fontSize="28px" />, href: '/' },
  {
    icon: ({ badgeContent }: { badgeContent: React.ReactNode }) => (
      <Badge badgeContent={badgeContent} color="error">
        <IoNotificationsOutline fontSize="28px" />
      </Badge>
    ),
    badge: true,
  },
  { icon: <IoChatbubbleOutline fontSize="28px" /> },
];
const drawerWidth = 300;
const drawerTabWidth = 90;
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  left: `${drawerTabWidth + 1}px`,
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  // width: `calc(${theme.spacing(7)} + 1px)`,
  width: 0,
  [theme.breakpoints.up('sm')]: {
    // width: `calc(${theme.spacing(8)} + 1px)`,
    width: 0,
  },
  zIndex: 6,
});

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
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const DrawerTab = styled(MuiDrawer)(({ theme }) => ({
  width: drawerTabWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  zIndex: 10,
  '& .MuiDrawer-paper': {
    overflowX: 'hidden',
    zIndex: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    paddingBottom: '16px',
    width: 90,
  },
}));
function Sidebar() {
  const [tabIndex, setTabIndex] = useState<TabDrawerIndexEnum>(TabDrawerIndexEnum.Home);
  const [profileAnchorEl, setProfileAnchorEl] = useState<HTMLElement | null>(null);

  const { sidebarOpen, setSidebarOpen } = useLayoutContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userEventsQuery = useUserEventsQuery({ enabled: false });
  const userMeQuery = useUserMeQuery({ enabled: false });
  function handleDrawerToggle() {
    setSidebarOpen(!sidebarOpen);
  }

  function handleTabChange(event: React.SyntheticEvent, newTabIndex: number) {
    setTabIndex(newTabIndex);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <DrawerTab variant="permanent">
        <Tabs orientation="vertical" value={tabIndex} onChange={handleTabChange} aria-label="">
          {TAB_MENU.map(({ icon: Icon, href, badge }, index) => (
            <Tab
              key={index}
              icon={
                typeof Icon === 'function' ? (
                  <Icon
                    badgeContent={
                      Array.isArray(userEventsQuery.data)
                        ? userEventsQuery.data?.filter((e) => !e.read).length
                        : 0
                    }
                  />
                ) : (
                  Icon
                )
              }
              onClick={() => {
                if (badge) queryClient.invalidateQueries({ queryKey: [QueryKeys.Posts] });
                href && router.push(href);
              }}
              sx={{
                width: 86,
                height: 60,
                ':hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  transition: 'background-color .1s linear',
                },
              }}
            />
          ))}
        </Tabs>
        <Box sx={{ mb: 4 }}>
          <IconButton onClick={handleDrawerToggle} sx={{ width: '40px', marginTop: 8 }}>
            {sidebarOpen ? <ArrowCircleLeftOutlined /> : <ArrowCircleRightOutlined />}
          </IconButton>
        </Box>
        <Box>
          <IconButton
            size="medium"
            //  onClick={() => router.push('/me')}
            onClick={(e) => setProfileAnchorEl(e.currentTarget)}
          >
            {/* <Avatar src={IMG_SRC} sx={{ width: 42, height: 42 }} /> */}
            <Avatar sx={{ width: 42, height: 42 }}>{userMeQuery.data?.name?.charAt(0)}</Avatar>
          </IconButton>
          <Popover
            open={Boolean(profileAnchorEl)}
            anchorEl={profileAnchorEl}
            onClose={() => setProfileAnchorEl(null)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <List sx={{ p: 1 }}>
              <ListItemButton
                onClick={() => {
                  router.push('/me');
                  setProfileAnchorEl(null);
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ width: 42, height: 42 }}>
                    {userMeQuery.data?.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${userMeQuery.data?.name}`} secondary={'View Profile'} />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  router.push('/me?t=tb');
                  setProfileAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary={`Timetable`} />
              </ListItemButton>
              <Divider />
              <ListItemButton
                onClick={() => {
                  window.location.href = __DEV__
                    ? 'http://localhost:8000/verify'
                    : process.env.NEXT_PUBLIC_LANDING_URL + 'verify';
                  setProfileAnchorEl(null);
                  appCookies.clearAll();
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={`Log out`} />
              </ListItemButton>
            </List>
          </Popover>
        </Box>
      </DrawerTab>
      <Drawer
        variant="permanent"
        open={sidebarOpen}
        sx={{ '& .MuiDrawer-paper': { overflow: 'hidden' } }}
      >
        {/* <DrawerHeader>
      <IconButton onClick={handleDrawerClose}>
        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </DrawerHeader> */}
        {tabIndex === TabDrawerIndexEnum.Home && <HomeDrawerTab />}
        {tabIndex === TabDrawerIndexEnum.Notifications && <NotificationsDrawerTab />}
        {tabIndex === TabDrawerIndexEnum.Chats && <ChatsDrawerTab />}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
