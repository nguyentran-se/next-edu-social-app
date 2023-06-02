import { useQuery } from '@tanstack/react-query';
import { searchApis } from 'apis';
import { QueryKeys } from 'queries';

export function useSearchInWorkspaceQuery(params: { value: string }) {
  return useQuery({
    queryKey: [QueryKeys.Search, QueryKeys.Workspace],
    queryFn: () => searchApis.searchInWorkspace(params),
  });
}

export function useSearchInGroupQuery(gid: string, params: { value: string }) {
  return useQuery({
    queryKey: [QueryKeys.Search, QueryKeys.Groups, gid, params.value],
    queryFn: () => searchApis.searchInGroup(gid, params),
    enabled: Boolean(gid),
  });
}

export function useSearchInChatQuery(params: { value: string }) {
  return useQuery({
    queryKey: [QueryKeys.Search, QueryKeys.Chats, params.value],
    queryFn: () => searchApis.searchInChat(params),
  });
}
