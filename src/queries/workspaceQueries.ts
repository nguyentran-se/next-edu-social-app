import { useQuery } from '@tanstack/react-query';
import { workspaceApis } from 'apis';
import { QueryKeys } from 'queries';

export function useWorkspaceQuery() {
  return useQuery({
    queryKey: [QueryKeys.Workspace],
    queryFn: workspaceApis.getWorkspace,
  });
}
