// import { __DEV__ } from 'constants';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function useVerifySubdomain() {
  const { asPath, ...router } = useRouter();

  useEffect(() => {
    // if (__DEV__) return;
    const origin =
      typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

    const URL = `${origin}${asPath}`;
    const subdomain = URL.match(/^(?:https?:\/\/)?([^./]+)\./)?.[1];
    if (!subdomain) router.replace(process.env.NEXT_PUBLIC_LANDING_URL);

    return () => {};
  }, [asPath, router]);
}

export { useVerifySubdomain };
