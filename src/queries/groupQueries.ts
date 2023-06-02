import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateGroupPayload, CreateGroupPostPayload } from '@types';
import { groupApis } from 'apis';
import { AxiosError } from 'axios';
import { useModalContext } from 'contexts';
import { useRouter } from 'next/router';
import { QueryKeys, useUserMeQuery } from 'queries';
import { toast } from 'react-hot-toast';

export function useGroupsQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({ queryKey: [QueryKeys.Groups], queryFn: groupApis.getUserGroups, enabled });
}

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();
  const { dispatch } = useModalContext();
  const router = useRouter();
  return useMutation<number, unknown, CreateGroupPayload, unknown>({
    mutationFn: (body) => groupApis.createUserGroup(body),
    onSuccess: (groupId) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Groups] });
      dispatch({ type: 'close' });
      router.push(`/groups/${groupId}`);
    },
  });
}

export function useUsersNotInGroupQuery(groupId: string) {
  return useQuery({
    queryKey: [QueryKeys.Groups, groupId, QueryKeys.UsersNotIn],
    queryFn: () => groupApis.getUsersNotInGroup(groupId),
    enabled: Boolean(groupId),
  });
}

export function useGroupDetailQuery(groupId: string, { enabled }: { enabled?: boolean } = {}) {
  const router = useRouter();
  return useQuery({
    queryKey: [QueryKeys.Groups, groupId],
    queryFn: () => groupApis.getGroupDetail(groupId),
    enabled: enabled ?? Boolean(groupId),
    onError: () => {
      router.push('/');
    },
  });
}

// Post

export function useGroupPostsQuery(groupId: string) {
  return useQuery({
    queryKey: [QueryKeys.Groups, groupId, QueryKeys.Posts],
    queryFn: () => groupApis.getGroupPosts(groupId),
    enabled: Boolean(groupId),
  });
}

export function useCreateGroupPostMutation(groupId: string) {
  const { dispatch } = useModalContext();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateGroupPostPayload) => groupApis.createGroupPost(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Groups, groupId, QueryKeys.Posts] });
      dispatch({ type: 'close' });
    },
  });
}

// User

export function useGroupUsersQuery(groupId: string) {
  return useQuery({
    queryKey: [QueryKeys.Groups, groupId, QueryKeys.Users],
    queryFn: () => groupApis.getGroupUsers(groupId),
    enabled: Boolean(groupId),
  });
}

export function useAddGroupUsersMutation(groupId: string) {
  const { dispatch } = useModalContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userIds }: { groupId: string; userIds: number[] }) =>
      groupApis.addGroupUsers(groupId, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Groups, groupId, QueryKeys.Users] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Groups, groupId, QueryKeys.UsersNotIn],
      });
      toast.success('Add people successfully!');
      dispatch({ type: 'close' });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message ||
          'Oops! Something went wrong. Please try again later or contact support if the problem persists.',
      );
    },
  });
}

export function useRemoveGroupUserMutation(groupId: string, userId: number) {
  const userMeQuery = useUserMeQuery({ enabled: false });
  const router = useRouter();
  const isCurrentUser = userMeQuery.data?.id === userId;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => groupApis.removeGroupUser(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Groups, groupId, QueryKeys.Users] });
      if (isCurrentUser) {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.Groups] });
        router.push('/');
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message ||
          'Oops! Something went wrong. Please try again later or contact support if the problem persists.',
      );
    },
  });
}
export function useSetAdminMutation(groupId: string, userId: number) {
  // const userMeQuery = useUserMeQuery({ enabled: false });
  // const router = useRouter();
  // const isCurrentUser = userMeQuery.data?.id === userId;

  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<{ message: string }>, { value: boolean }, unknown>({
    mutationFn: (data) => groupApis.setAdmin(groupId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Groups, groupId, QueryKeys.Users] });
      toast.success('Set admin successfully!');
    },
    onError: (error) => {
      toast.error(
        error.response?.data.message ||
          'Oops! Something went wrong. Please try again later or contact support if the problem persists.',
      );
    },
  });
}

//Academic
export function useGroupAcademicQuery(groupId: string) {
  return useQuery({
    queryKey: [QueryKeys.Groups, groupId, QueryKeys.Academic],
    queryFn: () => groupApis.getGroupAcademic(groupId),
    enabled: Boolean(groupId),
  });
}
export function useGroupAcademicSyllabusQuery(groupId: string) {
  return useQuery({
    queryKey: [QueryKeys.Groups, groupId, QueryKeys.Academic, QueryKeys.Syllabus],
    queryFn: () => groupApis.getGroupAcademicPlan(groupId),
    enabled: Boolean(groupId),
  });
}
export function useCourseGroupSlotsQuery(groupId: string) {
  return useQuery({
    queryKey: [QueryKeys.Groups, groupId, QueryKeys.Slots],
    queryFn: () => groupApis.getCourseGroupSlots(groupId),
    enabled: Boolean(groupId),
  });
}
