import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import PostCard from '../components/PostCard';
import { useNewFeedQuery, useUserMeQuery } from 'queries';
import CircularProgress from 'components/CircularProgress';
import Typography from '@mui/material/Typography';
import { useWindowValue } from 'hooks';
import { useEffect } from 'react';
// function initListener(username: string) {
//   const eventSource = new EventSource('https://api.dev.funiverse.world/user/notification');
//   eventSource.onmessage = (event) => {
//     console.log(event);
//   };
//   eventSource.onopen = (e) => console.log('open');

//   eventSource.onerror = (e: any) => {
//     if (e.readyState == EventSource.CLOSED) {
//       console.log('close');
//     } else {
//       console.log(e);
//     }
//     initListener(username);
//   };

//   // eventSource.addEventListener(
//   //   username,
//   //   (e) => {
//   //     console.log(e);
//   //   },
//   //   false,
//   // );
// }
export default function HomePage() {
  const newfeedQuery = useNewFeedQuery();
  const screenWidth = useWindowValue({ path: 'screen.width', initialValue: 1200 });
  const userMeQuery = useUserMeQuery();
  // useEffect(() => {
  //   if (!userMeQuery.data) return;
  // initListener(userMeQuery.data!.username);
  // const eventSource = new EventSource('https://api.dev.funiverse.world/user/notification');
  // eventSource.onmessage = (event) => {
  //   console.log(event);
  // };
  // eventSource.onopen = (e) => console.log('open');
  // eventSource.onerror = (e) => {
  //   if ((e.target as any).readyState === EventSource.CLOSED) {
  //     console.log('close', e);
  //   } else {
  //     console.log(e);
  //   }
  // };
  // eventSource.addEventListener(
  //   userMeQuery.data!.username,
  //   (e) => {
  //     console.log(e);
  //   },
  //   false,
  // );
  //   return () => {};
  // }, [userMeQuery.data]);
  if (newfeedQuery.isLoading) return <PostSkeleton />;
  return (
    <>
      <Head>
        <title>Funiverse</title>
        <meta name="description" content="Funiverse" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack sx={{ width: `calc((${screenWidth}px - 240px) / 2)`, mx: 'auto', mb: 3 }}>
        <Typography variant="h3" color="initial">
          News Feed
        </Typography>
        <Typography variant="body1" color="initial">
          Discover posts from across your organization
        </Typography>
      </Stack>
      {newfeedQuery.data?.content.map((post) => (
        <PostCard key={post.id} data={post} visibleGroup />
      ))}
      {/* <Stack sx={{ width: `calc((${screenWidth}px - 240px) / 2)`, mx: 'auto', mt: 4 }}>
        <Typography variant="h3" color="initial">
          That&apos;s All for Now
        </Typography>
        <Typography variant="h6" color="initial">
          Keep checking back to find the latest posts from across your organization.
        </Typography>
      </Stack> */}
    </>
  );
}

function PostSkeleton() {
  const screenWidth = useWindowValue({ path: 'screen.width', initialValue: 1200 });

  return (
    <>
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 5 }}
          >
            <Stack spacing={1} sx={{ width: `calc((${screenWidth}px - 240px) / 2)`, height: 400 }}>
              <Box sx={{ display: 'flex', gap: '0 10px' }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" sx={{ fontSize: '1rem', flex: 1 }} />
              </Box>
              <Skeleton
                variant="rounded"
                width={`calc((${screenWidth}px - 240px) / 2)`}
                height={100}
              />
              <Skeleton variant="text" sx={{ fontSize: '2rem', flex: 1 }} />
            </Stack>
          </Box>
        ))}
    </>
  );
}
