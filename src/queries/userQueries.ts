import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@types';
import { userApis } from 'apis';
import { useModalContext } from 'contexts';
import { QueryKeys } from 'queries';
import { useState } from 'react';

export function useUserMeQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: [QueryKeys.Users, 'me'],
    queryFn: userApis.getMe,
    cacheTime: 300000,
    enabled,
  });
}

export function useUsersQuery() {
  return useQuery({
    queryKey: [QueryKeys.Users, QueryKeys.Posts],
    queryFn: userApis.getUsers,
  });
}

export function useUserQuery(userId: string) {
  return useQuery({
    queryKey: [QueryKeys.Users, userId],
    queryFn: () => userApis.getuser(userId),
    enabled: Boolean(userId),
  });
}
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  const { dispatch } = useModalContext();
  return useMutation({
    mutationFn: ({ body }: { body: any }) => userApis.updateUser(body.id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Users, 'me'] });
      dispatch({ type: 'close' });
    },
  });
}
//Events
export function useUserEventsQuery({
  enabled = true,
  params = { unread: false },
}: {
  enabled?: boolean;
  params?: { unread: boolean };
} = {}) {
  return useQuery({
    queryKey: [QueryKeys.Users, QueryKeys.Events, params],
    queryFn: () => userApis.getUserEvents(params),
    enabled,
    refetchInterval: 3000,
  });
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, body }: { eventId: string | number; body: { read: boolean } }) =>
      userApis.updateEvent(eventId, body),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Users, QueryKeys.Events] });
    },
  });
}

export function useUserTimetableQuery() {
  return useQuery({
    queryKey: [QueryKeys.Users, 'me', QueryKeys.Timetables],
    queryFn: userApis.getTimetable,
  });
}
