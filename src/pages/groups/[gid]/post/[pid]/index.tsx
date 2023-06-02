import CircularProgress from 'components/CircularProgress';
import PostCard from 'components/PostCard';
import { withGroupDetailLayout } from 'layout';
import { useRouter } from 'next/router';
import { usePostDetailQuery } from 'queries';
import React from 'react';
import Box from '@mui/material/Box';
function PostDetailPage() {
  const router = useRouter();
  const pid = router.query.pid as string;
  const { data, isLoading } = usePostDetailQuery(pid);

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ my: 8 }}>
      <PostCard data={data!} />
    </Box>
  );
}

export default withGroupDetailLayout(PostDetailPage);
