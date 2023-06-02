import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { IoBriefcase, IoSchool } from 'react-icons/io5';
import { IoIosMail } from 'react-icons/io';
import { FaUserCircle } from 'react-icons/fa';
import {
  FcReading,
  FcIphone,
  FcBriefcase,
  FcNfcSign,
  FcDiploma1,
  FcReadingEbook,
} from 'react-icons/fc';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserQuery } from 'queries';
import { User } from '@types';
import { capitalizeAndOmitUnderscore } from 'utils';
import UserInfo from 'components/UserInfo';
import Head from 'next/head';
function UserPage() {
  const router = useRouter();
  const { uid } = router.query as { uid: string };
  const userQuery = useUserQuery(uid);
  if (userQuery.isLoading) return <Skeleton variant="rounded" width={806} height={500} />;
  return (
    <>
      <Head>
        <title>Profile | FUniverse</title>
      </Head>
      <UserInfo data={userQuery.data as User} />
    </>
  );
}

export default UserPage;
