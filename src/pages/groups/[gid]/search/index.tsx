import { withGroupDetailLayout } from 'layout';
import { useRouter } from 'next/router';
import { useSearchInGroupQuery } from 'queries';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useWindowValue } from 'hooks';
import CircularProgress from 'components/CircularProgress';
import PostCard from 'components/PostCard';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

function GroupSearchPage() {
  const screenWidth = useWindowValue({ path: 'screen.width', initialValue: 1200 });
  const router = useRouter();
  const { gid, q } = router.query as { gid: string; q: string };
  const params = { value: q };

  const searchInGroupQuery = useSearchInGroupQuery(gid, params);

  if (searchInGroupQuery.isLoading) return <CircularProgress />;
  const hasResult = searchInGroupQuery.data?.length !== 0;
  return (
    <Box sx={{ mb: 3, width: `calc((${screenWidth}px - 240px) / 2)`, mx: 'auto', pb: 8 }}>
      {hasResult ? (
        <Box>
          <Paper sx={{ width: '100%', p: 2, mb: 3 }}>
            <Typography variant="h4">
              Search result for{' '}
              <Box component={'span'} sx={{ fontStyle: 'italic' }}>
                {q}
              </Box>
            </Typography>
          </Paper>
          {searchInGroupQuery.data!.map((post) => (
            <PostCard key={post.id} data={post} />
          ))}
        </Box>
      ) : (
        <Stack alignItems={'center'} justifyContent={'center'} sx={{ mt: 8 }}>
          <Box
            sx={{
              backgroundImage:
                'url("https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/vk9a-08rjIn.png")',
              backgroundPosition:
                '0px -130px; background-size: 130px 286px; width: 128px; height: 128px',
              backgroundRepeat: 'no-repeat',
              display: 'inline-block',
            }}
          ></Box>
          <Typography variant="h4" fontSize={20} color="gray">
            We didn&apos;t find anything in this group
          </Typography>
          <Typography variant="h4" fontSize={17} color="gray" fontWeight={400}>
            Try different keywords or search all of Workplace
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

export default withGroupDetailLayout(GroupSearchPage);
