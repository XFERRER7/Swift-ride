import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import createEmotionCache from '../utils/createEmotionCache'
import { Provider } from 'react-redux'
import { store, persistor } from '@/store'
import { PersistGate } from 'redux-persist/integration/react';


const clientSideEmotionCache = createEmotionCache()

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const theme = createTheme({
    palette: {
      primary: {
        main: '#16141c',
      },
      secondary: {
        main: '#6b7280',
        contrastText: '#fff',
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              opacity: 0.8
            },
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: 'monospace',
            textDecoration: 'none',
          }
        }
      }
    }
  })



  return (
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
      </PersistGate>
    </Provider>
  )
}
