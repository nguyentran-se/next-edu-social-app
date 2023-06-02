import {
  CreateGroupPayload,
  CreateGroupPostPayload,
  Curriculum,
  CurriculumSyllabus,
  Group,
  GroupSlot,
  GroupType,
  GroupUser,
  Post,
  User,
} from '@types';
import axiosClient from './axiosClient';

export const groupApis = {
  getUserGroups: () => axiosClient.get<Group[]>('/group'),
  createUserGroup: (body: CreateGroupPayload) =>
    axiosClient.post('/group', { type: GroupType.Normal, ...body }),
  getUsersNotInGroup: (groupId: string) =>
    axiosClient.get<GroupUser[]>(`user/group/none?id=${groupId}`),
  getGroupDetail: (groupId: string) => axiosClient.get<Group>(`/group/${groupId}`),
  //POST
  createGroupPost: ({ groupId, ...body }: CreateGroupPostPayload) =>
    axiosClient.post(`/group/${groupId}/post`, body),
  getGroupPosts: (groupId: string) => axiosClient.get<Post[]>(`/group/${groupId}/post`),

  //USER
  getGroupUsers: (groupId: string) => axiosClient.get<GroupUser[]>(`/group/${groupId}/users`),
  addGroupUsers: (groupId: string, userIds: number[]) =>
    axiosClient.post(`/group/${groupId}/members`, userIds),
  removeGroupUser: (groupId: string, userId: number) =>
    axiosClient.delete(`/group/${groupId}/user/${userId}`),
  setAdmin: (groupId: string, userId: number, data: { value: boolean }) =>
    axiosClient.put(`/group/${groupId}/users/${userId}/set-admin`, null, { params: data }),
  // Academic
  getGroupAcademic: (groupId: string) => axiosClient.get<Curriculum>(`/group/${groupId}/academic`),
  getGroupAcademicPlan: (groupId: string) =>
    axiosClient.get<CurriculumSyllabus>(`/group/${groupId}/academic/plan`),
  getCourseGroupSlots: (groupId: string) => axiosClient.get<GroupSlot[]>(`/group/${groupId}/slot`),
};
