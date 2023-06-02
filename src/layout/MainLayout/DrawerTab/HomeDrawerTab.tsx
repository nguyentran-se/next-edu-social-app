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
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Menu from '@mui/material/Menu';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiLink from '@mui/material/Link';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Image from 'next/image';
import NextLink from 'next/link';
import React, { startTransition, useEffect, useState } from 'react';
import ActiveLink from 'components/ActiveLink';
import { useRouter } from 'next/router';
import ArrowCircleLeftOutlined from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlined from '@mui/icons-material/ArrowCircleRightOutlined';
import SearchInput from 'components/SearchInput';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { useModalContext } from 'contexts/ModalContext';
import { IMG_SRC } from 'layout/GroupDetailLayout';
import { useLayoutContext } from 'contexts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useCreateGroupMutation,
  useGroupsQuery,
  useSearchInWorkspaceQuery,
  useUserMeQuery,
} from 'queries';
import CircularProgress from 'components/CircularProgress';
import { BsPostcard } from 'react-icons/bs';
import { MdOutlineGroups } from 'react-icons/md';
import { GroupType, WorkspaceSearchResponse } from '@types';
import UserAvatar from 'components/UserAvatar';
import { capitalizeAndOmitUnderscore } from 'utils';
import FilterListIcon from '@mui/icons-material/FilterList';
import Checkbox from '@mui/material/Checkbox';
import { FcDepartment, FcGraduationCap } from 'react-icons/fc';
import { SiGitbook } from 'react-icons/si';
const SIDE_BAR_MENU = [{ label: 'Posts', href: '/' }];

function HomeDrawerTab() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const groupsQuery = useGroupsQuery();
  const params = { value: searchValue };
  const searchWorkspaceQuery = useSearchInWorkspaceQuery(params);

  if (groupsQuery.isLoading || (searchWorkspaceQuery.isLoading && isSearchFocused))
    return <CircularProgress />;

  return (
    <>
      <Box sx={{ p: 2 }}>
        <SearchInput
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsSearchFocused(false);
            }, 100);
          }}
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
        />
      </Box>
      {isSearchFocused ? (
        <Box sx={{ overflowY: 'auto' }}>
          <HomeSearch data={searchWorkspaceQuery!.data as WorkspaceSearchResponse} />
        </Box>
      ) : (
        <HomeMain />
      )}
    </>
  );
}

export default HomeDrawerTab;

