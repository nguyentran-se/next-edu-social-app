import { QueryClient } from '@tanstack/react-query';
export * from './commentQueries';
export * from './groupQueries';
export * from './postQueries';
export * from './searchQueries';
export * from './userQueries';

export const QueryKeys = {
  Groups: 'groups',
  Users: 'users',
  UsersNotIn: 'users-not-in',
  Slug: 'slug',
  Posts: 'posts',
  Academic: 'academic',
  Comments: 'comments',
  Syllabus: 'syllabus',
  Events: 'events',
  Timetables: 'timetables',
  Slots: 'slots',
  Search: 'search',
  Workspace: 'workspace',
  Chats: 'chats',
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});
