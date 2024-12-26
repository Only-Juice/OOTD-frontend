import './styles/index.css';
import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Spinner } from 'react-bootstrap';
const App = lazy(() => import('./App.tsx'));
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={
      <div className="spinner-container">
        <Spinner animation="border" />
      </div>}>
      <QueryClientProvider client={queryClient}>
        <App queryClient={queryClient} />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider >
    </Suspense>
  </StrictMode >,
)
