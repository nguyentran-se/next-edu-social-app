import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { z } from 'zod';

function useIdentifier() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  useEffect(() => {
    if (router.isReady) {
      const query = router.query;
      const identifier = query.identifier as string;
      const isValidVerifiedEmail = z.string().email().safeParse(identifier).success;
      if (!identifier || !isValidVerifiedEmail) {
        if (router.asPath.includes('reset-password')) {
          router.replace('reset-password');
        } else {
          router.push('/verify');
        }
        return;
      }
      setIdentifier(identifier);
    }

    return () => {};
  }, [router]);

  return identifier;
}
export { useIdentifier };
