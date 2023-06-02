import Paper from '@mui/material/Paper';
import { withGroupDetailLayout } from 'layout';
import React, { useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import SearchInput from 'components/SearchInput';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ChatBubble from '@mui/icons-material/ChatBubble';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { IoChatbubbleSharp } from 'react-icons/io5';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useGroupUsersQuery, useUserMeQuery, useUsersQuery } from 'queries';
import CircularProgress from 'components/CircularProgress';
import { GroupUser } from '@types';
import MemberCard from 'components/MemberCard';
import Head from 'next/head';
function MembersPage() {
  const {
    query: { gid },
  } = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const groupUsersQuery = useGroupUsersQuery(gid as string);

  if (groupUsersQuery.isLoading) return <CircularProgress />;

  const { data } = groupUsersQuery as { data: GroupUser[] };
  const admins = data.filter((user) => user.groupAdmin);

  return (
    <>
      <Head>
        <title>Member | Group | FUniverse</title>
      </Head>
      <Paper sx={{ width: 568, mx: 'auto', p: 2 }}>
        <SectionHeader
          amount={data.length}
          subContent="View and find new and existing members of the group."
        >
          Members
        </SectionHeader>
        <SearchInput
          placeholder="Find a member"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
        <Divider sx={{ my: 3 }} />
        {searchValue ? (
          <Box>
            <SectionHeader>Search result</SectionHeader>
            {data
              .filter((mem) => mem.name.toLowerCase().includes(searchValue.toLowerCase()))
              .map((mem) => (
                <MemberCard key={mem.id} data={mem} />
              ))}
          </Box>
        ) : (
          <Box>
            <SectionHeader amount={admins.length}>Admins & moderators</SectionHeader>
            {admins.map((ad) => (
              <MemberCard key={ad.id} data={ad} />
            ))}
            <SectionHeader>
              Recently added
              <Typography variant="body2" fontSize={13}>
                Newest members of the group appear first. This list also includes people who have
                been invited and who are previewing the group.
              </Typography>
            </SectionHeader>
            {data.map((mem) => (
              <MemberCard
                key={mem.id}
                data={mem}
                // subContent={`Joined about ${dayjs().subtract(32, 'day').fromNow()}`}
              />
            ))}
          </Box>
        )}
      </Paper>
    </>
  );
}

export default withGroupDetailLayout(MembersPage);

function SectionHeader({
  children,
  amount,
  subContent,
}: {
  children: React.ReactNode;
  amount?: number;
  subContent?: string;
}) {
  return (
    <Box>
      <Typography variant="h4" color="initial" fontWeight={600}>
        {children}
        {amount != null && (
          <span color="inherit" style={{ fontWeight: '500' }}>
            {' '}
            · {amount}
          </span>
        )}
      </Typography>
      <Typography variant="body2" fontSize={16} sx={{ mb: 2 }}>
        {subContent}
      </Typography>
    </Box>
  );
}
