import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { AppToaster } from './components/CustomToast.tsx'
import { BrowserRouter } from 'react-router-dom'
import store from './app/store.ts'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <FluentProvider theme={webLightTheme}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AppToaster />
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </FluentProvider>
    </Provider>
  // </StrictMode>,
)