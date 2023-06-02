import { Group } from './group';
import { User } from './user';

export enum EventType {
  MENTION = 'MENTION',
  NEW_POST = 'NEW_POST',
  NEW_COMMENT = 'NEW_COMMENT',
  REACTION = 'REACTION',
  SET_GROUP_ADMIN = 'SET_GROUP_ADMIN',
  ADD_TO_GROUP = 'ADD_TO_GROUP',
  NEW_SEMESTER = 'NEW_SEMESTER',
}

export enum EventSourceType {
  GROUP = 'GROUP',
  POST = 'POST',
  COMMENT = 'COMMENT',
}

export interface Event {
  id: number;
  actor: Actor;
  receiver: Actor;
  type: EventType;
  sourceId: number;
  sourceType: EventSourceType;
  createdTime: Date;
  read: boolean;
  group: Group;
  term: string;
}

export interface Actor extends User {
  username: string;
}
