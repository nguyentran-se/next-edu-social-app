import { Callback, Group } from '@types';
import Talk from 'talkjs';
import { Session, User, UserOptions } from 'talkjs/all';
export default class TalkService {
  private static _instance: TalkService = new TalkService();
  private _isTalkReady: boolean = false;
  private appId: string = process.env.NEXT_PUBLIC_TALK_APP_ID;
  constructor() {
    if (TalkService._instance) {
      throw new Error('Error: Instantiation failed: Use Instance() instead of new.');
    }
    TalkService._instance = this;
  }

  public static get Instance() {
    return this._instance;
  }

  public get isTalkReady() {
    return this._isTalkReady;
  }

  public async ready(callback?: Callback) {
    if (!this.isTalkReady) {
      await Talk.ready;
      callback && callback();
    }
    this._isTalkReady = true;
  }

  public createUser(options: UserOptions) {
    try {
      return new Talk.User(options);
    } catch (error) {
      console.log(error);
    }
  }

  public createSession(user: User) {
    try {
      return new Talk.Session({
        appId: this.appId,
        me: user,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public createOneOnOneConversation({
    currentUser,
    otherUser,
    talkSession,
  }: {
    currentUser: User;
    otherUser: User;
    talkSession: Session;
  }) {
    const conversationId = Talk.oneOnOneId(currentUser, otherUser);
    const conversation = talkSession.getOrCreateConversation(conversationId);
    conversation.setParticipant(currentUser);
    conversation.setParticipant(otherUser);
    const chatbox = talkSession.createChatbox();
    chatbox.select(conversation);
    return { chatbox, conversationId };
  }

  public createGroupConversation({
    users,
    groupDetail,
    talkSession,
  }: {
    users: User[];
    groupDetail: Group;
    talkSession: Session;
  }) {
    const conversationId = groupDetail.id;
    const conversation = talkSession.getOrCreateConversation(`${conversationId}`);
    users.forEach((u) => {
      conversation.setParticipant(u);
    });
    conversation.setAttributes({ subject: groupDetail.name });
    const chatbox = talkSession.createChatbox();
    chatbox.select(conversation);
    return { chatbox, conversationId };
  }

  public history() {
    return Talk.getAppMetadata(this.appId);
  }
}
export const talkInstance = TalkService.Instance;
