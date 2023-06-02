import { useTalkSession } from 'hooks';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { useTalkContext } from 'contexts';

function ChatsPage() {
  const router = useRouter();
  // const { session: talkSession } = useTalkContext();
  const chatboxRef = useRef<HTMLElement | null>(null);
  const { cid } = router.query as { cid: string };
  const [talkSession] = useTalkSession();

  useEffect(() => {
    if (!cid || !talkSession) return;

    const conversation = talkSession.getOrCreateConversation(cid);
    const chatbox = talkSession.createChatbox();
    chatbox.select(conversation);
    chatbox.mount(chatboxRef.current);
  }, [cid, talkSession]);

  return (
    <Box sx={{ minHeight: 'calc(100vh - 69px)' }}>
      <Box sx={{ height: 'calc(100vh - 69px)' }} ref={chatboxRef}></Box>
    </Box>
  );
}

export default ChatsPage;
