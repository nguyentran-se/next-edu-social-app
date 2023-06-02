import { ThemeProvider } from '@mui/material/styles';
import { Roboto } from '@next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppPropsWithLayout } from '@types';
import 'assets/styles/global.scss';
import { AuthProvider, LayoutProvider, ModalProvider, TalkProvider } from 'contexts';
import Modal from 'contexts/ModalContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AuthGuard } from 'guards';
import { useTalk } from 'hooks';
import { AppLayout } from 'layout';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { queryClient, useGroupsQuery, useUserMeQuery } from 'queries';
import 'quill-mention/dist/quill.mention.css';
import React, { useCallback, useEffect } from 'react';
import { CookiesProvider } from 'react-cookie';
import { Toaster } from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import { TalkService } from 'services';
import { theme } from 'theme';

dayjs.extend(relativeTime);
const roboto = Roboto({ subsets: ['latin'], style: ['normal', 'italic'], weight: ['400', '700'] });
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  useTalk();

  useEffect(() => {
    async function loadQuillMentionModule() {
      await import('quill-mention' as any);
    }
    loadQuillMentionModule();
  }, []);

  const getNestedLayout = Component.getNestedLayout || ((page) => page);

  // WARN: useCallback to not re-render component tree
  const MainLayout = useCallback(function ({ children }: { children: React.ReactNode }) {
    const Layout = Component.MainLayout ? Component.MainLayout : AppLayout;
    return <Layout>{children}</Layout>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <Providers>
        <MainLayout>{getNestedLayout(<Component {...pageProps} />)}</MainLayout>
      </Providers>
    </>
  );
}
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CookiesProvider>
          <ModalProvider>
            <LayoutProvider>
              <AuthProvider>
                <AuthGuard>
                  <TalkProvider>
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                    <Modal />
                    <Toaster />
                  </TalkProvider>
                </AuthGuard>
              </AuthProvider>
            </LayoutProvider>
          </ModalProvider>
        </CookiesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
