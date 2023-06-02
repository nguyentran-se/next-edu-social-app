import {
  useQuery,
  QueryKey,
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useState } from 'react';

export const useLazyQuery = <TData>({
  queryKey,
  queryFn,
  ...options
}: UseQueryOptions<TData>): [Function, UseQueryResult<TData, any>] => {
  const [enabled, setEnabled] = useState(false);
  return [
    () => setEnabled(true),
    useQuery<TData, any, TData, any>({ ...options, queryKey, queryFn, enabled }),
  ];
};
