import { Dispatch, Reducer, useMemo, useReducer } from 'react';
import { talkInstance } from 'services';
import { ConversationData, Session, User, UserData } from 'talkjs/all';
import { createContext } from 'utils';
interface TalkContextValue {
  session: Session;
  dispatchTalk: Dispatch<TalkAction>;
  selectedConversation: UserData[];
}
type TalkReducerValue = Omit<TalkContextValue, 'dispatchTalk'>;
type TalkAction =
  | {
      type: 'CREATE_SESSION';
      payload: User;
    }
  | {
      type: 'DESTROY_SESSION';
    }
  | {
      type: 'SELECT_CONVERSATION';
      payload: UserData[];
    };

const [Provider, useTalkContext] = createContext<TalkContextValue>('TalkContext');
export { useTalkContext };
function talkReducer(state: TalkReducerValue, action: TalkAction): TalkReducerValue {
  switch (action.type) {
    case 'CREATE_SESSION':
      if (state.session) return state;
      const session = talkInstance.createSession(action.payload);
      return session ? { ...state, session } : { ...state };
    case 'SELECT_CONVERSATION':
      return { ...state, selectedConversation: action.payload };
    case 'DESTROY_SESSION':
      state.session.destroy();
      return { ...state, session: {} as Session };
    default:
      return state;
  }
}
export function TalkProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<Reducer<TalkReducerValue, TalkAction>>(
    talkReducer,
    {} as TalkReducerValue,
  );

  const value: TalkContextValue = { ...state, dispatchTalk: dispatch };
  return <Provider {...value}>{children}</Provider>;
}
