import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { useEffect, useRef, useState } from 'react';
import { QueryKeys, queryClient, useUpdateEventMutation, useUserEventsQuery } from 'queries';
import dayjs from 'dayjs';
import { Event, EventType, UserRole } from '@types';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';

enum NotificationsMode {
  Read,
  Unread,
}

const notificationsTabs = [{ label: 'All' }, { label: 'Unread' }];
function NotificationsDrawerTab() {
  const [notificationsMode, setNotificationsMode] = useState(NotificationsMode.Read);
  const userEventsQuery = useUserEventsQuery({
    params: { unread: notificationsMode === NotificationsMode.Unread },
  });

  // useEffect(() => {
  //   const eventSource = new EventSource('http://api.dev.funiverse.world/user/notification');
  //   eventSource.onmessage = (event) => {
  //     console.log(event);
  //   };
  //   eventSource.onopen = (e) => console.log('open');
  //   eventSource.onerror = (e) => {
  //     console.log(e);
  //   };
  //   return () => {};
  // }, []);

  return (
    <Box sx={{ pt: 1 }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h4"
          color="initial"
          sx={{ mb: 2, fontSize: 20, fontWeight: 700, color: '#000' }}
        >
          Notifications
        </Typography>
        <Tabs
          value={notificationsMode}
          onChange={(event, value: number) => setNotificationsMode(value)}
          aria-label=""
          TabIndicatorProps={{ sx: { display: 'none' } }}
        >
          {notificationsTabs.map(({ label }) => (
            <Tab
              key={label}
              label={label}
              disableRipple
              sx={{
                '&.Mui-selected': { backgroundColor: '#E7F3FF' },
                borderRadius: '18px',
                fontWeight: '700 !important',
                px: '12px !important',
              }}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ height: 'calc(100vh - 118px)', overflowY: 'auto' }}>
        {userEventsQuery.data?.map((noti) => (
          <NotificationItem key={noti.id} data={noti} />
        ))}
      </Box>
    </Box>
  );
}

export default NotificationsDrawerTab;

function NotificationItem({ data }: { data: Event }) {
  const { actor, createdTime, receiver, read, group } = data;
  const updateEventMutation = useUpdateEventMutation();
  const router = useRouter();
  const formatCreatedDateTime = dayjs(createdTime).fromNow();
  const actionMessage = {
    [EventType.ADD_TO_GROUP]: 'added you into',
    [EventType.NEW_COMMENT]: 'commented on your post in',
    [EventType.NEW_POST]: 'posted in',
    [EventType.SET_GROUP_ADMIN]: 'set you as a Admin of',
    [EventType.MENTION]: 'mentioned you in a comment in',
    [EventType.REACTION]: 'reacted on your comment in',
  };

  const adminActionMessage = {
    [EventType.ADD_TO_GROUP]: 'You have been added into',
    [EventType.SET_GROUP_ADMIN]: 'You have been set as Admin of',
    [EventType.NEW_SEMESTER]: 'has started!',
  };

  function handleNotificationClick() {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.Groups, `${group.id}`, QueryKeys.Posts] });
    if (read) {
      router.push(`/groups/${group.id}`);
      return;
    }

    const body = { read: true };
    updateEventMutation.mutate(
      { eventId: data.id, body },
      {
        onSuccess: () => {
          router.push(`/groups/${group.id}`);
        },
      },
    );
  }
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '0 10px',
        userSelect: 'none',
        cursor: 'pointer',
        px: 2,
        py: 1,
        '&:hover': { backgroundColor: '#F2F2F2' },
      }}
      onClick={handleNotificationClick}
    >
      <Badge color="primary" variant="dot" invisible={read}></Badge>
      <Avatar sx={{ width: 48, height: 48 }}>{actor.name?.charAt(0)}</Avatar>
      <Box>
        <Typography
          variant="body1"
          color="initial"
          sx={{
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            fontSize: 13,
            lineHeight: 1.2,
          }}
        >
          <Typography
            variant="body1"
            color="initial"
            fontSize="inherit"
            sx={{
              overflow: 'hidden',
              WebkitLineClamp: 3,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              lineHeight: 'inherit',
            }}
          >
            {actor.role === UserRole.WorkspaceAdmin ? (
              <>
                {data.type !== EventType.NEW_SEMESTER && (
                  <>
                    {adminActionMessage[data.type as keyof typeof adminActionMessage]}{' '}
                    <strong>{group.name}</strong>
                  </>
                )}
                {data.type === EventType.NEW_SEMESTER && (
                  <>
                    <strong>{data.term}</strong>{' '}
                    {adminActionMessage[data.type as keyof typeof adminActionMessage]}
                  </>
                )}
              </>
            ) : (
              <>
                <strong>{actor.name}</strong>{' '}
                {actionMessage[data.type as keyof typeof actionMessage]}{' '}
                <strong>{group.name}</strong>
              </>
            )}
          </Typography>
          <Typography sx={{ lineHeight: 'inherit' }} variant="body2" fontSize="inherit">
            {formatCreatedDateTime}
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}
