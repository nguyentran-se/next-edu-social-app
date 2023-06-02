import { Event, GroupUser, Timetable, User, UserMe } from '@types';
import axiosClient from './axiosClient';

export const userApis = {
  getMe: () => axiosClient.get<UserMe>('/user/me'),
  getuser: (userId: string | number) => axiosClient.get<User>(`/user/${userId}`),
  updateUser: (userId: string, body: any) => axiosClient.put(`/user/${userId}`, body),
  getUsers: () => axiosClient.get<GroupUser[]>('/workspace/user'),
  getUserEvents: (params: { unread?: boolean } = {}) =>
    axiosClient.get<Event[]>('/user/event', { params }),
  // Event
  updateEvent: (eventId: string | number, body: { read: boolean }) =>
    axiosClient.put(`/event/${eventId}`, body),

  getTimetable: () => axiosClient.get<Timetable[]>('/user/timetable'),
};
