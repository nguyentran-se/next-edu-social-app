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
import IconButton from '@mui/material/IconButton';
import { AiOutlineEdit } from 'react-icons/ai';
import { themeColors } from 'theme';
import { useModalContext } from 'contexts';
import UserForm from './UserForm';
function UserInfo({ data }: { data: User }) {
  const { code, curriculum, phoneNumber, personalMail, name, role } = data;
  const { dispatch } = useModalContext();
  const router = useRouter();
  const isRenderedEditProfileBtn = router.asPath === '/me';
  function handleEditClick() {
    dispatch({
      type: 'open',
      payload: {
        content: () => <UserForm defaultValues={data} />,
        title: 'Edit profile',
      },
      onCreateOrSave: () => {},
    });
  }
  return (
    <Paper
      sx={{
        width: '806px',
        mx: 'auto',
        mt: 4,
        mb: 5,
        display: 'flex',
      }}
    >
      <Box sx={{ flexShrink: 0, flexBasis: 287, borderRight: '1px solid #ccc', p: 2 }}>
        <Typography
          variant="h4"
          color="initial"
          sx={{ mb: 2, fontSize: 18, fontWeight: 700, color: '#000' }}
        >
          About
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Stack sx={{ p: 2, flexGrow: 1 }} spacing={1}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <AboutSection
            header="Role"
            body={[
              {
                icon: <FcBriefcase fontSize={20} />,
                title: capitalizeAndOmitUnderscore(role),
                subTitle: 'Position',
              },
            ]}
          />
          {isRenderedEditProfileBtn && (
            <IconButton onClick={handleEditClick}>
              <AiOutlineEdit color={themeColors.primary} />
            </IconButton>
          )}
        </Box>
        <AboutSection
          header="Contact Information"
          body={[
            {
              icon: <FaUserCircle fontSize={20} />,
              title: name,
              subTitle: 'Name',
            },
            {
              icon: <IoIosMail fontSize={22} color="#23ADFC" />,
              title: personalMail,
              subTitle: 'Email',
            },
            {
              icon: <FcIphone fontSize={22} />,
              title: phoneNumber,
              subTitle: 'Phone',
            },
          ]}
        />
        <AboutSection
          header="Basic Info"
          body={[
            {
              icon: <FcDiploma1 fontSize={20} />,
              title: code ?? '<Empty>',
              subTitle: 'Code',
            },
            {
              icon: <FcReading fontSize={20} />,
              title: 'SE1502',
              subTitle: 'Class',
            },
            {
              icon: <IoSchool fontSize={20} />,
              title: curriculum?.schoolYear,
              subTitle: 'Year',
            },
          ]}
        />
      </Stack>
    </Paper>
  );
}

export default UserInfo;

interface AboutSectionProps {
  header: string;
  body: {
    icon: JSX.Element;
    title: string;
    subTitle: string;
  }[];
}
function AboutSection({ header, body }: AboutSectionProps) {
  return (
    <Stack>
      <Typography
        variant="h4"
        color="initial"
        sx={{ mb: 2, fontSize: 17, fontWeight: 600, color: '#000' }}
      >
        {header}
      </Typography>
      {body.map((b) => (
        <Box key={b.subTitle} sx={{ display: 'flex', alignItems: 'center', gap: '0 12px', mb: 1 }}>
          {b.icon}
          <Stack>
            {b.subTitle === 'Email' ? (
              <Typography
                variant="h4"
                color="initial"
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#000',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
                component={Link}
                href={`mailto:${b.title}`}
              >
                {b.title}
              </Typography>
            ) : (
              <Typography
                variant="h4"
                color="initial"
                sx={{ fontSize: 15, fontWeight: 600, color: '#000' }}
              >
                {b.title}
              </Typography>
            )}
            <Typography
              variant="h4"
              color="initial"
              sx={{ fontSize: 12, fontWeight: 400, color: '#65676B' }}
            >
              {b.subTitle}
            </Typography>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
