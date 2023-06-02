import { Callback } from '@types';
import { useUserMeQuery } from 'queries';
import { DependencyList, useCallback, useEffect, useState } from 'react';
import { talkInstance } from 'services';
import { Session, User } from 'talkjs/all';
interface UseTalkProps {
  fn?: Callback;
}
export function useTalk({ fn }: UseTalkProps = {}, deps: DependencyList = []) {
  const [isTalkLoaded, setIsTalkLoaded] = useState(talkInstance.isTalkReady);

  useEffect(() => {
    talkInstance.ready(() => {
      setIsTalkLoaded(true);
    });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const savedFnCallback = useCallback(() => fn, []);

  useEffect(() => {
    if (isTalkLoaded) {
      // Safe to use the SDK here
      savedFnCallback && savedFnCallback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTalkLoaded, ...deps]);

  return isTalkLoaded;
}

export function useTalkSession(): [Session | undefined, User | undefined] {
  const userMeQuery = useUserMeQuery({ enabled: false });
  const [talkSession, setTalkSession] = useState<Session>();
  const [currentUser, setCurrentUser] = useState<User>();
  useEffect(() => {
    if (!userMeQuery.data) return;

    const { id, name, personalMail, avatar, role } = userMeQuery.data;
    const currentUser = talkInstance.createUser({
      id: id,
      name,
      email: personalMail,
      // photoUrl: '',
      // welcomeMessage: 'Hello!',
      // role
    });
    if (!currentUser) return;
    const session = talkInstance.createSession(currentUser);
    setTalkSession(session);
    setCurrentUser(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => session?.destroy();
  }, [userMeQuery.data]);

  return [talkSession, currentUser];
}
