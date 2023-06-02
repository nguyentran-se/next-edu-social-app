import { Curriculum } from './curriculum';

export enum UserRole {
  User = 'USER',
  Student = 'STUDENT',
  Teacher = 'TEACHER',
  SystemAdmin = 'SYSTEM_ADMIN',
  DepartmentAdmin = 'OFFICER',
  WorkspaceAdmin = 'WORKSPACE_ADMIN',
}

export interface User {
  id: number;
  name: string;
  code: string;
  role: UserRole;
  schoolYear: string;
  personalMail: string;
  eduMail: string;
  avatar: string;
  phoneNumber: string;
  curriculum: Curriculum;
  active: boolean;
  identifyNumber: string;
}
export interface UserMe {
  id: number;
  name: string;
  code: string;
  identifyNumber: string;
  role: string;
  schoolYear: string;
  personalMail: string;
  eduMail: string;
  avatar: string;
  phoneNumber: string;
  curriculum: Curriculum;
  active: boolean;
  enabled: boolean;
  password: null;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  authorities: Authority[];
  username: string;
}

export interface Authority {
  authority: string;
}

export interface Timetable {
  id: number;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  description: string;
  slot: TimetableSlot;
}

export interface TimetableSlot {
  id: number;
  no: number;
  order: number;
  group: {
    id: number;
    name: string;
    code: null;
    active: boolean;
  };
  room: string;
  date: Date;
}
