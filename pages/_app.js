import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis'
import { NotificationProvider } from '@web3uikit/core'

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider serverUrl='https://qtm5mljt8bja.usemoralis.com:2053/server' appId='yKm6pPqPnJ6YSYkfp6wvUZvUeL6GUhdKLysTIDug'>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  )

}

export default MyApp