function HomeSearch({ data }: { data: WorkspaceSearchResponse }) {
  const { groups, posts, users } = data;
  const userMeQuery = useUserMeQuery({ enabled: false });
  const currentUserId = userMeQuery.data?.id;
  const router = useRouter();
  return (
    <Box>
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
            component={ActiveLink}
            href={`/user/${currentUserId === user.id ? '/me' : user.id}`}
            // onClick={() => router.push(`/user/${currentUserId === user.id ? '/me' : user.id}`)}
            activeClassName="active-link"
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
            component={ActiveLink}
            href={`/groups/${group.id}`}
            activeClassName="active-link"
          >
            <ListItemButton sx={{ minHeight: 48, justifyContent: 'initial', px: 2.5 }}>
              <ListItemAvatar>
                <UserAvatar user={group} variant="square" />
              </ListItemAvatar>
              <ListItemText
                primary={group.name}
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
            Posts
          </ListSubheader>
        }
      >
        {posts.map((post) => (
          <ListItem
            key={post.id}
            disablePadding
            sx={{ display: 'block' }}
            component={ActiveLink}
            href={`/groups/${post.group.id}/post/${post.id}`}
            activeClassName="active-link"
          >
            <ListItemButton sx={{ minHeight: 48, justifyContent: 'initial', px: 2.5 }}>
              <ListItemAvatar>
                <UserAvatar user={post.owner} />
              </ListItemAvatar>
              <Typography
                // variant="body1"
                // color="initial"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

const GROUP_FILTERS = [
  { id: 'all', label: 'All' },
  { id: GroupType.Class, label: 'Class' },
  { id: GroupType.Course, label: 'Course' },
  { id: GroupType.Department, label: 'Department' },
  { id: GroupType.Normal, label: 'Normal' },
];

function HomeMain() {
  const [filterAnchorEle, setFilterAnchorEle] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<string[]>(() => GROUP_FILTERS.map((g) => g.id));

  const theme = useTheme();
  const { dispatch } = useModalContext();
  const groupsQuery = useGroupsQuery({ enabled: false });
  function handleCreateGroupClick() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Create group',
        saveTitle: 'Create',
        content: () => <CreateGroupForm />,
      },
      onCreateOrSave: () => {},
    });
  }
  return (
    <Box>
      <List
        component="div"
        subheader={
          <ListSubheader disableSticky sx={{ mb: 1, fontSize: 20, fontWeight: 700, color: '#000' }}>
            Home
          </ListSubheader>
        }
      >
        {SIDE_BAR_MENU.map(({ label, href }, index) => (
          <ListItem
            key={label}
            disablePadding
            sx={{ display: 'block' }}
            component={ActiveLink}
            href={href}
            activeClassName="active-link"
          >
            <ListItemButton sx={{ minHeight: 48, justifyContent: 'initial', px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: 'center' }}>
                <BsPostcard fontSize={24} color="#5569ff" />
              </ListItemIcon>
              <ListItemText
                primary={label}
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
      <Divider />
      <List
        sx={{ maxHeight: '400px', overflowY: 'auto' }}
        subheader={
          <ListSubheader
            sx={{
              mb: 1,
              fontSize: '16px',
              fontWeight: 500,
              color: 'rgba(34, 51, 84)',
            }}
          >
            Groups
            <IconButton
              aria-label=""
              onClick={(e) => setFilterAnchorEle(e.currentTarget)}
              size="small"
              sx={{ float: 'right', transform: 'translateY(8px)' }}
            >
              <FilterListIcon />
            </IconButton>
          </ListSubheader>
        }
      >
        {groupsQuery.data
          ?.filter((g) => {
            if (filters.includes('all')) return true;
            else return filters.includes(g.type);
          })
          .map(({ name, id, type }, index) => (
            <ListItem
              key={id}
              disablePadding
              sx={{ display: 'block' }}
              component={ActiveLink}
              href={`/groups/${id}`}
              activeClassName="active-link"
            >
              <ListItemButton sx={{ minHeight: 48, justifyContent: 'initial', px: 2.5 }}>
                <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: 'center' }}>
                  {type === GroupType.Class && <FcGraduationCap fontSize={24} color="#FF8D6F" />}
                  {type === GroupType.Course && <SiGitbook fontSize={24} color="#FFC657" />}
                  {type === GroupType.Department && <FcDepartment fontSize={24} color="#F9F871" />}
                  {type === GroupType.Normal && <MdOutlineGroups fontSize={24} color="#6CBAA2" />}
                </ListItemIcon>
                <ListItemText
                  primary={name}
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
      <Popover
        open={Boolean(filterAnchorEle)}
        anchorEl={filterAnchorEle}
        onClose={() => setFilterAnchorEle(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Paper sx={{ px: 2, py: 1 }}>
          {GROUP_FILTERS.map(({ id, label }) => (
            <Box key={id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.includes(id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        if (id === 'all') setFilters(GROUP_FILTERS.map((g) => g.id));
                        else
                          setFilters((prevFilter) =>
                            prevFilter.filter((f) => f !== 'all').concat(id),
                          );
                      } else {
                        if (id === 'all') setFilters([]);
                        else setFilters(filters.filter((f) => f !== id).filter((f) => f !== 'all'));
                      }
                    }}
                    size="small"
                  />
                }
                label={label}
              />
            </Box>
          ))}
        </Paper>
      </Popover>
      <ListItem
        disablePadding
        sx={{ display: 'block', color: theme.palette.primary.main }}
        onClick={handleCreateGroupClick}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: 'initial',
            px: 2.5,
            width: '100%',
          }}
          component={Button}
          color="primary"
        >
          <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: 'center' }}>
            <AddOutlined color="primary" />
          </ListItemIcon>
          <ListItemText primary={'Create group'} sx={{ opacity: 1, color: 'inherit' }} />
        </ListItemButton>
      </ListItem>
    </Box>
  );
}

//////////////// FORM //////////////////////////
interface CreateGroupFormProps {
  defaultValues?: any;
}
const CreateGroupSchema = z.object({
  name: z.string().min(1),
});
type GroupFormInputs = z.infer<typeof CreateGroupSchema>;
type GroupFormBody = GroupFormInputs & { id?: number };
function CreateGroupForm({ defaultValues }: CreateGroupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      ...defaultValues,
    },
  });
  const createGroupMutation = useCreateGroupMutation();

  function onSubmit(data: GroupFormInputs) {
    const body: GroupFormBody = {
      ...data,
    };
    if (defaultValues?.id) body.id = defaultValues.id;

    // mutation.mutate(body);
    createGroupMutation.mutate(body);
  }

  return (
    <>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        id="entityForm"
        autoComplete="off"
        noValidate
        sx={{ '& .MuiTextField-root': { m: 1, width: '100%' }, height: 80 }}
      >
        {
          <TextField
            label="Name"
            required
            error={Boolean(errors.name)}
            helperText={errors.name?.message as string}
            {...register('name')}
          />
        }
      </Box>
    </>
  );
}
