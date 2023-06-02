import { withGroupDetailLayout } from 'layout';
import React from 'react';
import pdfImage from 'assets/images/file-pdf_32.png';
import Image from 'next/image';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
function MediaPage() {
  return (
    <>
      <Head>
        <title>Media | Group | FUniverse</title>
      </Head>
      <Box sx={{ width: 568, mx: 'auto', p: 2 }}>
        <Typography variant="h6" color="initial">
          We apologize for any inconvenience, but this page is currently under construction. Our
          team is working hard to bring you the best possible experience, and we appreciate your
          patience. Please check back soon for updates, or contact us if you have any questions or
          concerns. Thank you for your understanding.
        </Typography>
      </Box>
    </>
  );
}

export default withGroupDetailLayout(MediaPage);
