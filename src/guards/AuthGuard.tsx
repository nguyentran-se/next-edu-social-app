import Box from '@mui/material/Box';
import { UserRole } from '@types';
import { useAppCookies } from 'hooks';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { DecodedToken, __DEV__, appCookies } from 'utils';
import funiversePng from '../../public/favicon-192x192.png';
function redirect() {
  window.location.href = __DEV__
    ? 'http://localhost:8000/verify'
    : process.env.NEXT_PUBLIC_LANDING_URL + 'verify';
}
const VALID_ROLES = [UserRole.User, UserRole.Student, UserRole.Teacher, UserRole.DepartmentAdmin];

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [cookies] = useAppCookies();
  const [isLoaded, setIsLoaded] = useState(false);
  const refreshToken = cookies.refreshToken;
  const accessToken = cookies.accessToken;
  useEffect(() => {
    if (!refreshToken) {
      redirect();
      return;
    }
    if (accessToken) {
      const user = appCookies.getDecodedAccessToken() as DecodedToken;
      if (!VALID_ROLES.includes(user.role)) {
        appCookies.clearAll();
        redirect();
        return;
      }
    }
    setIsLoaded(true);
  }, [refreshToken, accessToken]);
  if (!isLoaded)
    return (
      <Box
        sx={{
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Box sx={{ width: 100, userSelect: 'none' }}>
          <Image
            src={funiversePng}
            alt="Funiverse"
            style={{ animation: 'rotation 1s linear infinite' }}
          />
        </Box>
      </Box>
    );
  return <>{children}</>;
}

export default AuthGuard;
