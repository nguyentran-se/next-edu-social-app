import { Comment } from './comment';
import { BaseInfo, Owner } from './common';
import { GroupUser } from './group';

export interface Post {
  id: number;
  content: string;
  owner: Owner;
  createdDateTime: Date;
  group: GroupPostResponse;
  comments: Comment[];
}

interface GroupPostResponse extends BaseInfo {}
export interface NewFeedPost {
  content: Post[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}
