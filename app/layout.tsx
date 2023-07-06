import LayoutComWrapper from './(dashboard)/LayoutComWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
      <LayoutComWrapper>{children}</LayoutComWrapper>
      </body>
    </html>
  )
}


//"use client"

// import Loader from '@/components/Loader';
// import { AuthConsumer, AuthProvider } from '@/contexts/JWTAuthContext';
// import { SidebarProvider } from '@/contexts/SidebarContext';
// import createEmotionCache from '@/createEmotionCache';
// import useScrollTop from '@/hooks/useScrollTop';
// import { store } from '@/store';
// import ThemeProviderWrapper from '@/theme/ThemeProvider';
// import { CacheProvider, EmotionCache } from '@emotion/react';
// import { LocalizationProvider } from '@mui/lab';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import { CssBaseline } from '@mui/material';
// import { NextPage } from 'next';
// import { AppProps } from 'next/app';
// import { SnackbarProvider } from 'notistack';
// import { ReactElement, ReactNode } from 'react';
// import { Provider as ReduxProvider } from 'react-redux';

// const clientSideEmotionCache = createEmotionCache();

// type NextPageWithLayout = NextPage & {
//   getLayout?: (page: ReactElement) => ReactNode;
// };

// interface TokyoAppProps extends AppProps {
//   emotionCache?: EmotionCache;
//   Component: NextPageWithLayout;
// }

// export default function RootLayout({
//   children
// }: {
//   children: React.ReactNode;
// }) {
//   // const { Component, emotionCache = clientSideEmotionCache, pageProps } = children;
//   // const getLayout = Component.getLayout ?? ((page) => page);
//   useScrollTop();

//   return (
//     <html>
//       <head>
//         <title>Tokyo White NextJS Typescript Admin Dashboard</title>
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1, shrink-to-fit=no"
//         />
//       </head>
//       <body>
//         <CacheProvider value={clientSideEmotionCache}>
//           <ReduxProvider store={store}>
//             <SidebarProvider>
//               <ThemeProviderWrapper>
//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <AuthProvider>
//                     <SnackbarProvider
//                       maxSnack={6}
//                       anchorOrigin={{
//                         vertical: 'bottom',
//                         horizontal: 'right'
//                       }}
//                     >
//                       <CssBaseline />
//                       <AuthConsumer>
//                         {(auth) =>
//                           !auth.isInitialized ? <Loader /> : { children }
//                         }
//                       </AuthConsumer>
//                     </SnackbarProvider>
//                   </AuthProvider>
//                 </LocalizationProvider>
//               </ThemeProviderWrapper>
//             </SidebarProvider>
//           </ReduxProvider>
//         </CacheProvider>
//       </body>
//     </html>
//   );
// }
