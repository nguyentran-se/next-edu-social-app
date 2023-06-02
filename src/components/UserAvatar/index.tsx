import { useUserMeQuery } from 'queries';
import React from 'react';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import CircularProgress from 'components/CircularProgress';
import { UserMe } from '@types';
import { useRouter } from 'next/router';
interface UserAvatar extends AvatarProps {
  user: any;
}
function UserAvatar({ user, ...props }: UserAvatar) {
  const userMeQuery = useUserMeQuery({ enabled: false });
  const router = useRouter();

  if (userMeQuery.isLoading) return <CircularProgress />;

  const currentUser = userMeQuery.data as UserMe;
  const nameLinkHref = currentUser.id === user?.id ? '/me' : `/user/${user?.id}`;

  return (
    <Avatar
      {...props}
      sx={{ cursor: 'pointer', ...props.sx }}
      onClick={() => router.push(nameLinkHref)}
    >
      {user?.name?.charAt(0)}
    </Avatar>
  );
}

export default UserAvatar;
